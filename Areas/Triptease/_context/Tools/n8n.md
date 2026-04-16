---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# n8n

## What It Does
Open-source workflow automation platform for connecting services and automating data flows.

## How We Use It
- Orchestrates daily CRM data flows between BigQuery, S3, and Guest Personas
- Uploads daily BQ + Revenate CSVs to S3, then triggers /crm-match endpoint

## Access
- Self-hosted or cloud instance

## Used By
- [[Guest Personas]] — daily CRM workflow: extract BQ data → upload to S3 → trigger matching
- [[Guest Persona CRM Tagging]] — N8N framework for 4-hotel CRM pipeline setup

## Notes
- n8n BQ webhook fires to invalidate top 8 cache when new behavioral data arrives
- Table configured for 4 initial hotels (Boardwalk Aruba + 3 Evans Hotels)
- CEO mentioned preference for migrating [[Gumloop]] flows to n8n as cheaper alternative
