---
status: active
tags: [project, automation]
area: Triptease
created: 2026-04-15
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

## Links
- Code: ~/Desktop/ClaudeProjects/Ticket System

## Project Intelligence
- CLAUDE.md: ~/Desktop/ClaudeProjects/Ticket System/CLAUDE.md
