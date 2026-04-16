---
status: active
tags: [tool/infrastructure]
category: Security
area: Triptease
created: 2026-04-16
---

# Aikido Security

## What It Does
Open-source supply chain security tool that checks npm/yarn packages against a malware database.

## How We Use It
- Being trialled by prod-eng squad
- Proxies npm/yarn installs and checks packages against a malware database before installation

## Access
- Dashboard: https://aikido.dev

## Used By
- Engineering (prod-eng squad) — security trial for supply chain protection

## Notes
- Currently in trial phase with prod-eng squad
- Recommended as mandatory tooling for the whole company
- Operates as a proxy for npm/yarn installs to catch malicious packages
