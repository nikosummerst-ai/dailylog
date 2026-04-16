---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# Auth.js

## What It Does
Authentication library for Next.js applications (formerly NextAuth.js).

## How We Use It
- Google OAuth authentication restricted to @triptease.com domain
- Session management for the Automation Hub portal

## Access
- Open source — installed as next-auth@beta (v5)

## Used By
- [[Automation Hub]] — Google OAuth login, restricted to Triptease Google Workspace accounts

## Notes
- v5 (beta) — uses auth.ts config at project root, not API route
- AUTH_TRUST_HOST=true required on Railway
- checks: ["pkce", "state"] on Google provider (default nonce check causes errors)
- signIn callback must verify profile.hd === "triptease.com"
- New users default to SUBMITTER role — promote admins manually via psql
