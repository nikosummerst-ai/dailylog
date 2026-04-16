---
status: active
tags: [tool/communication]
category: Communication
area: Triptease
created: 2026-04-16
---

# Intercom

## What It Does
Customer messaging and help centre platform.

## How We Use It
- Hosts Triptease's help centre articles
- [[Help Centre Bot]] monitors and improves article quality

## Access
- Dashboard: https://app.intercom.com

## Used By
- [[Help Centre Bot]] — syncs help centre articles, detects stale/deprecated content, proposes updates

## Notes
- Article.collectionId stores Intercom string ID (e.g., "102201"), NOT Prisma UUID
- Help Centre Bot compares release notes against articles to find gaps
- [[Linear]] ticket exists for integrating user-level commercial data in Intercom
