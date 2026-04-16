---
status: active
tags: [tool/crm]
category: CRM
area: Triptease
created: 2026-04-16
---

# Revenate

## What It Does
Hotel CRM platform for guest data management and marketing.

## How We Use It
- Daily guest data matching against persona segments
- CRM integration target for [[Guest Persona CRM Tagging]]

## Access
- API access via hotel-specific credentials

## Used By
- [[Guest Personas]] — daily CRM matching: n8n uploads Revenate CSVs → match guests to personas → push tags
- [[Guest Persona CRM Tagging]] — approved hotels: Boardwalk Aruba (1 hotel), Evans Hotels (3 resorts)

## Notes
- Part of a multi-CRM pipeline: Revenate, BookBoost, Growth Solutions, + 1 TBD
- CRM-linked hotels have permanent top 8 cache (no 90-day TTL expiry)
- Revenate API keys still needed from some hotels
