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

## Active Automations (linked)
- [[Guest Personas]] — AI-generated hotel guest segments (Python, Railway, Modal)
- [[Direct Booking Digest]] — weekly hospitality newsletter (TypeScript, Express, Slack Bolt)
- [[ABM Creator]] — Beeswax account-based marketing (Node.js, Beeswax DSP)
- [[Help Centre Bot]] — AI assistant for Intercom articles (pnpm monorepo, Slack Bolt, Prisma)
- [[Automation Hub]] — internal portal for all automations (Next.js 16, Auth.js, Prisma)
- [[Cloudprinter]] — design asset management and banner generation
- [[DBSEvents]] — hospitality event scraping (Python, Selenium)
- [[Triptease Studio]] — internal AI content engine

## Shared Infrastructure
- **Deployment**: [[Tools/Railway]] (staging + production)
- **Database**: [[Tools/PostgreSQL]] + [[Tools/Prisma]] ORM
- **AI**: [[Tools/Claude API|Claude API]] (Anthropic)
- **Messaging**: [[Tools/Slack]] (Bolt framework)
- **Data**: [[Tools/Google BigQuery|BigQuery]], [[Tools/Google Sheets|Google Sheets]]
- **Scraping**: [[Tools/Firecrawl]], [[Tools/Apify]], [[Tools/Selenium]]

## Strategic Context

These automations sit inside Triptease's wider AI-first strategy. See:
- [[About Triptease]] — company overview
- [[AI at Triptease]] — AI strategy, internal MCPs, skills repo
- [[OKRs and Strategic Priorities]] — KR2 (40 external AI initiatives) and KR3 (internal AI adoption)
- [[Tools Index]] — full inventory of tools/SaaS
- [[Org Structure]] — squads to coordinate with
