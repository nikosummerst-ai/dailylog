---
status: active
tags: [project, automation]
area: Triptease
created: 2026-04-15
updated: 2026-04-24
---

# Automation Hub (Ticket System)

Internal portal for all Triptease marketing automations. Dashboard, ticket system, run history.

## Stack
Next.js 16, App Router, TypeScript, Tailwind v4, Auth.js v5, Prisma, PostgreSQL, Railway

## Tech Stack
- [[Claude API]] — AI features in portal
- [[Next.js]] — v16 App Router, TypeScript, standalone Docker
- [[Auth.js]] — v5 Google OAuth (restricted to @triptease.com)
- [[Prisma]] — ORM, schema management, migrations
- [[PostgreSQL]] — shared DB (Postgres-m5QY) with [[Help Centre Bot]]
- [[AWS S3]] — file storage
- [[Slack]] — notifications
- [[Railway]] — hosting
- [[GitHub]] — Triptease-Mktg/Automation-Dashboard.git

## Deployment
- **GitHub**: https://github.com/Triptease-Mktg/Automation-Dashboard.git
- **Railway (prod)**: https://automation-hub-production-b6b5.up.railway.app
- **Shared DB**: Postgres-m5QY (shared with [[Help Centre Bot]])
- **DB Public Proxy**: autorack.proxy.rlwy.net:20324

## Decisions
- **Events tab replaces DBS tab** (Apr 2026) — DBS was one-off; Events is generalisable. DBS Summit 2026 = first list. Future events create new lists.
- **EventList model** is a container above batches — owns the Google Sheet, shareable URL, lifecycle status.
- **mode="events" on GP endpoints** rather than new endpoints — avoids duplicating pipeline orchestration. New `/finalize` endpoint for post-selection resume.
- **Google Sheets via service account** in Shared Drive — personal Drive quota = 0 for service accounts. Must use `supportsAllDrives: true` on all Drive API calls.
- **Prisma schema managed via `db push`** — not migrate; `_prisma_migrations` not maintained.
- **Rep validation via dashboard** — personas selected in-app (8 of 15); no Slack for selection. One DM per batch completion.

## Key Links
- Code: ~/Desktop/ClaudeProjects/Ticket System
- Live: https://automation-hub-production-b6b5.up.railway.app
- Spec: ~/Desktop/ClaudeProjects/Ticket System/docs/superpowers/specs/2026-04-21-events-tab-design.md
- Plan: ~/Desktop/ClaudeProjects/Ticket System/docs/superpowers/plans/2026-04-21-events-tab.md
- Google Sheets service account: automation-hub-events-sheets@adept-ethos-485908-b7.iam.gserviceaccount.com
- Shared Drive folder (Event Lists): 1w1VG0cGYZxEMlLSkRafu5y01FPQAoKdJ

## Project Intelligence
- CLAUDE.md: ~/Desktop/ClaudeProjects/Ticket System/CLAUDE.md

## Recent Work

### 2026-04-21 to 2026-04-24
- Built and shipped full Events tab: list CRUD, hotel run form (single/build/CSV), persona selection modal (8 of 15), Google Sheets integration, CSV download with all copy, Slack notifications, GP backend events mode + /finalize
- Set up Google Cloud service account, Shared Drive folder, Railway env vars
- Deployed both dashboard + GP backend to prod; DBS Summit 2026 rep validation unblocked
- Next: handoff to Megan; reps add hotels, validate personas, download CSV for print team by Apr 30
