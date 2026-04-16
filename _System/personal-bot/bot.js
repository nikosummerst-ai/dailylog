import { Telegraf } from "telegraf";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import fs from "fs/promises";
import { readFileSync } from "fs";
import path from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// Load .env file
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = path.join(__dirname, ".env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // No .env file — rely on environment variables
  }
}

loadEnv();

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const VAULT_PATH =
  process.env.VAULT_PATH ||
  "/Users/nikosummers/Desktop/ClaudeProjects/Obsidian";

const DAILY_LOGS_DIR = path.join(VAULT_PATH, "Daily logs");

// ---------------------------------------------------------------------------
// GitHub API helpers for cloud mode
// ---------------------------------------------------------------------------

const GITHUB_REPO = process.env.GITHUB_REPO || "nikosummerst-ai/dailylog";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const isCloudMode = !!GITHUB_TOKEN && !process.env.VAULT_PATH;

function toRelativePath(absolutePath) {
  const vaultPrefix = process.env.VAULT_PATH || "/Users/nikosummers/Desktop/ClaudeProjects/Obsidian";
  return absolutePath.replace(vaultPrefix + "/", "").replace(vaultPrefix, "");
}

async function githubGetFile(filePath) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
  };
}

async function githubWriteFile(filePath, content, message) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const existing = await githubGetFile(filePath);
  const body = {
    message: message || `bot: update ${filePath}`,
    content: Buffer.from(content).toString("base64"),
  };
  if (existing) body.sha = existing.sha;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub write error: ${res.status} ${await res.text()}`);
  return res.json();
}

const KNOWN_NOTES = {
  charlotte: path.join(VAULT_PATH, "Areas/Personal/Notes/Charlotte.md"),
  wedding: path.join(
    VAULT_PATH,
    "Areas/Personal/Projects/Mum and Dads Wedding.md"
  ),
  house: path.join(VAULT_PATH, "Areas/Personal/Projects/House Checker.md"),
};

// Allowed Telegram user ID — REQUIRED in production for privacy.
// Bot silently ignores messages from anyone else.
const ALLOWED_USER_ID = process.env.TELEGRAM_USER_ID
  ? Number(process.env.TELEGRAM_USER_ID)
  : null;

if (!ALLOWED_USER_ID) {
  log("warn", "TELEGRAM_USER_ID not set — bot will accept messages from ALL users. Set this in production!");
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from env
const openai = new OpenAI(); // reads OPENAI_API_KEY from env

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

function log(level, message, data = {}) {
  const ts = new Date().toISOString();
  const extra = Object.keys(data).length ? JSON.stringify(data) : "";
  console.log(`[${ts}] [${level.toUpperCase()}] ${message} ${extra}`.trim());
}

// ---------------------------------------------------------------------------
// Authorisation guard
// ---------------------------------------------------------------------------

function isAuthorised(ctx) {
  if (!ALLOWED_USER_ID) return true;
  return ctx.from?.id === ALLOWED_USER_ID;
}

// ---------------------------------------------------------------------------
// Conversation memory — 24h rolling window for follow-up messages
// ---------------------------------------------------------------------------

const conversationStore = new Map();
const CONVERSATION_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_HISTORY_MESSAGES = 40; // ~10-20 turns depending on tool use

function getConversation(userId) {
  const now = Date.now();
  const conv = conversationStore.get(userId);
  if (!conv || now - conv.lastActivity > CONVERSATION_TTL_MS) {
    const fresh = { messages: [], lastActivity: now };
    conversationStore.set(userId, fresh);
    return fresh;
  }
  conv.lastActivity = now;
  return conv;
}

function trimConversation(conv) {
  while (conv.messages.length > MAX_HISTORY_MESSAGES) {
    conv.messages.shift();
    // Ensure first message is always role: user (Claude API requirement)
    while (conv.messages.length > 0 && conv.messages[0].role !== "user") {
      conv.messages.shift();
    }
  }
}

// Clean up expired conversations every hour
setInterval(() => {
  const now = Date.now();
  for (const [userId, conv] of conversationStore) {
    if (now - conv.lastActivity > CONVERSATION_TTL_MS) {
      conversationStore.delete(userId);
    }
  }
}, 60 * 60 * 1000);

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function todayISO() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function todayHuman() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function personalDailyNotePath() {
  return path.join(DAILY_LOGS_DIR, `${todayISO()}-personal.md`);
}

// ---------------------------------------------------------------------------
// Template for a new personal daily note
// ---------------------------------------------------------------------------

function personalDailyTemplate() {
  return `---
date: ${todayISO()}
tags: [daily, personal]
---

# Personal — ${todayHuman()}

## What's On Today
-

## [[Charlotte]] / Meep
-

## House Stuff
-

## Wedding Planning
-

## Other
-

## Notes

`;
}

// ---------------------------------------------------------------------------
// File operations — the "tools" Claude can call
// ---------------------------------------------------------------------------

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function ensurePersonalDailyNote() {
  const notePath = personalDailyNotePath();

  if (isCloudMode) {
    const relativePath = toRelativePath(notePath);
    const existing = await githubGetFile(relativePath);
    if (!existing) {
      log("info", "Creating personal daily note (cloud)", { path: relativePath });
      await githubWriteFile(relativePath, personalDailyTemplate(), `bot: create daily note ${todayISO()}`);
    }
    return notePath;
  }

  try {
    await fs.access(notePath);
  } catch {
    log("info", "Creating personal daily note", { path: notePath });
    await ensureDir(notePath);
    await fs.writeFile(notePath, personalDailyTemplate(), "utf-8");
  }
  return notePath;
}

/**
 * Append content under a specific section heading in a markdown file.
 * If the section doesn't exist, it is appended at the end.
 */
async function appendToNote(filePath, section, content) {
  if (isCloudMode) {
    const relativePath = toRelativePath(filePath);
    const file = await githubGetFile(relativePath);
    let existing = file ? file.content : "";

    const sectionHeader = `## ${section}`;
    const idx = existing.indexOf(sectionHeader);

    let updated;
    if (idx !== -1) {
      const afterHeader = existing.indexOf("\n", idx);
      if (afterHeader === -1) {
        updated = existing + "\n" + content + "\n";
      } else {
        const nextSection = existing.indexOf("\n## ", afterHeader + 1);
        const insertAt = nextSection !== -1 ? nextSection : existing.length;
        const before = existing.slice(0, insertAt).trimEnd();
        const after = existing.slice(insertAt);
        updated = before + "\n" + content + "\n" + after;
      }
    } else {
      updated = existing.trimEnd() + "\n\n" + sectionHeader + "\n" + content + "\n";
    }

    await githubWriteFile(relativePath, updated, `bot: append to ${section} in ${relativePath}`);
    log("info", "Appended to note (cloud)", { relativePath, section });
    return { success: true, filePath: relativePath, section };
  }

  await ensureDir(filePath);

  let existing;
  try {
    existing = await fs.readFile(filePath, "utf-8");
  } catch {
    // File doesn't exist — create with section
    existing = "";
  }

  const sectionHeader = `## ${section}`;
  const idx = existing.indexOf(sectionHeader);

  let updated;
  if (idx !== -1) {
    // Find the end of the section header line
    const afterHeader = existing.indexOf("\n", idx);
    if (afterHeader === -1) {
      updated = existing + "\n" + content + "\n";
    } else {
      // Find the next section (## ) or end of file
      const nextSection = existing.indexOf("\n## ", afterHeader + 1);
      const insertAt = nextSection !== -1 ? nextSection : existing.length;

      // Trim trailing whitespace in the section, then append
      const before = existing.slice(0, insertAt).trimEnd();
      const after = existing.slice(insertAt);
      updated = before + "\n" + content + "\n" + after;
    }
  } else {
    // Section not found — add at end
    updated = existing.trimEnd() + "\n\n" + sectionHeader + "\n" + content + "\n";
  }

  await fs.writeFile(filePath, updated, "utf-8");
  log("info", "Appended to note", { filePath, section });
  return { success: true, filePath, section };
}

/**
 * Create a new note file (overwrites if it exists).
 */
async function createNote(filePath, content) {
  if (isCloudMode) {
    const relativePath = toRelativePath(filePath);
    await githubWriteFile(relativePath, content, `bot: create ${relativePath}`);
    log("info", "Created note (cloud)", { relativePath });
    return { success: true, filePath: relativePath };
  }

  await ensureDir(filePath);
  await fs.writeFile(filePath, content, "utf-8");
  log("info", "Created note", { filePath });
  return { success: true, filePath };
}

/**
 * Replace specific text in a note.
 */
async function updateNote(filePath, oldText, newText) {
  if (isCloudMode) {
    const relativePath = toRelativePath(filePath);
    const file = await githubGetFile(relativePath);
    if (!file) {
      return { success: false, error: `File not found: ${relativePath}` };
    }

    if (!file.content.includes(oldText)) {
      return { success: false, error: "Old text not found in file" };
    }

    const updated = file.content.replace(oldText, newText);
    await githubWriteFile(relativePath, updated, `bot: update ${relativePath}`);
    log("info", "Updated note (cloud)", { relativePath });
    return { success: true, filePath: relativePath };
  }

  let existing;
  try {
    existing = await fs.readFile(filePath, "utf-8");
  } catch {
    return { success: false, error: `File not found: ${filePath}` };
  }

  if (!existing.includes(oldText)) {
    return { success: false, error: "Old text not found in file" };
  }

  const updated = existing.replace(oldText, newText);
  await fs.writeFile(filePath, updated, "utf-8");
  log("info", "Updated note", { filePath });
  return { success: true, filePath };
}

/**
 * Read the contents of a note from the vault.
 */
async function readNote(filePath) {
  try {
    if (isCloudMode) {
      const relPath = toRelativePath(filePath);
      const file = await githubGetFile(relPath);
      if (!file) return { success: false, error: "File not found" };
      return { success: true, content: file.content };
    }
    const content = await fs.readFile(filePath, "utf-8");
    return { success: true, content };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * List files in a vault directory.
 */
async function listFiles(directory) {
  try {
    if (isCloudMode) {
      const relPath = toRelativePath(directory);
      const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${relPath}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
      });
      if (!res.ok) return { success: false, error: `GitHub API error: ${res.status}` };
      const items = await res.json();
      const files = items.map(i => ({ name: i.name, type: i.type }));
      return { success: true, files };
    }
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = entries.map(e => ({ name: e.name, type: e.isDirectory() ? "dir" : "file" }));
    return { success: true, files };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Search across all vault notes for a keyword or phrase.
 */
async function searchVault(query) {
  try {
    if (isCloudMode) {
      // Use GitHub search API
      const url = `https://api.github.com/search/code?q=${encodeURIComponent(query)}+repo:${GITHUB_REPO}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
      });
      if (!res.ok) return { success: false, error: `GitHub search error: ${res.status}` };
      const data = await res.json();
      const results = (data.items || []).slice(0, 10).map(i => ({ path: i.path, name: i.name }));
      return { success: true, results };
    }
    // Local: recursive grep-like search
    const results = [];
    const lowerQuery = query.toLowerCase();
    async function searchDir(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        if (entry.isDirectory()) {
          await searchDir(fullPath);
        } else if (entry.name.endsWith(".md")) {
          try {
            const content = await fs.readFile(fullPath, "utf-8");
            if (content.toLowerCase().includes(lowerQuery)) {
              const lines = content.split("\n");
              const matchLine = lines.find(l => l.toLowerCase().includes(lowerQuery));
              results.push({ path: fullPath, snippet: matchLine?.trim().slice(0, 120) || "" });
            }
          } catch {}
        }
      }
    }
    await searchDir(VAULT_PATH);
    return { success: true, results: results.slice(0, 15) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ---------------------------------------------------------------------------
// Tool definitions for Claude
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "append_to_note",
    description:
      "Append content under a specific section heading in a markdown note. " +
      "If the file is a personal daily note, use the path returned by today's daily note. " +
      "Sections include: What's On Today, [[Charlotte]] / Meep, House Stuff, Wedding Planning, Other, Notes. " +
      "For project notes (Charlotte.md, House Checker.md, Mum and Dads Wedding.md) use their own sections.",
    input_schema: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Absolute path to the markdown file",
        },
        section: {
          type: "string",
          description:
            "The section heading to append under (without ##), e.g. 'Notes' or '[[Charlotte]] / Meep'",
        },
        content: {
          type: "string",
          description:
            "The markdown content to append (use - for bullet points, - [ ] for tasks)",
        },
      },
      required: ["file_path", "section", "content"],
    },
  },
  {
    name: "create_note",
    description:
      "Create a new markdown note file. Use this only when a brand new note is needed.",
    input_schema: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Absolute path for the new file",
        },
        content: {
          type: "string",
          description: "Full markdown content of the note",
        },
      },
      required: ["file_path", "content"],
    },
  },
  {
    name: "update_note",
    description:
      "Replace specific text in an existing note. Useful for correcting or changing existing entries.",
    input_schema: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Absolute path to the markdown file",
        },
        old_text: {
          type: "string",
          description: "The exact text to find and replace",
        },
        new_text: {
          type: "string",
          description: "The replacement text",
        },
      },
      required: ["file_path", "old_text", "new_text"],
    },
  },
  {
    name: "read_note",
    description: "Read the contents of a note from the vault. Use this to answer questions about what's in the vault, check schedules, look up information about people, projects, or events.",
    input_schema: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Absolute path to the markdown file to read",
        },
      },
      required: ["file_path"],
    },
  },
  {
    name: "list_files",
    description: "List files in a vault directory. Use this to discover what notes exist, find projects, or explore the vault structure.",
    input_schema: {
      type: "object",
      properties: {
        directory: {
          type: "string",
          description: "Absolute path to the directory to list",
        },
      },
      required: ["directory"],
    },
  },
  {
    name: "search_vault",
    description: "Search across all vault notes for a keyword or phrase. Returns matching file paths and snippets. Use this to find relevant notes when you're not sure which file has the information.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search term or phrase to look for",
        },
      },
      required: ["query"],
    },
  },
];

// ---------------------------------------------------------------------------
// Execute tool calls from Claude
// ---------------------------------------------------------------------------

async function executeTool(toolName, toolInput) {
  switch (toolName) {
    case "append_to_note":
      return appendToNote(toolInput.file_path, toolInput.section, toolInput.content);
    case "create_note":
      return createNote(toolInput.file_path, toolInput.content);
    case "update_note":
      return updateNote(toolInput.file_path, toolInput.old_text, toolInput.new_text);
    case "read_note":
      return readNote(toolInput.file_path);
    case "list_files":
      return listFiles(toolInput.directory);
    case "search_vault":
      return searchVault(toolInput.query);
    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

// ---------------------------------------------------------------------------
// Voice transcription via Whisper
// ---------------------------------------------------------------------------

async function transcribeVoice(ctx) {
  const fileId = ctx.message.voice.file_id;
  const file = await ctx.telegram.getFile(fileId);
  const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

  // Download to a temp file
  const tmpPath = path.join("/tmp", `voice_${Date.now()}.ogg`);

  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to download voice file: ${response.statusText}`);
  }

  const fileStream = createWriteStream(tmpPath);
  await pipeline(response.body, fileStream);

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: await OpenAI.toFile(await fs.readFile(tmpPath), "voice.ogg"),
      model: "whisper-1",
    });
    log("info", "Transcribed voice note", {
      duration: ctx.message.voice.duration,
      text: transcription.text.slice(0, 100),
    });
    return transcription.text;
  } finally {
    // Clean up temp file
    await fs.unlink(tmpPath).catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// Clean Claude's markdown for Telegram plain text
// ---------------------------------------------------------------------------

function cleanForTelegram(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")   // **bold** → bold
    .replace(/\*(.+?)\*/g, "$1")        // *italic* → italic
    .replace(/__(.+?)__/g, "$1")        // __underline__ → underline
    .replace(/_(.+?)_/g, "$1")          // _italic_ → italic
    .replace(/~~(.+?)~~/g, "$1")        // ~~strike~~ → strike
    .replace(/`(.+?)`/g, "$1")          // `code` → code
    .replace(/#{1,3}\s/g, "")           // ### headings → plain
    .trim();
}

// ---------------------------------------------------------------------------
// Claude conversation — tool use loop
// ---------------------------------------------------------------------------

function buildSystemPrompt(dailyNotePath) {
  return `You are Niko's personal AI assistant and external memory. Niko is forgetful — that's why you exist. You live in his Telegram, manage his Obsidian vault, and most importantly, you CROSS-REFERENCE everything before letting him make decisions.

TODAY: ${todayISO()} (${todayHuman()})

STRICT BOUNDARY: This bot is for Niko's PERSONAL life only. Never read, reference, or mention anything from: Areas/Triptease/, Meeting Notes/, work daily notes (Daily logs/YYYY-MM-DD.md without -personal), or the work Backlog. No work calendar, no work email, no Slack, no Triptease projects. If you accidentally see work content, ignore it completely.

VAULT STRUCTURE (personal files only):
- ${VAULT_PATH}/Areas/Personal/_context/About Me.md — who Niko is, key people, life context
- ${VAULT_PATH}/Areas/Personal/Projects/ — active personal projects
- ${VAULT_PATH}/Areas/Personal/Notes/ — people notes, reference material
- ${VAULT_PATH}/Daily logs/YYYY-MM-DD-personal.md — personal daily notes
- ${VAULT_PATH}/Daily logs/Backlog.md — master task/deadline list

KEY PEOPLE:
- Charlotte (also called "Meep") — Niko's partner. Note: ${KNOWN_NOTES.charlotte}
- Mum & Dad — wedding coming up. Note: ${KNOWN_NOTES.wedding}

KEY PROJECTS:
- House hunting: ${KNOWN_NOTES.house}
- Mum & Dad's wedding: ${KNOWN_NOTES.wedding}
- Personal daily note: ${dailyNotePath}

TOOLS YOU HAVE:
1. append_to_note — add content to an existing note under a section
2. create_note — create a brand new note
3. update_note — replace text in an existing note
4. read_note — read a note's contents
5. search_vault — search all notes for a keyword/phrase
6. list_files — list files in a directory

== CORE BEHAVIOR: CROSS-REFERENCE EVERYTHING ==

This is your most important job. Niko forgets things. Before confirming ANY action, decision, purchase, or commitment, ALWAYS search the vault first for related context. Examples:

- "Mum wants to buy me a wallet" → SEARCH for "wallet" first. If Charlotte already bought one, WARN Niko before he says yes.
- "Thinking of booking a trip in August" → SEARCH for August plans, check Charlotte's note for anything mentioned, check daily notes.
- "Should I buy X?" → SEARCH for X. Has someone already given/bought it? Is there context?
- "Can I do X this weekend?" → READ the daily notes for that weekend, check for conflicts.

NEVER just say "sure, noted!" without checking. The whole point is catching things Niko forgot.

== PEOPLE INTELLIGENCE ==

Every person Niko mentions should have a note in Areas/Personal/Notes/. Each person note tracks:

### Template for person notes:
---
tags: [person, personal]
created: YYYY-MM-DD
---
# [Name]

## About
[Relationship to Niko, how they know each other]

## Important Dates
- [Birthdays, anniversaries]

## Gift History
- [What they've given Niko, what Niko's given them]

## Likes & Interests
- [Things they've mentioned wanting, enjoying, being into]

## Key Facts
- [Job, location, family, anything Niko should remember]

## Recent Context
- [Recent conversations, plans, things they've asked for]

## Notes
-

When Niko mentions something about a person, update their note. When he's about to make a decision involving that person, READ their note first.

== CHARLOTTE / MEEP SPECIAL TRACKING ==

Charlotte is the most important person to track well. Pay extra attention to:
- Things she mentions wanting or liking (gift ideas)
- Things she's done for Niko (gifts, plans, gestures) — so he doesn't accidentally duplicate or dismiss them
- Her schedule, plans, commitments
- Things that matter to her emotionally
- Conversations they've had about plans or decisions

== GIFT & PURCHASE TRACKER ==

When Niko mentions buying, receiving, or giving a gift, log it in the relevant person's note under "Gift History" with the date. This prevents:
- Accepting duplicate gifts
- Forgetting who gave what
- Missing gift ideas

== LOST & FOUND LOG ==

When Niko loses something: log it in the daily note AND search for any existing context about that item.
When something is found: update the original entry.
If someone offers to replace a lost item: CHECK if it's already been found.

== DECISION LOG ==

Important decisions go in the relevant project note or daily note with the date. Examples:
- "We picked the blue tiles" → project note
- "We decided to go to Italy not Spain" → trip project note
- "Charlotte wants the wedding in September" → wedding note

When Niko asks "what did we decide about X?" — search and answer.

== "BEFORE YOU SAY YES" MODE ==

When Niko says something like:
- "Mum offered to..."
- "Thinking of buying..."
- "Should I..."
- "Can I do X on [date]?"
- "Someone invited me to..."
- "[Person] wants to..."

ALWAYS:
1. Search the vault for related context
2. Check for conflicts, duplicates, or things he's forgotten
3. Read relevant person notes
4. Then give your answer WITH context: "Before you say yes — Charlotte already got you a wallet in March. You might want to check with her first."

== RELATIONSHIP MAINTENANCE ==

Track when Niko last mentioned seeing or talking to people. If it's been a while and he asks "who should I catch up with?" — tell him.

== CREATING NEW NOTES ==

New project: ${VAULT_PATH}/Areas/Personal/Projects/[Name].md
---
status: active
tags: [project, personal]
area: Personal
created: ${todayISO()}
---
# [Name]

## Overview

## Tasks
- [ ]

## Decisions

## Notes

New person: ${VAULT_PATH}/Areas/Personal/Notes/[Name].md (use template above)

Always use [[wikilinks]] to connect: [[Charlotte]], [[House Checker]], [[Mum and Dads Wedding]], etc.

== CONVERSATION MEMORY ==

You have access to the last 24 hours of conversation with Niko. Use this to understand follow-up messages. If Niko says "change that", "actually make it...", "no the other one", etc. — look at recent messages to understand what he's referring to. Never ask him to repeat himself if the context is in the conversation history.

== TONE ==

Casual, direct, like a sharp friend who remembers everything. Brief replies but never skip the cross-reference check. If you catch something Niko forgot, say it plainly: "Heads up — [context]. Still want to go ahead?"`;
}

async function processWithClaude(userMessage, userId) {
  const dailyNotePath = await ensurePersonalDailyNote();

  const systemPrompt = buildSystemPrompt(dailyNotePath);

  // Load conversation history (24h rolling window)
  const conv = userId ? getConversation(userId) : { messages: [], lastActivity: Date.now() };
  log("info", `Conversation history: ${conv.messages.length} messages for user ${userId}`);
  const messages = [...conv.messages, { role: "user", content: userMessage }];

  // Tool-use loop: Claude may call tools, we execute them and feed results back
  let response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    tools: TOOLS,
    messages,
  });

  // Process tool calls iteratively
  while (response.stop_reason === "tool_use") {
    const assistantContent = response.content;
    messages.push({ role: "assistant", content: assistantContent });

    const toolResults = [];
    for (const block of assistantContent) {
      if (block.type === "tool_use") {
        log("info", `Claude called tool: ${block.name}`, block.input);
        const result = await executeTool(block.name, block.input);
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }
    }

    messages.push({ role: "user", content: toolResults });

    response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    });
  }

  // Save conversation history (including final assistant response)
  messages.push({ role: "assistant", content: response.content });
  if (userId) {
    conv.messages = messages;
    conv.lastActivity = Date.now();
    trimConversation(conv);
    log("info", `Conversation saved: ${conv.messages.length} messages for user ${userId}`);
  }

  // Extract the final text response
  const textBlocks = response.content.filter((b) => b.type === "text");
  return textBlocks.map((b) => b.text).join("\n") || "Done.";
}

async function processWithClaudeMultimodal(userContent, userId) {
  const dailyNotePath = await ensurePersonalDailyNote();

  const systemPrompt = buildSystemPrompt(dailyNotePath);

  // Load conversation history (24h rolling window)
  const conv = userId ? getConversation(userId) : { messages: [], lastActivity: Date.now() };
  const messages = [...conv.messages, { role: "user", content: userContent }];

  let response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    tools: TOOLS,
    messages,
  });

  while (response.stop_reason === "tool_use") {
    const assistantContent = response.content;
    messages.push({ role: "assistant", content: assistantContent });

    const toolResults = [];
    for (const block of assistantContent) {
      if (block.type === "tool_use") {
        log("info", `Claude called tool: ${block.name}`, block.input);
        const result = await executeTool(block.name, block.input);
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }
    }

    messages.push({ role: "user", content: toolResults });

    response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    });
  }

  // Save conversation history
  messages.push({ role: "assistant", content: response.content });
  if (userId) {
    conv.messages = messages;
    conv.lastActivity = Date.now();
    trimConversation(conv);
  }

  const textBlocks = response.content.filter((b) => b.type === "text");
  return textBlocks.map((b) => b.text).join("\n") || "Done.";
}

// ---------------------------------------------------------------------------
// Message queue — process one message at a time to avoid race conditions
// ---------------------------------------------------------------------------

const messageQueue = [];
let processing = false;

async function enqueue(fn) {
  return new Promise((resolve, reject) => {
    messageQueue.push({ fn, resolve, reject });
    processQueue();
  });
}

async function processQueue() {
  if (processing || messageQueue.length === 0) return;
  processing = true;
  const { fn, resolve, reject } = messageQueue.shift();
  try {
    resolve(await fn());
  } catch (err) {
    reject(err);
  } finally {
    processing = false;
    processQueue();
  }
}

// ---------------------------------------------------------------------------
// Bot handlers
// ---------------------------------------------------------------------------

bot.start((ctx) => {
  if (!isAuthorised(ctx)) return;
  ctx.reply(
    "Hey Niko! I'm your personal assistant. Here's what I can do:\n\n" +
    "\ud83d\udcdd Send me text or voice notes \u2014 I'll add them to your vault\n" +
    "\ud83d\udcf8 Send photos \u2014 I'll describe and save them\n" +
    "\u2753 Ask me questions \u2014 I'll search your vault and answer\n" +
    "\ud83d\udcc5 Ask about scheduling \u2014 I'll check what you've got on\n" +
    "\ud83c\udd95 Tell me about new projects or people \u2014 I'll create notes\n\n" +
    "I manage your personal daily logs, Charlotte notes, house hunting, wedding planning, and anything else you throw at me."
  );
});

bot.help((ctx) => {
  if (!isAuthorised(ctx)) return;
  ctx.reply(
    "Things you can do:\n\n" +
    "Text: 'House viewing Thursday 3pm on Oak Lane'\n" +
    "Voice notes: just talk, I'll transcribe and file it\n" +
    "Photos: send with a caption for context\n" +
    "Questions: 'What's going on with the house hunt?'\n" +
    "Schedule: 'Do I have time to do X this week?'\n" +
    "People: 'Charlotte's mum's birthday is June 12'\n" +
    "Projects: 'Start tracking the garden renovation'\n" +
    "/briefing: Get your personal morning briefing now\n\n" +
    "I update your Obsidian vault automatically."
  );
});

bot.command("briefing", async (ctx) => {
  if (!isAuthorised(ctx)) return;
  await ctx.reply("Pulling together your briefing...");
  await sendDailyBriefing();
});

bot.command("evening", async (ctx) => {
  if (!isAuthorised(ctx)) return;
  await ctx.reply("Checking what's on for tonight...");
  await sendEveningCheckIn();
});

// Handle text messages
bot.on("text", async (ctx) => {
  if (!isAuthorised(ctx)) return;

  const text = ctx.message.text;
  log("info", "Received text message", {
    from: ctx.from.id,
    text: text.slice(0, 100),
  });

  await enqueue(async () => {
    try {
      await ctx.sendChatAction("typing");
      const reply = await processWithClaude(text, ctx.from.id);
      await ctx.reply(cleanForTelegram(reply));
    } catch (err) {
      log("error", "Failed to process text message", {
        error: err.message,
        stack: err.stack,
      });
      await ctx.reply("Something went wrong processing that. Check the logs.");
    }
  });
});

// Handle voice messages
bot.on("voice", async (ctx) => {
  if (!isAuthorised(ctx)) return;

  log("info", "Received voice message", {
    from: ctx.from.id,
    duration: ctx.message.voice.duration,
  });

  await enqueue(async () => {
    try {
      await ctx.sendChatAction("typing");

      const transcription = await transcribeVoice(ctx);

      await ctx.sendChatAction("typing");
      const reply = await processWithClaude(transcription, ctx.from.id);
      await ctx.reply(cleanForTelegram(reply));
    } catch (err) {
      log("error", "Failed to process voice message", {
        error: err.message,
        stack: err.stack,
      });
      await ctx.reply("Something went wrong processing that voice note. Check the logs.");
    }
  });
});

// Handle photo messages
bot.on("photo", async (ctx) => {
  if (!isAuthorised(ctx)) return;

  const caption = ctx.message.caption || "";
  const photo = ctx.message.photo[ctx.message.photo.length - 1]; // highest res
  const file = await ctx.telegram.getFile(photo.file_id);
  const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

  log("info", "Received photo", { from: ctx.from.id, caption: caption.slice(0, 50), fileId: photo.file_id });

  await enqueue(async () => {
    try {
      await ctx.sendChatAction("typing");

      // Download photo
      const response = await fetch(fileUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mediaType = "image/jpeg";

      // Send to Claude with vision
      const userContent = [
        { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
      ];
      if (caption) {
        userContent.push({ type: "text", text: caption });
      } else {
        userContent.push({ type: "text", text: "I'm sending you a photo. Describe what you see and ask me what I'd like to do with it \u2014 save it as a note, add it to a project, etc." });
      }

      const reply = await processWithClaudeMultimodal(userContent, ctx.from.id);
      await ctx.reply(cleanForTelegram(reply));
    } catch (err) {
      log("error", "Failed to process photo", { error: err.message, stack: err.stack });
      await ctx.reply("Couldn't process that photo. Check the logs.");
    }
  });
});

// Handle document messages
bot.on("document", async (ctx) => {
  if (!isAuthorised(ctx)) return;

  const doc = ctx.message.document;
  const caption = ctx.message.caption || "";

  log("info", "Received document", { from: ctx.from.id, fileName: doc.file_name, mimeType: doc.mime_type });

  try {
    await ctx.sendChatAction("typing");

    if (doc.mime_type?.startsWith("image/")) {
      const file = await ctx.telegram.getFile(doc.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const response = await fetch(fileUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      const base64 = buffer.toString("base64");

      const userContent = [
        { type: "image", source: { type: "base64", media_type: doc.mime_type, data: base64 } },
        { type: "text", text: caption || `Document: ${doc.file_name}. What should I do with this?` },
      ];
      const reply = await processWithClaudeMultimodal(userContent, ctx.from.id);
      await ctx.reply(cleanForTelegram(reply));
    } else {
      // For non-image docs, just note the file name and caption
      const text = `I received a document: ${doc.file_name} (${doc.mime_type}). ${caption}`;
      const reply = await processWithClaude(text, ctx.from.id);
      await ctx.reply(cleanForTelegram(reply));
    }
  } catch (err) {
    log("error", "Failed to process document", { error: err.message, stack: err.stack });
    await ctx.reply("Couldn't process that document. Check the logs.");
  }
});

// ---------------------------------------------------------------------------
// WhatsApp webhook — receives messages from Tasker/AutoNotification
// ---------------------------------------------------------------------------

import { createServer } from "http";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "niko-vault-2026";
const WEBHOOK_PORT = process.env.PORT || 3000;

const webhookServer = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/whatsapp") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);

        // Simple auth check
        if (data.secret !== WEBHOOK_SECRET) {
          res.writeHead(401);
          res.end("Unauthorized");
          return;
        }

        const sender = data.sender || "Unknown";
        const message = data.message || "";
        const app = data.app || "WhatsApp";

        log("info", "Received WhatsApp webhook", { sender, message: message.slice(0, 100) });

        // Process through Claude with WhatsApp context
        const prompt = `WhatsApp message from ${sender}:\n"${message}"\n\nThis was intercepted from Niko's ${app}. Extract any useful information — events, plans, dates, decisions, requests, things to remember. Update the vault accordingly. If the sender is a known person, update their note too. If it's just casual chat with no actionable info, say "Nothing to log" and don't write to any files.`;

        await enqueue(async () => {
          const reply = await processWithClaude(prompt);
          log("info", "WhatsApp processed", { sender, reply: reply.slice(0, 100) });

          // Send summary to Telegram so Niko knows what was logged
          if (!reply.toLowerCase().includes("nothing to log")) {
            try {
              await bot.telegram.sendMessage(
                process.env.TELEGRAM_USER_ID,
                cleanForTelegram(`[${app}: ${sender}] ${reply}`)
              );
            } catch (err) {
              log("error", "Failed to send Telegram notification", { error: err.message });
            }
          }
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        log("error", "Webhook error", { error: err.message });
        res.writeHead(400);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end("ok");
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

// ---------------------------------------------------------------------------
// Daily personal briefing — runs every morning at 8am BST
// ---------------------------------------------------------------------------

async function sendDailyBriefing() {
  log("info", "Running daily personal briefing...");

  try {
    // Read ONLY personal files — no work stuff
    const today = todayISO();
    const personalDailyPath = `Daily logs/${today}-personal.md`;
    const charlottePath = `Areas/Personal/Notes/Charlotte.md`;
    const aboutMePath = `Areas/Personal/_context/About Me.md`;

    // Include last 3 days of personal notes for recent context
    const recentDays = [];
    for (let i = 1; i <= 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      recentDays.push(`Daily logs/${iso}-personal.md`);
    }

    // Personal files + Backlog (has deadlines and tasks with dates)
    const backlogPath = "Daily logs/Backlog.md";
    const filesToRead = [personalDailyPath, charlottePath, aboutMePath, backlogPath, ...recentDays];
    const context = [];

    for (const filePath of filesToRead) {
      try {
        const result = isCloudMode
          ? await githubGetFile(filePath)
          : await fs.readFile(path.join(VAULT_PATH, filePath), "utf-8");

        if (result) {
          const content = isCloudMode ? result.content : result;
          context.push(`--- ${filePath} ---\n${content}`);
          log("info", `Briefing: loaded ${filePath}`);
        }
      } catch (err) {
        log("info", `Briefing: skipped ${filePath}`, { error: err.message });
      }
    }

    // List personal projects
    const projectsDir = "Areas/Personal/Projects";
    let projectFiles = [];
    try {
      if (isCloudMode) {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${projectsDir}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
        });
        if (res.ok) {
          const items = await res.json();
          projectFiles = items.filter(i => i.name.endsWith(".md")).map(i => i.name);
        }
      } else {
        const entries = await fs.readdir(path.join(VAULT_PATH, projectsDir));
        projectFiles = entries.filter(e => e.endsWith(".md"));
      }
    } catch {}

    // Read each active project
    for (const pf of projectFiles) {
      const fp = `${projectsDir}/${pf}`;
      const result = isCloudMode
        ? await githubGetFile(fp).catch(() => null)
        : await fs.readFile(path.join(VAULT_PATH, fp), "utf-8").catch(() => null);
      if (result) {
        const content = isCloudMode ? result.content : result;
        if (content.includes("status: active")) {
          context.push(`--- ${fp} ---\n${content}`);
        }
      }
    }

    // List people notes
    const peopleDir = "Areas/Personal/Notes";
    try {
      let peopleFiles = [];
      if (isCloudMode) {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${peopleDir}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
        });
        if (res.ok) {
          const items = await res.json();
          peopleFiles = items.filter(i => i.name.endsWith(".md")).map(i => i.name);
        }
      } else {
        const entries = await fs.readdir(path.join(VAULT_PATH, peopleDir));
        peopleFiles = entries.filter(e => e.endsWith(".md"));
      }
      for (const pf of peopleFiles) {
        const fp = `${peopleDir}/${pf}`;
        const result = isCloudMode
          ? await githubGetFile(fp).catch(() => null)
          : await fs.readFile(path.join(VAULT_PATH, fp), "utf-8").catch(() => null);
        if (result) {
          const content = isCloudMode ? result.content : result;
          context.push(`--- ${fp} ---\n${content}`);
        }
      }
    } catch {}

    log("info", `Briefing: ${context.length} files loaded, isCloudMode=${isCloudMode}`);

    const briefingPrompt = `You are Niko's PERSONAL morning briefing assistant. It's ${todayHuman()}. Personal life only — NO work, Triptease, Slack, or work projects.

VAULT CONTENTS:
${context.join("\n\n")}

Create a SHORT, focused briefing covering ONLY:

1. **Today** — events, plans, viewings, appointments happening TODAY with times. If nothing, say "Clear day."
2. **Charlotte / Meep** — only if something involves her today or needs a decision this week.
3. **This week** — things with ACTUAL DATES in the next 7 days that Niko should prepare for. Check the Backlog deadlines table and project task lists for dated items. Also include anything marked URGENT or ASAP. Nothing further out than 7 days unless marked ASAP/URGENT.

RULES:
- Scan the Backlog deadlines table and all project notes for tasks with dates in the next 7 days.
- Include ASAP/URGENT tasks regardless of date.
- Past events today: skip, they're done.
- No project status updates. No "active projects" list. Only surface specific tasks with dates or urgency.
- Keep it casual, short, scannable. Skip empty sections entirely.
- Don't make stuff up — only report what's in the notes.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: briefingPrompt }],
    });

    const briefingText = response.content
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n");

    await bot.telegram.sendMessage(
      process.env.TELEGRAM_USER_ID,
      cleanForTelegram(briefingText)
    );

    log("info", "Daily briefing sent");
  } catch (err) {
    log("error", "Failed to send daily briefing", { error: err.message, stack: err.stack });
  }
}

// ---------------------------------------------------------------------------
// Evening check-in — 5pm BST
// ---------------------------------------------------------------------------

async function sendEveningCheckIn() {
  log("info", "Running evening check-in...");

  try {
    const today = todayISO();
    const personalDailyPath = `Daily logs/${today}-personal.md`;
    const charlottePath = `Areas/Personal/Notes/Charlotte.md`;
    const backlogPath = `Daily logs/Backlog.md`;

    const filesToRead = [personalDailyPath, backlogPath, charlottePath];
    const context = [];

    for (const filePath of filesToRead) {
      const result = isCloudMode
        ? await githubGetFile(filePath).catch(() => null)
        : await fs.readFile(path.join(VAULT_PATH, filePath), "utf-8").catch(() => null);
      if (result) {
        const content = isCloudMode ? result.content : result;
        context.push(`--- ${filePath} ---\n${content}`);
      }
    }

    // Also read active projects
    const projectsDir = "Areas/Personal/Projects";
    try {
      let projectFiles = [];
      if (isCloudMode) {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${projectsDir}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
        });
        if (res.ok) {
          const items = await res.json();
          projectFiles = items.filter(i => i.name.endsWith(".md")).map(i => i.name);
        }
      } else {
        const entries = await fs.readdir(path.join(VAULT_PATH, projectsDir));
        projectFiles = entries.filter(e => e.endsWith(".md"));
      }
      for (const pf of projectFiles) {
        const fp = `${projectsDir}/${pf}`;
        const result = isCloudMode
          ? await githubGetFile(fp).catch(() => null)
          : await fs.readFile(path.join(VAULT_PATH, fp), "utf-8").catch(() => null);
        if (result) {
          const content = isCloudMode ? result.content : result;
          if (content.includes("status: active")) {
            context.push(`--- ${fp} ---\n${content}`);
          }
        }
      }
    } catch {}

    const prompt = `You are Niko's evening check-in assistant. It's 5pm on ${todayHuman()}. Niko finishes work at 6pm and Charlotte gets home after that. Based on the vault notes, give him a quick heads-up on what he needs to sort before the evening.

VAULT CONTENTS:
${context.join("\n\n")}

Cover ONLY what's relevant for THIS EVENING:

1. Anything left to do today that hasn't happened yet (events with times after 5pm, errands, tasks)
2. Anything Charlotte-related — is she expecting something? Did she ask for anything? Plans tonight?
3. Quick errands — anything that needs doing before shops close or before Charlotte gets back
4. Tomorrow preview — anything first thing tomorrow morning he should prep for tonight

RULES:
- Events earlier today with specific times: SKIP, already happened
- Be very brief — this is a quick 5pm nudge, not a full briefing
- If there's genuinely nothing, just say "Nothing urgent for tonight. Enjoy your evening."
- Don't repeat the morning briefing. Only mention things relevant to the next few hours.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.filter(b => b.type === "text").map(b => b.text).join("\n");

    await bot.telegram.sendMessage(
      process.env.TELEGRAM_USER_ID,
      cleanForTelegram(text)
    );

    log("info", "Evening check-in sent");
  } catch (err) {
    log("error", "Failed to send evening check-in", { error: err.message, stack: err.stack });
  }
}

// ---------------------------------------------------------------------------
// Scheduler — 8am morning briefing + 5pm evening check-in
// ---------------------------------------------------------------------------

function msUntilNextTime(hour) {
  const now = new Date();
  const londonTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
  const target = new Date(londonTime);
  target.setHours(hour, 0, 0, 0);
  if (londonTime >= target) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - londonTime.getTime();
}

function scheduleRecurring(hour, label, fn) {
  function scheduleNext() {
    const ms = msUntilNextTime(hour);
    const hours = Math.round(ms / 3600000 * 10) / 10;
    log("info", `Next ${label} in ${hours} hours`);
    setTimeout(async () => {
      const day = new Date().toLocaleString("en-US", { timeZone: "Europe/London", weekday: "short" });
      if (day !== "Sat" && day !== "Sun") {
        await fn();
      }
      scheduleNext();
    }, ms);
  }
  scheduleNext();
}

function scheduleDailyBriefings() {
  scheduleRecurring(8, "morning briefing", sendDailyBriefing);
  scheduleRecurring(17, "evening check-in", sendEveningCheckIn);
}

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------

function shutdown(signal) {
  log("info", `Received ${signal}, shutting down...`);
  bot.stop(signal);
  webhookServer.close();
  process.exit(0);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

// ---------------------------------------------------------------------------
// Launch
// ---------------------------------------------------------------------------

async function main() {
  // Validate required env vars
  const required = ["TELEGRAM_BOT_TOKEN", "ANTHROPIC_API_KEY", "OPENAI_API_KEY"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    console.error(
      "Create a .env file with these values. See CLAUDE.md for setup instructions."
    );
    process.exit(1);
  }

  log("info", `Running in ${isCloudMode ? "cloud" : "local"} mode`, {
    repo: isCloudMode ? GITHUB_REPO : undefined,
    vault: isCloudMode ? undefined : VAULT_PATH,
  });

  // Start webhook server
  webhookServer.listen(WEBHOOK_PORT, () => {
    log("info", `Webhook server listening on port ${WEBHOOK_PORT}`);
  });

  // Schedule 8am morning briefing + 5pm evening check-in
  scheduleDailyBriefings();

  log("info", "Starting personal bot...");
  await bot.launch();
  log("info", "Bot is running. Waiting for messages...");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
