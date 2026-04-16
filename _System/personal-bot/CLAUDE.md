# Vault Context
# Niko's Obsidian vault at ~/Desktop/ClaudeProjects/Obsidian is the single source of truth
# for all project context, tools, brand info, and org knowledge.
# DO NOT read vault files unless the task requires it. Use QMD for search.
#
# Key paths:
# - Tools: Areas/Triptease/_context/Tools/ (63 tool notes)
# - Tools Index: Areas/Triptease/_context/Tools Index.md
# - Projects: Areas/Triptease/Projects/ (12 project notes with Tech Stack + CLAUDE.md paths)
# - Brand: Areas/Triptease/_context/Brand Voice and Style Guide.md
# - Product: Areas/Triptease/_context/Product Reference.md
# - Automation Stack: Areas/Triptease/_context/Automation Stack.md
#
# When to check the vault (do this proactively, don't wait to be asked):
# - Planning a new feature/automation → read Tools Index for available tools
# - Starting a new project → read Areas/Triptease/Projects/ for similar patterns
# - Choosing a tech stack → read relevant tool notes for how we already use them
# - Writing content for Triptease → read Brand Voice and Style Guide
#
# Search: Use QMD MCP (query tool) for concept search, or read files directly by path.
# Each project note has a ## Project Intelligence section with CLAUDE.md paths for deep dives.

# Personal Telegram Bot

Telegram bot that writes to the Obsidian vault for personal life tracking.

## Setup
1. Create a Telegram bot via @BotFather
2. Create a `.env` file in this directory with the following keys:
   - `TELEGRAM_BOT_TOKEN` — from BotFather
   - `ANTHROPIC_API_KEY` — Claude API key
   - `OPENAI_API_KEY` — for Whisper transcription
   - `VAULT_PATH` — defaults to the parent Obsidian vault
   - `TELEGRAM_USER_ID` — (optional) restrict bot to Niko's Telegram user ID
3. npm install
4. npm start (or npm run dev for auto-reload)

## How it works
- Receives text/voice messages via Telegram
- Voice notes transcribed via Whisper
- Claude parses intent and determines which vault file to update
- Writes to Obsidian vault markdown files
- Replies with confirmation
