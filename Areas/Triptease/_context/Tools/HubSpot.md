---
status: active
tags: [tool/crm]
category: CRM
area: Triptease
created: 2026-04-16
---

# HubSpot

## What It Does
CRM and marketing automation platform.

## How We Use It
- Website segment tagging for account-based marketing campaigns
- The HubSpot footer script on triptease.com contains the ABM segment tagger
- GTM/Marketing uses for email campaigns (newsletter automation, DBS events), CRM data

## Access
- Dashboard: https://app.hubspot.com

## Used By
- [[ABM Creator]] — segment tagger script in triptease.com footer (currently pointing at staging buzz_key triptease2sbx, needs manual update for production)

## Notes
- HubSpot website footer HTML must be manually updated when switching ABM from staging to production
- Integrates with [[Clay]]/[[Salesforce]] data pipeline
