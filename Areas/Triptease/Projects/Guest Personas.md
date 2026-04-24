---
status: active
priority: high
tags: [project, automation]
area: Triptease
created: 2026-04-15
updated: 2026-04-24
---

# Guest Personas

Hotel guest segment generator. Analyzes reviews and hotel data to create JTBD-focused personas.

## Stack
Python, Railway, Modal, Claude API, Firecrawl, Apify, n8n, BigQuery

## Tech Stack
- [[Claude API]] — segment generation, JTBD analysis, refinement, CRM matching
- [[Google Gemini]] — infographic image generation
- [[Firecrawl]] — hotel website crawling
- [[Apify]] — Google Maps + Booking.com review scraping
- [[Google BigQuery]] — behavioral reservation data, CRM extraction
- [[AWS S3]] — asset storage, learnings, CRM data, dashboard
- [[Google Sheets]] — historical output export
- [[Google Places API]] — hotel detail lookup by Place ID
- [[Google Custom Search API]] — Booking.com URL discovery
- [[Slack]] — /guest-segment command, modals, notifications
- [[Railway]] — hosting (prod + dev)
- [[n8n]] — CRM data flow orchestration
- [[Revenate]] — CRM daily guest matching
- [[GitHub]] — Triptease-Mktg/GuestPersonas.git

## Deployment
- **GitHub**: https://github.com/Triptease-Mktg/GuestPersonas.git
- **Railway (prod)**: guest-personas-prod
- **Railway (dev)**: guest-personas-dev
- **S3 Dashboard**: https://guest-segments-generator.s3.amazonaws.com/dashboard.html
- **S3 Bucket**: guest-segments-generator (us-east-1)

## Related Projects
- [[Guest Persona CRM Tagging]] — CRM integration using persona data
- [[DBS Guest Personas Print Assets]] — print booklet for DBS events

## Links
- Code: ~/Desktop/ClaudeProjects/Claude Guest Personas

## Decisions
- **Campaign Copy mode (2026-04-24):** New `mode=campaign` added to `/run` and `/bulk`. Uses Opus 4.7 (not Sonnet) for quality — RevOps is the downstream consumer. Cache-miss falls back to lite pipeline to generate top-8. Output not cached; regenerated fresh. Spec: `docs/superpowers/specs/2026-04-23-guest-personas-campaign-mode-design.md`.

## Key Links
- Design spec: `~/Desktop/ClaudeProjects/Ticket System/docs/superpowers/specs/2026-04-23-guest-personas-campaign-mode-design.md`
- Implementation plan: `~/Desktop/ClaudeProjects/Ticket System/docs/superpowers/plans/2026-04-23-guest-personas-campaign-mode.md`
- Follow-ups (CSV passthrough, test fragility nits): `~/Desktop/ClaudeProjects/Ticket System/docs/superpowers/plans/2026-04-23-campaign-mode-follow-ups.md`

## Recent Work

### 2026-04-24
- Shipped Campaign Copy mode (Phase 1 — upstream Python service): `generate_campaign_summary`, `mode=campaign` on `/run` + `/bulk`, CSV formatter, 14 tests, deployed to prod via `git push triptease main`.
- Phase 2 (Hub Next.js — UI button, API routes, CSV export, dashboard) still outstanding.

## Project Intelligence
- CLAUDE.md: ~/Desktop/ClaudeProjects/Claude Guest Personas/CLAUDE.md
