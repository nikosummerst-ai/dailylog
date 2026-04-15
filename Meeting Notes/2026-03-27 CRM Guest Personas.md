---
date: 2026-03-27
tags: [meeting, guest-personas, crm, revenate, architecture]
attendees: [Niko Summers, Liam]
source: notion
---

# CRM — Guest Personas

Technical planning for Revinate CRM integration.

## Approved Clients
- **Boardwalk Aruba** — 1 hotel
- **Evans Hotels** — 3 resorts (NZ guests spending double room rate on ancillaries)

## Architecture
Daily automation: BigQuery extraction → match Revinate CRM via booking references → push to Revinate UDF fields

## Key Decisions
- Keep personas static (no 90-day deletion) for CRM integrations
- Update "honeymoon" to broader "romance/couples" for Boardwalk
- Run daily automation per hotel
- Navigate event (Apr 14) creates hard deadline
- Liam out Apr 1-8

## 4 CRM Platforms in Pipeline
- Revinate (hard deadline)
- BookBoost
- Growth Solutions
- 1 other TBD

## Action Items
- [ ] Niko to obtain Revinate API keys
- [ ] Niko to work on this evenings while off (Wed through Apr 8)
- [ ] Liam to create BigQuery workflow + N8N server framework
- [ ] Liam to speak with [[Tobias Gunkel]] about prioritization
- [ ] Set up N8N table with 4 hotels and config
- [ ] Ask product about BigQuery access/table setup
