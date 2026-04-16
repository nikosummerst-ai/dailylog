---
status: active
tags: [tool/data]
category: Data
area: Triptease
created: 2026-04-16
---

# Google Sheets

## What It Does
Google's spreadsheet platform — used as a lightweight output/reporting layer.

## How We Use It
- Newsletter output export in [[Direct Booking Digest]]
- Event data storage in [[DBSEvents]]
- Historical run data in [[Guest Personas]]

## Access
- Via Google Workspace (service account credentials for API access)

## Used By
- [[Direct Booking Digest]] — exports finalized newsletter articles to a Google Spreadsheet
- [[DBSEvents]] — stores scraped event data
- [[Guest Personas]] — historical output (now migrating to Automation Hub)

## Notes
- API access via base64-encoded service account JSON (GOOGLE_SHEETS_CREDENTIALS env var)
- Lightweight reporting layer — not used for primary data storage
