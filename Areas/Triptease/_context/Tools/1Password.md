---
status: active
tags: [tool/infrastructure]
category: Security
area: Triptease
created: 2026-04-16
---

# 1Password

## What It Does
Password and credential management platform for secure secret storage and sharing.

## How We Use It
- Org-wide storage of passwords, API keys, and credentials
- "Critical Systems" vault for high-sensitivity infrastructure credentials
- Team vaults scoped per squad for access control

## Access
- Access via 1Password app (org-wide account)

## Used By
- All teams — password management and credential sharing
- Engineering — infrastructure credentials (e.g., [[Fastly]], [[Cloudflare]], [[AWS S3]])

## Notes
- "Critical Systems" vault holds the most sensitive credentials (e.g., [[Fastly]] credentials)
- Team vaults structured per squad to limit access appropriately
