---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# PostgreSQL

## What It Does
Relational database for structured data storage, managed via Prisma ORM in most projects.

## How We Use It
- Primary database for all web applications and automation services
- Hosted on Railway with internal + public proxy access

## Access
- Hosted on Railway (auto-provisioned per project)
- Shared instance: Postgres-m5QY (Automation Hub + Help Centre Bot)
- Public proxy: autorack.proxy.rlwy.net:20324

## Used By
- [[Automation Hub]] — users, projects, tickets, automation runs, help centre articles (Prisma ORM)
- [[Help Centre Bot]] — content items, articles, evidence, scan state (Prisma ORM, shared DB with Hub)
- [[Direct Booking Digest]] — articles, published history, blacklisted authors, scoring feedback
- [[Guest Personas]] — run tracking via Automation Hub

## Notes
- Prisma ORM used in Automation Hub and Help Centre Bot
- Raw SQL migrations used in DBD
- Shared DB pattern: Hub and Help Centre Bot share Postgres-m5QY — schema changes affect both
- DATABASE_URL must be available at build time for Next.js projects (Prisma generates at build)
