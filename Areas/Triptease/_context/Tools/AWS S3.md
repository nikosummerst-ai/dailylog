---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# AWS S3

## What It Does
Amazon's object storage service for files, assets, and data.

## How We Use It
- Asset storage for guest persona reports (infographics, PDFs, reviews, website crawl data)
- Learning system storage for the Guest Personas pipeline
- CRM daily data exchange between n8n and Guest Personas
- Static dashboard hosting

## Access
- Bucket: guest-segments-generator (us-east-1)
- Dashboard: https://guest-segments-generator.s3.amazonaws.com/dashboard.html

## Used By
- [[Guest Personas]] — infographic images, PDF reports, reviews markdown, website crawl data, learnings files, CRM daily CSVs, top 8 cache, cost tracking dashboard
- [[Automation Hub]] — file storage

## Notes
- Key S3 paths: top8_cache/, learnings/, crm_daily/, crm_results/, crm_aggregate/
- Top 8 cache has 90-day TTL (permanent if crm_linked: true)
- Learning system files: pipeline_learnings.md (rotating 10), graduated_learnings.md (permanent 50), prompt_patch.md
