---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# Prisma

## What It Does
TypeScript ORM for type-safe database access and schema management.

## How We Use It
- Database schema definition and migration management
- Type-safe database queries in TypeScript projects

## Access
- Open source — installed as a dependency
- Prisma Studio: npm run db:studio

## Used By
- [[Automation Hub]] — full Prisma setup with migrations, seeding, and Prisma Studio
- [[Help Centre Bot]] — shared database schema with Automation Hub (Postgres-m5QY)

## Notes
- Generated client lives in src/generated/prisma/ (do not edit)
- DATABASE_URL must be available at build time for Next.js projects
- Shared schema between Hub and Help Centre Bot — changes affect both services
