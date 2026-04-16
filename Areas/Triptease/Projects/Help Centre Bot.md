---
status: paused
priority: medium
tags: [project, automation]
area: Triptease
created: 2026-04-15
updated: 2026-04-16
---

# Help Centre Bot

Detects stale/deprecated Intercom help centre articles by comparing against release notes.

> [!info] PUSHED BACK ~2 WEEKS
> Pushed back for breathing room. Nothing on calendar currently. Working with [[Megan Bryant]]. Will need attention around end of April / early May (target: ~Apr 30 - May 2).

## Stack
pnpm monorepo, Slack Bolt, Prisma, Claude API, Notion API, Railway

## Tech Stack
- [[Claude API]] — content gap detection, article update proposals, sunset verification
- [[Slack]] — bot notifications, review modals, weekly summary
- [[Notion]] — release notes + drafts database reading
- [[Intercom]] — help centre article sync
- [[PostgreSQL]] — content items, articles, evidence, scan state (shared DB with [[Automation Hub]])
- [[Prisma]] — ORM for database access
- [[Railway]] — bot + worker services
- [[GitHub]] — Triptease-Mktg/help-centre-bot.git

## Deployment
- **GitHub**: https://github.com/Triptease-Mktg/help-centre-bot.git
- **Railway Bot**: https://bot-production-c3c5.up.railway.app
- **Railway Worker**: https://worker-production-ce1d.up.railway.app
- **Shared DB**: Postgres-m5QY (postgres-m5qy.railway.internal:5432)
- **DB Public Proxy**: autorack.proxy.rlwy.net:20324

## Next Steps
- [ ] Update scan window to past 1-2 weeks only (not pulling old articles)
- [ ] Add paragraph-level capture from release notes
- [ ] Add review/filtering mechanism for bot suggestions
- [ ] [[Megan Bryant]] to test and provide feedback
- [ ] Re-engage around end of April / early May

## Links
- Code: ~/Desktop/ClaudeProjects/Help Centre

## Project Intelligence
- CLAUDE.md: ~/Desktop/ClaudeProjects/Help Centre/CLAUDE.md
