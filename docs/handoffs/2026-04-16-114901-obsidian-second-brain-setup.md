# Handoff: Obsidian Second Brain Setup — Complete

## Session Metadata
- Created: 2026-04-16 11:49:01
- Project: /Users/nikosummers/Desktop/ClaudeProjects/Obsidian
- Branch: main
- Session duration: ~6 hours (April 15–16, 2026)

### Recent Commits (for context)
  - 99edf51 Update CLAUDE.md with personal context from session
  - 052c6c9 Add daily note for 2026-04-16
  - c7ebee8 bot: append to Recent Context in Areas/Personal/Notes/Charlotte.md
  - 336262c bot: append to Key Facts in Areas/Personal/Notes/Charlotte.md
  - f77fb17 bot: append to [[Charlotte]] / Meep in Daily logs/2026-04-15-personal.md

## Handoff Chain
- **Continues from**: None (fresh start)
- **Supersedes**: None

## Current State Summary

Built Niko's complete AI second brain from scratch in a single session. This includes an Obsidian vault (57 notes, 28 meeting notes from Notion, brand/context docs, project notes), a Telegram personal assistant bot deployed on Railway, two remote scheduled agents (morning Slack briefing + meeting importer), QMD semantic search, macOS Launch Agents, and a git repo syncing the vault to GitHub. Everything is live and operational. The vault is connected to Claude Code globally via ~/.claude/CLAUDE.md and ~/.claude/rules/obsidian.md.

## Codebase Understanding

### Architecture Overview

Three separate systems:
1. **Obsidian vault** (this repo) — markdown second brain at ~/Desktop/ClaudeProjects/Obsidian. Personal and work areas separated. Git-backed to github.com/nikosummerst-ai/dailylog.
2. **Telegram personal bot** (_System/personal-bot/bot.js) — deployed on Railway, runs 24/7. Handles voice/text/photos. Writes to vault via GitHub API (cloud mode). Has webhook for WhatsApp (Tasker integration pending).
3. **Remote scheduled agents** (Anthropic cloud) — morning work briefing (Slack, 9am BST) + meeting note importer (Slack, 6pm BST). No laptop needed.

### Critical Files

| File | Purpose | Relevance |
|------|---------|-----------|
| CLAUDE.md | Vault context + deployment docs for Claude sessions | Read at every session start |
| ~/.claude/CLAUDE.md | Global Claude Code instructions | Already set up with Obsidian section |
| ~/.claude/rules/obsidian.md | Vault search + write rules | Loaded by all Claude Code sessions |
| _System/personal-bot/bot.js | Telegram bot — ~1200 lines | The entire personal bot |
| _System/personal-bot/.env | Bot secrets (local only, gitignored) | TELEGRAM_BOT_TOKEN, ANTHROPIC_API_KEY, OPENAI_API_KEY, TELEGRAM_USER_ID=1512417003, GITHUB_TOKEN, GITHUB_REPO |
| Daily logs/Backlog.md | Master task + deadline list | Updated manually and by agents |
| Areas/Personal/Notes/Charlotte.md | Partner tracking — cross-reference before decisions | Bot uses for "before you say yes" checks |

### Key Patterns Discovered

- **Cloud mode vs local mode**: Bot detects `GITHUB_TOKEN` env var → uses GitHub API to write. Without it → writes to local filesystem. This is how it works on Railway (no local files).
- **Git push auth**: Local git is `nikosummers-sudo` (Triptease SSH) so can't push to personal repo. Must use: `git push https://<PAT>@github.com/nikosummerst-ai/dailylog.git main`
- **Race condition protection**: Message queue in bot.js ensures messages process sequentially (important when user sends voice then text quickly).
- **Bot auto-pull conflicts**: The Railway bot writes to the repo (e.g. Charlotte.md updates). Always `git pull --rebase` before pushing from local.
- **QMD indexing**: Run `qmd update && qmd embed` after adding notes. Launch Agent does this at 12am/12pm automatically.
- **Personal vs work separation**: Telegram bot = personal only. Slack agents = work only. Bot system prompt hard-blocks Triptease/Meeting Notes paths.

## Work Completed

### Tasks Finished

- [x] Vault folder structure (Areas, Daily logs, Meeting Notes, Notes, _System)
- [x] 28 meeting notes from Notion AI Meeting Notes (Dec 2025 - Apr 2026)
- [x] 6 context docs (Brand Voice, Visual Guidelines, Product Reference, Triptease Studio, About Triptease, Automation Stack)
- [x] 7 Triptease project notes with GitHub + Railway deployment links
- [x] Personal area (Charlotte, Wedding, House Checker, About Me)
- [x] Vault CLAUDE.md + global ~/.claude/CLAUDE.md updated + ~/.claude/rules/obsidian.md
- [x] QMD semantic search (57 docs, auto-embeds 12am/12pm)
- [x] Telegram bot v3 (voice, text, photo, webhook, queue, cloud mode, cross-reference memory)
- [x] Railway deploy of Telegram bot (dailylog-production-3114.up.railway.app)
- [x] Morning briefing remote agent (9am BST weekdays → Slack DM, smart with Notion tasks + procrastination detection)
- [x] Meeting note importer remote agent (6pm BST weekdays → Slack DM)
- [x] 8am personal briefing (Telegram, personal life only)
- [x] 5pm evening check-in (Telegram, before Charlotte gets home)
- [x] Daily note creation (local cron + remote agent)
- [x] WhatsApp webhook endpoint on bot for Tasker integration
- [x] Obsidian Templater + Periodic Notes plugin configured
- [x] Git repo initialised, pushed to github.com/nikosummerst-ai/dailylog

### Decisions Made

| Decision | Options Considered | Rationale |
|----------|-------------------|-----------|
| Telegram over WhatsApp | WhatsApp (ban risk), Telegram (safe) | No ban risk, simpler API, voice note support |
| Railway for bot | Local only, Railway, Fly.io | User already uses Railway, $5 trial, 24/7 uptime |
| GitHub API for vault writes | Local fs, GitHub API, Notion | Vault is git-backed; GitHub API works from cloud |
| Tasker for WhatsApp notifications | Accessibility service (fragile), Tasker (stable) | Notification listener is robust and ban-safe |
| Separate personal/work | Mixed in one vault | Clean separation avoids leakage; personal = Telegram, work = Slack |

## Pending Work

### Immediate Next Steps

1. **Set up Tasker on Samsung S25** — install Tasker + AutoNotification, create profile for Charlotte and Mum's WhatsApp notifications posting to `https://dailylog-production-3114.up.railway.app/whatsapp` with secret `niko-vault-2026`
2. **Add personal email** — Niko wants to connect personal Gmail to the system (was mentioned, not yet done)
3. **WhatsApp chat export parser** — add .txt file parsing to bot for weekly two-way chat sync (discussed, not built)
4. **Populate _context docs** — About Me, About Triptease need richer content filled in by Niko
5. **Fill Charlotte.md** — add her birthday, important dates, preferences over time
6. **Regenerate GitHub PAT** — current token was shared in plaintext in session, should be rotated at https://github.com/settings/tokens

### Blockers/Open Questions

- [ ] GitHub PAT rotation needed (token was shared in chat)
- [ ] Tasker WhatsApp setup not yet done on phone
- [ ] Personal Gmail not yet connected
- [ ] Railway trial expires in ~30 days — Niko will need to add billing

### Deferred Items

- WhatsApp accessibility service for outgoing messages — too fragile, deferred
- Obsidian Sync for mobile — user hasn't set up yet; vault is on GitHub which serves same purpose
- Personal email OAuth — deferred until Niko wants to set it up

## Context for Resuming Agent

### Important Context

- **Git push requires PAT**: `git push https://<PAT>@github.com/nikosummerst-ai/dailylog.git main` — local SSH key is for Triptease account, not personal
- **Bot is on Railway**: Any bot code changes require git push → Railway auto-redeploys
- **Bot writes to GitHub**: In cloud mode, bot writes to vault via GitHub API. When you do `git pull --rebase` you'll often see commits like "bot: append to Charlotte.md"
- **Two vaults conceptually**: Work stuff stays in Obsidian (syncs to Triptease git via local), personal stuff syncs to github.com/nikosummerst-ai/dailylog. They're the same physical folder.
- **Niko is forgetful by design**: The bot's purpose is external memory + cross-referencing. Charlotte bought him a wallet — the bot should know and warn him if mum offers another.
- **Van hire needed Saturday Apr 18**: Charlotte's stuff moving from Christopher's to storage. Need to sort this.
- **Remote agents**: trig_01AEbxhpzxKWSHTBSDch389g (morning briefing), trig_01YU3rGDvyTg16JTpVDJ9LKk (meeting importer). Both at claude.ai/code/scheduled

### Assumptions Made

- Niko's Telegram user ID is 1512417003
- Charlotte = Meep (same person, his partner)
- Work briefing = Slack only, personal briefing = Telegram only — strict separation
- Past events with specific times = assume completed, don't nag
- Railway free trial has ~30 days remaining

### Potential Gotchas

- Always `git pull --rebase` before pushing — bot commits to repo independently
- Bot on Railway needs restart after env var changes (Railway does this automatically on redeploy)
- QMD can get out of sync — run `qmd update && qmd embed` if search returns stale results
- Obsidian plugins (Templater, Periodic Notes) config is in .obsidian/ which is gitignored — settings only exist locally
- Morning briefing cron is session-only (set up with CronCreate). The durable remote agent (Anthropic cloud) handles the actual daily briefing. They're separate things.

## Environment State

### Tools/Services Used

- **QMD** v2.1.0 — `qmd update && qmd embed` to reindex
- **Railway** — personal account, $5/30 days trial, auto-deploys from main branch
- **GitHub** — nikosummerst-ai/dailylog (personal vault repo)
- **Anthropic remote agents** — claude.ai/code/scheduled
- **Obsidian** — installed via Homebrew, vault at ~/Desktop/ClaudeProjects/Obsidian

### Active Processes

- Railway bot (cloud, 24/7): dailylog-production-3114.up.railway.app
- QMD auto-embed Launch Agent: ~/Library/LaunchAgents/com.qmd.auto-embed.plist (12am + 12pm)
- Personal bot Launch Agent: UNLOADED (bot runs on Railway now)

### Environment Variables (names only)

Bot (.env): TELEGRAM_BOT_TOKEN, ANTHROPIC_API_KEY, OPENAI_API_KEY, TELEGRAM_USER_ID, GITHUB_TOKEN, GITHUB_REPO, WEBHOOK_SECRET, PORT

## Related Resources

- Vault repo: https://github.com/nikosummerst-ai/dailylog
- Railway dashboard: https://railway.com (personal account)
- Remote agents: https://claude.ai/code/scheduled
- Telegram bot: https://t.me/nikodailyreminders_bot
- QMD docs: https://github.com/tobilu/qmd
- GitHub PAT rotation: https://github.com/settings/tokens
