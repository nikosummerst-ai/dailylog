---
status: active
tags: [tool/data]
category: Data
area: Triptease
created: 2026-04-16
---

# Google BigQuery

## What It Does
Google's serverless data warehouse for large-scale SQL analytics.

## How We Use It
- Behavioral reservation data for guest persona enrichment
- BQ reservation system that force-inserts segments backed by behavioral data
- Daily CRM data extraction for guest persona matching

## Access
- Console: https://console.cloud.google.com/bigquery

## Used By
- [[Guest Personas]] — behavioral data enrichment (journeys per segment), BQ reservation system (≥30 journeys threshold), CRM daily extraction via n8n
- [[Guest Persona CRM Tagging]] — daily BQ extraction → match CRM via booking references → push to CRM

## Notes
- BQ data not always present — all code must handle behavioral_segments=None/[] gracefully
- n8n uploads daily BQ CSVs to S3 for CRM matching
- BQ reservation system runs after rank_to_top_15, before enrich_with_behavioral_data
- Underlying data layer for [[Looker]] dashboards
- Has dedicated squad (#squad-commercial-data)
