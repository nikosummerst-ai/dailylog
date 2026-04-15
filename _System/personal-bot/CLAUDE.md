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
