---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# Railway

## What It Does
Cloud platform for deploying and hosting applications, databases, and services. Auto-deploys from GitHub on push.

## How We Use It
- Primary deployment platform for all Triptease marketing automations
- Hosts PostgreSQL and Redis databases
- Staging + production environments per service
- Auto-deploys on git push to main

## Access
- Dashboard: https://railway.com
- Triptease project: Triptease Marketing workspace

## Used By
- [[Guest Personas]] — prod + dev services, PostgreSQL
- [[Direct Booking Digest]] — Express server, PostgreSQL, Redis
- [[Help Centre Bot]] — bot + worker services, shared PostgreSQL (Postgres-m5QY)
- [[ABM Creator]] — abm-creator + beeswax-pipeline services
- [[Automation Hub]] — Next.js app, shared PostgreSQL (Postgres-m5QY)
- [[Triptease Studio]] — hosting

## Notes
- Shared database: Postgres-m5QY is shared between Automation Hub and Help Centre Bot
- Internal networking available between services (e.g., http://beeswax.railway.internal:3000)
- Public proxy for DB access: autorack.proxy.rlwy.net:20324
- Dockerfile or Nixpacks build supported — Dockerfile preferred for Node 22
