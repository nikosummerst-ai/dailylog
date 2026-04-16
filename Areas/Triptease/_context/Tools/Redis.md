---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# Redis

## What It Does
In-memory data store for caching, session management, and ephemeral data.

## How We Use It
- Modal cache and session data in the DBD newsletter pipeline
- Selection state and completion flags during Slack editorial workflows

## Access
- Hosted on Railway (auto-provisioned)
- Connected via REDIS_URL env var

## Used By
- [[Direct Booking Digest]] — modal cache, article selections, completion flags during editorial workflow

## Notes
- Used for ephemeral/session data only — persistent data goes to PostgreSQL
