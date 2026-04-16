---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# Fastly

## What It Does
CDN (Content Delivery Network) for serving app.triptease.io at the edge.

## How We Use It
- Engineering uses as the primary CDN for app.triptease.io
- Edge caching and routing for the Triptease platform

## Access
- Dashboard: https://manage.fastly.com (credentials in [[1Password]] Critical Systems vault)

## Used By
- Engineering — CDN for app.triptease.io

## Notes
- Credentials stored in [[1Password]] Critical Systems vault
- Engineering exploring migration from Fastly to [[Cloudflare]] as the CDN provider
