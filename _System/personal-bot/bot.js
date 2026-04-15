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

// Allowed Telegram user ID — set in .env to restrict access to Niko only.
// Leave blank during development to allow all users.
const ALLOWED_USER_ID = process.env.TELEGRAM_USER_ID
  ? Number(process.env.TELEGRAM_USER_ID)
  : null;

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
// Claude conversation — tool use loop
// ---------------------------------------------------------------------------

function buildSystemPrompt(dailyNotePath) {
  return `You are Niko's personal AI assistant. You live in his Telegram and manage his personal Obsidian vault — his second brain for life outside work.

TODAY: ${todayISO()} (${todayHuman()})

VAULT STRUCTURE:
- ${VAULT_PATH}/Areas/Personal/_context/About Me.md — who Niko is, key people, life context
- ${VAULT_PATH}/Areas/Personal/Projects/ — active personal projects (each has tasks, notes, status)
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

CAPABILITIES — you can:
1. **Add events, tasks, and notes** to the vault (append_to_note, create_note, update_note)
2. **Read any note** to answer questions (read_note)
3. **Search the vault** to find information (search_vault)
4. **List files** to discover what exists (list_files)
5. **Create new projects** — make a new .md file in Areas/Personal/Projects/ with frontmatter (status, tags, created date) and sections (Overview, Tasks, Notes)
6. **Track people** — create new person notes in Areas/Personal/Notes/ with sections (Important Dates, Notes, Upcoming)

BEHAVIORS:
- When Niko asks a QUESTION ("do I have time this week?", "what's going on with the house?", "when is X?"), READ the relevant notes first using read_note and search_vault, then answer based on what you find. Don't guess.
- When Niko mentions a NEW person you haven't seen before, create a person note in Areas/Personal/Notes/
- When Niko mentions a NEW project or ongoing thing, create a project note in Areas/Personal/Projects/
- When Niko sends a photo with context, describe what you see and save relevant info to the right note
- When Niko asks about scheduling/time, read the daily note and backlog to understand what's already planned
- Always add date-specific items to today's personal daily note AND the relevant project/person note
- Use - [ ] for tasks, - for notes/events
- Be conversational and brief in replies — this is Telegram, not an essay
- If you're not sure what to do, ask Niko

CREATING NEW NOTES:
- New project: ${VAULT_PATH}/Areas/Personal/Projects/[Name].md with frontmatter: status (active), tags ([project, personal]), area (Personal), created (today's date). Sections: Overview, Tasks, Notes
- New person: ${VAULT_PATH}/Areas/Personal/Notes/[Name].md with frontmatter: tags ([person, personal]), created (today's date). Sections: About, Important Dates, Notes, Upcoming
- Use [[wikilinks]] to connect notes: [[Charlotte]], [[House Checker]], [[Mum and Dads Wedding]], etc.

TONE: Casual, helpful, like a sharp personal assistant who knows your life. Brief replies.`;
}

async function processWithClaude(userMessage) {
  const dailyNotePath = await ensurePersonalDailyNote();

  const systemPrompt = buildSystemPrompt(dailyNotePath);

  const messages = [{ role: "user", content: userMessage }];

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

  // Extract the final text response
  const textBlocks = response.content.filter((b) => b.type === "text");
  return textBlocks.map((b) => b.text).join("\n") || "Done.";
}

async function processWithClaudeMultimodal(userContent) {
  const dailyNotePath = await ensurePersonalDailyNote();

  const systemPrompt = buildSystemPrompt(dailyNotePath);

  const messages = [{ role: "user", content: userContent }];

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

  const textBlocks = response.content.filter((b) => b.type === "text");
  return textBlocks.map((b) => b.text).join("\n") || "Done.";
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
    "\ud83d\udcac Text: 'House viewing Thursday 3pm on Oak Lane'\n" +
    "\ud83c\udfa4 Voice notes: just talk, I'll transcribe and file it\n" +
    "\ud83d\udcf8 Photos: send with a caption for context\n" +
    "\u2753 Questions: 'What's going on with the house hunt?'\n" +
    "\ud83d\udcc5 Schedule: 'Do I have time to do X this week?'\n" +
    "\ud83d\udc64 People: 'Charlotte's mum's birthday is June 12'\n" +
    "\ud83d\udcc1 Projects: 'Start tracking the garden renovation'\n\n" +
    "I update your Obsidian vault automatically."
  );
});

// Handle text messages
bot.on("text", async (ctx) => {
  if (!isAuthorised(ctx)) return;

  const text = ctx.message.text;
  log("info", "Received text message", {
    from: ctx.from.id,
    text: text.slice(0, 100),
  });

  try {
    await ctx.sendChatAction("typing");
    const reply = await processWithClaude(text);
    await ctx.reply(reply);
  } catch (err) {
    log("error", "Failed to process text message", {
      error: err.message,
      stack: err.stack,
    });
    await ctx.reply("Something went wrong processing that. Check the logs.");
  }
});

// Handle voice messages
bot.on("voice", async (ctx) => {
  if (!isAuthorised(ctx)) return;

  log("info", "Received voice message", {
    from: ctx.from.id,
    duration: ctx.message.voice.duration,
  });

  try {
    await ctx.sendChatAction("typing");

    const transcription = await transcribeVoice(ctx);

    await ctx.sendChatAction("typing");
    const reply = await processWithClaude(transcription);
    await ctx.reply(reply);
  } catch (err) {
    log("error", "Failed to process voice message", {
      error: err.message,
      stack: err.stack,
    });
    await ctx.reply("Something went wrong processing that voice note. Check the logs.");
  }
});

// Handle photo messages
bot.on("photo", async (ctx) => {
  if (!isAuthorised(ctx)) return;

  const caption = ctx.message.caption || "";
  const photo = ctx.message.photo[ctx.message.photo.length - 1]; // highest res
  const file = await ctx.telegram.getFile(photo.file_id);
  const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

  log("info", "Received photo", { from: ctx.from.id, caption: caption.slice(0, 50), fileId: photo.file_id });

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

    const reply = await processWithClaudeMultimodal(userContent);
    await ctx.reply(reply);
  } catch (err) {
    log("error", "Failed to process photo", { error: err.message, stack: err.stack });
    await ctx.reply("Couldn't process that photo. Check the logs.");
  }
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
      const reply = await processWithClaudeMultimodal(userContent);
      await ctx.reply(reply);
    } else {
      // For non-image docs, just note the file name and caption
      const text = `I received a document: ${doc.file_name} (${doc.mime_type}). ${caption}`;
      const reply = await processWithClaude(text);
      await ctx.reply(reply);
    }
  } catch (err) {
    log("error", "Failed to process document", { error: err.message, stack: err.stack });
    await ctx.reply("Couldn't process that document. Check the logs.");
  }
});

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------

function shutdown(signal) {
  log("info", `Received ${signal}, shutting down...`);
  bot.stop(signal);
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
  log("info", "Starting personal bot...");
  await bot.launch();
  log("info", "Bot is running. Waiting for messages...");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
