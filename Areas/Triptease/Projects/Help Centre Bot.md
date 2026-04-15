---
status: active
tags: [project, automation]
area: Triptease
created: 2026-04-15
---

# Help Centre Bot

Detects stale/deprecated Intercom help centre articles by comparing against release notes.

## Stack
pnpm monorepo, Slack Bolt, Prisma, Claude API, Notion API, Railway

## Deployment
- **GitHub**: https://github.com/Triptease-Mktg/help-centre-bot.git
- **Railway Bot**: https://bot-production-c3c5.up.railway.app
- **Railway Worker**: https://worker-production-ce1d.up.railway.app
- **Shared DB**: Postgres-m5QY (postgres-m5qy.railway.internal:5432)
- **DB Public Proxy**: autorack.proxy.rlwy.net:20324

## Links
- Code: ~/Desktop/ClaudeProjects/Help Centre
