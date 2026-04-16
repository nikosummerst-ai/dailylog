# Handoff: Obsidian Bot Improvements & Work Briefing Overhaul

## Session Metadata
- Created: 2026-04-16 15:27:23
- Project: /Users/nikosummers/Desktop/ClaudeProjects/Obsidian
- Branch: main
- Session duration: ~4 hours

### Recent Commits (for context)
  - aa59bed Bot: update ALL occurrences when a plan changes
  - e106180 Fix House Checker: Summer Seat viewing confirmed 11am (was TBC)
  - 5f02dae Bot: log all webhook messages including nothing-to-log ones
  - 7b98594 Bot: add [skip deploy] to vault write commit messages
  - a34bebc Bot: pre-load daily note when conversation history is empty
  - 24c09c0 Bot: pre-load daily note when conversation history is empty
  - 69f648c Bot: add scheduling intelligence with availability rules
  - cca115e Tick off past viewings + add auto-complete rule to bot
  - ea6459c Add wikilinks across personal notes for knowledge graph
  - 6fad5f3 Add project notes, priorities, and Help Centre Bot reminder
  - 43e05b8 Add 24h conversation memory + simplify briefings

## Handoff Chain
- **Continues from**: 2026-04-16-114901-obsidian-second-brain-setup.md
- **Supersedes**: None

## Current State Summary

Extensive improvements to the Telegram personal bot, Slack work briefing, and Obsidian vault structure. Added 24h conversation memory to the bot (with daily-note-fallback for Railway redeploy resilience), simplified both personal and work briefings to focus on today, added scheduling intelligence, auto-logging of plans, wikilink enforcement, auto-completion of past events, and project priority context. Created 7 new Triptease project notes, set up an AI & Automation Session prep agent, and updated the hourly meeting note importer. Added AI tool research (Reddit + X via OpenAI/xAI APIs) to the morning Slack briefing. Tasker setup for WhatsApp forwarding is in progress but not yet triggering.

## Codebase Understanding

### Architecture Overview

Same three-system architecture from previous session:
1. **Obsidian vault** (this repo) — markdown second brain, git-backed to GitHub
2. **Telegram personal bot** (_System/personal-bot/bot.js) — Railway, cloud mode, writes via GitHub API
3. **Remote scheduled agents** (Anthropic cloud) — morning briefing, meeting importer, AI session prep

**Key discovery this session**: The bot's GitHub API writes create commits on `main`, which trigger Railway auto-deploys, wiping the in-memory conversation store. Mitigated with `[skip deploy]` in commit messages (may or may not work) and a daily-note-preload fallback.

### Critical Files

| File | Purpose | Relevance |
|------|---------|-----------|
| _System/personal-bot/bot.js | Telegram bot — ~600 lines now | ALL bot changes happen here |
| CLAUDE.md | Vault context for Claude sessions | Updated with Christopher fix, deploy instructions |
| Daily logs/Backlog.md | Master deadlines + task list | Now read by personal briefing, has all project deadlines |
| Areas/Triptease/Projects/*.md | 7 new work project notes | ABM Creator, HotelGEOChecker, Guest Persona CRM Tagging, Landing Page, DBS Print Assets, AI & Automation Session, Help Centre Bot (updated) |
| Areas/Personal/Projects/House Checker.md | House viewings tracker | Viewings with dates, auto-complete applies here |

### Key Patterns Discovered

- **Railway redeploy cycle**: Bot writes to GitHub → commit on main → Railway redeploys → conversation memory wiped. Mitigated with `[skip deploy]` in commit messages and daily-note-preload fallback
- **Bot system prompt structure**: Sections are `== SECTION NAME ==` format, processed as a single template literal in `buildSystemPrompt()`
- **Cloud mode**: `isCloudMode = !!GITHUB_TOKEN && !process.env.VAULT_PATH` — bot uses GitHub API for all reads/writes on Railway
- **GITHUB_TOKEN on Railway may be expired**: Was returning 401 on briefing file reads. User was asked to update it multiple times but hasn't confirmed
- **Conversation memory**: In-memory Map, 24h TTL, 40 message cap. When empty, bot pre-loads today's daily note as context fallback

## Work Completed

### Tasks Finished

- [x] Add 24h conversation memory to Telegram bot (in-memory with daily-note fallback)
- [x] Simplify personal daily brief — today only + 7-day lookahead, no project dumps
- [x] Simplify work briefing — Today's Focus (1-2 tasks), calendar, Waiting on You, AI Updates
- [x] Add project priorities to work briefing prompt (HIGH/URGENT/ACTIVE/LOW/PAUSED)
- [x] Update work briefing Slack filtering — only surface messages where someone is blocked/waiting
- [x] Remove HotelGEOChecker inbox, LinkedIn, newsletters from briefing
- [x] Add AI tool research to morning briefing (Reddit via OpenAI API + X via xAI API)
- [x] Create 7 Triptease project notes with priorities and context
- [x] Update Backlog with new projects and Help Centre Bot reminder (Apr 30)
- [x] Create AI & Automation Session prep agent (Wednesdays 9am, Slack DM)
- [x] Update meeting note importer to run hourly (9am-5pm) and write to vault via GitHub API
- [x] Add Christopher (Charlotte's brother) to bot's KEY PEOPLE
- [x] Add auto-log plans rule — bot logs without asking
- [x] Add scheduling intelligence — weekdays 9-6 work, lunch 12-2, weekends free
- [x] Add wikilink enforcement — all notes must link people and projects
- [x] Fix existing notes with wikilinks (Charlotte.md, daily notes, Birthday Itinerary)
- [x] Create Christopher.md person note
- [x] Add auto-complete past events (checks current time, not just date)
- [x] Add current time (BST) to bot system prompt
- [x] Add `[skip deploy]` to bot's GitHub commit messages
- [x] Add daily-note preload as conversation memory fallback
- [x] Add diagnostic logging to briefing and conversation memory
- [x] Update bot to log ALL webhook messages (including "nothing to log")
- [x] Add rule: update ALL occurrences when a plan changes
- [x] Fix CLAUDE.md — Christopher is Charlotte's brother, deploy uses `git push origin main`
- [x] Store GitHub PAT in git remote URL

### Decisions Made

| Decision | Options Considered | Rationale |
|----------|-------------------|-----------|
| In-memory conversation + daily-note fallback | Redis, GitHub persistence, file-based | Simplest approach; Railway filesystem is ephemeral, Redis adds infra, daily-note fallback handles redeploy case |
| `[skip deploy]` in commit messages | Disable auto-deploy, separate branch, persistent volume | Can't change Railway config from CLI; skip-deploy is code-only fix |
| AI research via OpenAI/xAI APIs in remote agent | Local cron with /last30days script, HN API only | Remote agent has Bash access, can curl APIs directly; keys provided by user |
| Meeting notes write directly to GitHub | Webhook on bot, local cron | User explicitly said work stuff stays off personal bot |
| Hourly meeting importer (not 5pm daily) | Keep at 5pm, every 30 min | User wanted more frequent updates; hourly is reasonable balance |

## Pending Work

### Immediate Next Steps

1. **Tasker WhatsApp forwarding** — AutoNotification event is configured but NOT triggering on Samsung S25. Profile is enabled, notification access granted, battery unrestricted. User needs to try "Fill From Current" in AutoNotification to see exact notification values WhatsApp sends. The webhook itself works (tested via curl).
2. **Confirm GITHUB_TOKEN updated on Railway** — The personal briefing (Telegram) can't read vault files due to 401 "Bad credentials". User was told to update GITHUB_TOKEN to `[stored in git remote URL — run `git remote get-url origin` to see]` in Railway dashboard → Variables. Not confirmed done.
3. **Test personal briefing** — Once GITHUB_TOKEN is updated, run `/briefing` on Telegram. Should now show viewings, wedding speech, and 7-day lookahead.
4. **Verify `[skip deploy]` works** — Check Railway logs after the bot writes to vault — does it still restart? If yes, try `[railway skip]` or other patterns.
5. **Test morning Slack briefing** — Triggered but user hasn't confirmed AI Updates section appeared. Check Slack DM.

### Blockers/Open Questions

- [ ] GITHUB_TOKEN on Railway — still 401? User asked to update, unconfirmed
- [ ] Tasker not triggering — Samsung S25 specific issue, need to debug with "Fill From Current"
- [ ] `[skip deploy]` in commit messages — does Railway respect this? Unverified
- [ ] AI session prep agent skips next week (DBS automations topic) — runs Apr 22 anyway, user can ignore
- [ ] Meeting note importer writes to GitHub with PAT embedded in prompt — security consideration

### Deferred Items

- WhatsApp chat export parser (.txt file parsing for two-way sync) — not started
- Personal Gmail connection — not started
- Populate _context docs (About Me, About Triptease) — not started
- Fill Charlotte.md with more details (birthday, preferences) — ongoing via bot
- Obsidian Sync for mobile — user hasn't set up
- QMD reindex after all these changes — should run `qmd update && qmd embed`

## Context for Resuming Agent

### Important Context

- **Git push**: `git push origin main` — PAT stored in remote URL, no need for explicit token
- **Bot deploys on push**: Any push to main triggers Railway redeploy. Bot's own vault writes also create commits (with `[skip deploy]`).
- **Always pull before push**: `git pull --rebase origin main` — bot commits to repo independently. Use `git stash` if there are local unstaged changes.
- **Personal vs work boundary**: Telegram bot = personal ONLY. Slack agents = work ONLY. Bot system prompt hard-blocks work paths.
- **Bot system prompt is large**: ~200 lines in `buildSystemPrompt()`. Sections: AUTO-LOG, LINKING, AUTO-COMPLETE, SCHEDULING, CROSS-REFERENCE, PEOPLE INTELLIGENCE, CHARLOTTE TRACKING, CONVERSATION MEMORY, TONE.
- **Three remote agents**: Morning Briefing (`trig_01AEbxhpzxKWSHTBSDch389g`, 8am weekdays), Meeting Importer (`trig_01YU3rGDvyTg16JTpVDJ9LKk`, hourly 9-5 weekdays), AI Session Prep (`trig_01DhFdh2KHF3A8XuDdNW58kT`, Wed 9am)
- **API keys in remote agent prompts**: OpenAI and xAI keys are embedded in the morning briefing prompt for AI research. GitHub PAT is in the meeting importer prompt for vault writes.
- **Christopher is Charlotte's brother**, not Niko's

### Assumptions Made

- Niko's Telegram user ID is 1512417003
- Charlotte = Meep (same person)
- Work hours: 9am-6pm weekdays, lunch 12-2pm
- Weekends: free for personal errands
- Railway `[skip deploy]` in commit messages will prevent redeploys (unverified)
- The bot's daily-note-preload fallback adequately handles conversation memory loss

### Potential Gotchas

- **Always `git pull --rebase` before push** — bot writes to repo independently via GitHub API
- **GITHUB_TOKEN on Railway may be expired** — causes 401 on all vault reads in briefing
- **Bot restarts on every vault write** if `[skip deploy]` doesn't work — conversation memory lost
- **Meeting importer has GitHub PAT in prompt** — if PAT rotates, update the trigger
- **QMD index may be stale** — run `qmd update && qmd embed` after significant vault changes
- **Tasker on Samsung** — Samsung kills background services aggressively; Tasker + AutoNotification need Unrestricted battery + notification access + locked in Recent Apps
- **Multiple deploys from rapid pushes** — the bot can end up in a restart loop if you push multiple times quickly

## Environment State

### Tools/Services Used

- **Railway** — personal account, bot at dailylog-production-3114.up.railway.app
- **GitHub** — nikosummerst-ai/dailylog, PAT in remote URL
- **Anthropic remote agents** — 3 triggers (morning briefing, meeting importer, AI session prep)
- **QMD** — semantic search over vault, auto-embeds 12am/12pm via LaunchAgent
- **OpenAI API** — used by morning briefing for Reddit research + bot for Whisper transcription
- **xAI API** — used by morning briefing for X/Twitter research

### Active Processes

- Railway bot (cloud, 24/7): dailylog-production-3114.up.railway.app
- QMD auto-embed LaunchAgent: ~/Library/LaunchAgents/com.qmd.auto-embed.plist (12am + 12pm)
- Remote agents: 3 scheduled triggers on Anthropic cloud

### Environment Variables

Bot (.env on Railway): TELEGRAM_BOT_TOKEN, ANTHROPIC_API_KEY, OPENAI_API_KEY, TELEGRAM_USER_ID, GITHUB_TOKEN, GITHUB_REPO, WEBHOOK_SECRET, PORT

## Related Resources

- Previous handoff: .claude/handoffs/2026-04-16-114901-obsidian-second-brain-setup.md
- Vault repo: https://github.com/nikosummerst-ai/dailylog
- Railway dashboard: https://railway.com
- Remote agents: https://claude.ai/code/scheduled
- Telegram bot: https://t.me/nikodailyreminders_bot
- GitHub PAT rotation: https://github.com/settings/tokens
