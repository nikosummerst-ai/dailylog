---
status: active
priority: high
tags: [project, automation]
area: Triptease
created: 2026-04-15
updated: 2026-04-16
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

## Project Intelligence
- CLAUDE.md: ~/Desktop/ClaudeProjects/Claude Guest Personas/CLAUDE.md
