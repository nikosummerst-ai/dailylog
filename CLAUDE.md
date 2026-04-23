# Obsidian Vault — Niko's Second Brain

## Who I Am
Niko Summers — AI & Automation Specialist at Triptease (London).
I build marketing automations, AI-powered tools, and content systems for the hospitality industry.
- Partner: Charlotte (also called Meep). Christopher is Charlotte's brother.
- Moving Meep's stuff from Christopher's to storage on Sat Apr 18. Need van hire. Also picking up a bed.
- Mum & Dad's wedding coming up — May 9 deadline mentioned in backlog.
- House hunting active (House Checker project).
- Personal Telegram bot: t.me/nikodailyreminders_bot (Railway, dailylog-production-3114.up.railway.app)
- GitHub PAT needed for pushes: generate at https://github.com/settings/tokens (repo scope, classic)

## Vault Structure
- `Areas/` — Business areas and personal. Each has `_context/` (canonical docs), `Projects/`, `Content/`, `Notes/`
  - `Areas/Triptease/` — All Triptease work
  - `Areas/Personal/` — Personal projects and notes
- `Daily logs/` — One note per day + pinned Backlog
- `Meeting Notes/` — Meeting transcripts and summaries
- `Notes/` — Evergreen reference notes (SOPs, research, ideas)
- `_System/` — Templates, attachments, and bot code (personal-bot/, meeting-importer/)

## The _context/ Pattern
Each area's `_context/` folder holds canonical docs about that business/domain.
These are the single source of truth. When something changes, update the file in `_context/` — every agent and project that references it gets the update automatically.

## Note Conventions
- Frontmatter: `status` (active/paused/done), `tags`, `area`, `date`/`created`
- Use [[wikilinks]] for internal connections
- Tags: lowercase, hyphenated (#project, #meeting, #automation)
- Tasks: `- [ ]` open, `- [x]` done
- Daily notes: `YYYY-MM-DD.md` in `Daily logs/`

## What Claude Can Do
- Create and edit notes following the conventions above
- Search the vault for relevant context before asking me
- Link related notes with [[wikilinks]]
- Extract tasks from daily notes into project files
- Generate summaries from daily notes
- Research topics and save to Notes/ or the relevant Area's Notes/

## What Claude Should NOT Do
- Never delete notes — move to an Archive/ folder instead
- Never change a note's filename without asking
- Never modify files in `_System/Templates/`
- Don't create files in `_System/attachments/`
- Don't edit raw meeting transcripts — add notes below them

## Git & Deployment

### Repository
- **GitHub**: https://github.com/nikosummerst-ai/dailylog.git (Niko's personal GitHub account)
- Local git uses Triptease SSH key (`nikosummers-sudo`), which can't push to the personal repo
- **To push**: `git push origin main` — PAT is stored in the remote URL (run `git remote get-url origin` to verify)
- If PAT expires, generate a new classic PAT at https://github.com/settings/tokens (needs `repo` scope) and update with: `git remote set-url origin https://<NEW_PAT>@github.com/nikosummerst-ai/dailylog.git`
- `.gitignore` excludes: `.obsidian/`, `.claude/`, `.env`, `_System/*/node_modules/`

### Personal Telegram Bot (Railway)
- **Code**: `_System/personal-bot/` (bot.js, Dockerfile, railway.toml)
- **Railway**: deployed on Niko's personal Railway account (trial, $5/30 days)
- **Root directory in Railway**: `_System/personal-bot`
- **Bot**: https://t.me/nikodailyreminders_bot
- **Telegram user ID**: 1512417003
- Runs in **cloud mode** (writes to vault via GitHub API, not local filesystem)
- Railway env vars needed: `TELEGRAM_BOT_TOKEN`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `TELEGRAM_USER_ID`, `GITHUB_TOKEN`, `GITHUB_REPO=nikosummerst-ai/dailylog`
- Auto-deploys when you push to `main`
- **⚠️ State file**: `_System/bot-state/conversations.json` (NOT `_System/personal-bot/state/`). State was moved outside Railway's watched root directory because every state-write commit was triggering a redeploy → 409 crash loop. Do NOT move it back inside `_System/personal-bot/`.
- **⚠️ `[skip deploy]`** in commit messages does NOT prevent Railway redeploys — Railway ignores this tag.

### To deploy changes to the bot:
1. Edit `_System/personal-bot/bot.js`
2. `git add -A && git commit -m "description"`
3. `git push origin main` (PAT is stored in the remote URL)
4. Railway auto-redeploys

### Local Launch Agents (macOS)
- **QMD auto-embed**: `~/Library/LaunchAgents/com.qmd.auto-embed.plist` — runs `qmd update && qmd embed` at 12am and 12pm
- **Personal bot (disabled)**: `~/Library/LaunchAgents/com.niko.personal-bot.plist` — unloaded since bot now runs on Railway

### Obsidian Git Plugin (auto-sync)
- **Plugin**: `obsidian-git` — installed in `.obsidian/plugins/obsidian-git/`
- Auto-pulls from GitHub every **3 minutes** when Obsidian is open
- Auto-pushes local changes every **5 minutes**
- This is how bot commits (meeting notes, vault updates) appear in Obsidian automatically
- No manual `git pull` needed while Obsidian is open

### Remote Scheduled Agents (Anthropic cloud, no laptop needed)
- **Morning Briefing**: `trig_01AEbxhpzxKWSHTBSDch389g` — **every day** 8am UTC (9am BST) → Slack DM. Reads Gmail, Calendar, Slack, Notion tasks. AI & Tool Releases section covers ~100 tools (all major AI labs, vibe-coding IDEs, design, marketing/SaaS). Max 6 release bullets per briefing.
- **AI Releases – Real Time**: `trig_01PCu1hLcSMAu8T7mQwbMTU7` — 4× daily at 8/12/16/20 UTC (9am/1pm/5pm/9pm BST), every day. Scans X + web for new releases in the last 4h. Posts `🚀 Fresh AI & Tool Releases` Slack DM only if something new; exits silently otherwise.
- **Meeting Note Importer**: `trig_01YU3rGDvyTg16JTpVDJ9LKk` — **ENABLED** — runs hourly 9am-5pm BST weekdays. Checks Google Calendar attendance (only imports meetings Niko attended). Strips Notion `@Today HH-MM (BST)` suffix from titles. Strong filename sanitisation prevents `\n`-suffix duplicates.
- Manage at: https://claude.ai/code/scheduled

### Meeting Note Importer (Railway service — code only, not deployed)
- **Code**: `_System/meeting-importer/` (index.js, Dockerfile, railway.toml)
- Not deployed — remote Claude trigger handles imports instead
- Railway env vars if deployed: `NOTION_API_KEY`, `GITHUB_TOKEN`, `GITHUB_REPO=nikosummerst-ai/dailylog`
- Optional: `SLACK_BOT_TOKEN` (for DM on import), `CRON_SCHEDULE`, `LOOKBACK_MINUTES`
- Health check: `GET /health` on the Railway service URL

### QMD Semantic Search
- Collection: `obsidian` pointing at this vault
- Auto-embeds twice daily via Launch Agent
- Manual: `qmd update && qmd embed`
- MCP server configured in `~/.claude.json` for Claude Code access
