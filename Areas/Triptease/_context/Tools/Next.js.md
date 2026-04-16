---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# Next.js

## What It Does
React framework for full-stack web applications with server-side rendering and API routes.

## How We Use It
- Primary framework for internal web portals
- App Router with TypeScript and Tailwind CSS

## Access
- Open source — installed as a dependency

## Used By
- [[Automation Hub]] — Next.js 16, App Router, TypeScript, Tailwind v4, standalone Docker output
- [[Triptease Studio]] — React 18 frontend

## Notes
- Next.js 16 used in Automation Hub (latest)
- output: "standalone" required for Docker/Railway builds
- Middleware must use x-forwarded-host/x-forwarded-proto headers, not request.url
- Node 22 forced via Dockerfile (node:22-alpine) — Nixpacks can't reliably resolve Node 22
