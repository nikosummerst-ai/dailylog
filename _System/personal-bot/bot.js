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

async function processWithClaude(userMessage) {
  const dailyNotePath = await ensurePersonalDailyNote();

  const systemPrompt = `You are Niko's personal life assistant. You receive messages from Niko via Telegram and update his Obsidian vault accordingly.

IMPORTANT CONTEXT:
- Today's date: ${todayISO()} (${todayHuman()})
- Today's personal daily note: ${dailyNotePath}
- Charlotte note: ${KNOWN_NOTES.charlotte}
- Wedding note: ${KNOWN_NOTES.wedding}
- House note: ${KNOWN_NOTES.house}
- Vault root: ${VAULT_PATH}

RULES:
1. If the message is about a DATE/EVENT:
   - If it mentions Charlotte/Meep, also append to the Charlotte note under "Upcoming" or "Notes"
   - If it mentions the wedding / mum / dad's wedding, also append to the wedding note under "Tasks" or "Notes"
   - If it mentions house stuff / property / viewings, also append to the house note under "Notes"
   - Always add date-specific items to the personal daily note in the right section

2. If it's a TODO or REMINDER:
   - Add as a task (- [ ] format) to the relevant project note or today's personal daily note

3. If it's a general note or thought:
   - Add to today's personal daily note under the "Notes" section

4. Use the append_to_note tool to add content. Only use create_note if a completely new file is needed. Use update_note sparingly.

5. You may call multiple tools if the message relates to multiple notes (e.g. a Charlotte event goes in both the daily note and Charlotte.md).

6. After making changes, provide a brief, friendly confirmation of what you did. Keep it short — this goes back as a Telegram message.`;

  const messages = [{ role: "user", content: userMessage }];

  // Tool-use loop: Claude may call tools, we execute them and feed results back
  let response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
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
      max_tokens: 1024,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    });
  }

  // Extract the final text response
  const textBlocks = response.content.filter((b) => b.type === "text");
  return textBlocks.map((b) => b.text).join("\n") || "Done.";
}

// ---------------------------------------------------------------------------
// Bot handlers
// ---------------------------------------------------------------------------

bot.start((ctx) => {
  if (!isAuthorised(ctx)) return;
  ctx.reply(
    "Hey Niko! I'm your personal vault assistant. Send me text or voice notes and I'll update your Obsidian vault."
  );
});

bot.help((ctx) => {
  if (!isAuthorised(ctx)) return;
  ctx.reply(
    "Send me:\n" +
      "- Text messages — I'll figure out where they go in your vault\n" +
      "- Voice notes — I'll transcribe them first, then process\n\n" +
      "I can update your personal daily note, Charlotte's note, the wedding note, or the house checker note."
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
    await ctx.reply("Transcribing your voice note...");

    const transcription = await transcribeVoice(ctx);
    await ctx.reply(`Heard: "${transcription}"\n\nProcessing...`);

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
