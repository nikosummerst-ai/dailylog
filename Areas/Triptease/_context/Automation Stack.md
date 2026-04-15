---
type: context
last-updated: 2026-04-15
---

# Triptease Automation Stack

## Active Automations
- **Guest Personas** — AI-generated hotel guest segments (Python, Railway, Modal)
- **Direct Booking Digest (DBD)** — weekly hospitality newsletter (TypeScript, Express, Slack Bolt)
- **Beeswax ABM Creator** — account-based marketing campaigns (Node.js, Beeswax DSP)
- **Help Centre Bot** — AI assistant for Intercom articles (pnpm monorepo, Slack Bolt, Prisma)
- **Automation Hub** — internal portal for all automations (Next.js 16, Auth.js, Prisma)
- **Cloudprinter** — design asset management and banner generation
- **DBSEvents** — hospitality event scraping (Python, Selenium)

## Shared Infrastructure
- **Deployment**: Railway (staging + production)
- **Database**: PostgreSQL + Prisma ORM
- **AI**: Claude API (Anthropic)
- **Messaging**: Slack (Bolt framework)
- **Data**: BigQuery, Google Sheets
- **Scraping**: Firecrawl, Apify, Selenium
