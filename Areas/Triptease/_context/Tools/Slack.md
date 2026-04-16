---
status: active
tags: [tool/communication]
category: Communication
area: Triptease
created: 2026-04-16
---

# Slack

## What It Does
Team messaging platform — also used as the primary interface for automation tools via Slack Bolt framework.

## How We Use It
- Company-wide communication
- Primary UI for marketing automations (modals, commands, notifications)
- Slack Bolt (Node.js) framework powers interactive workflows
- Slash commands trigger pipelines

## Access
- Workspace: Triptease Slack

## Used By
- [[Direct Booking Digest]] — editorial workflow, article selection modals, approval flow
- [[Help Centre Bot]] — content gap notifications, review modals, weekly summary
- [[Guest Personas]] — /guest-segment command, infographic posting, regeneration modals
- [[ABM Creator]] — campaign creation modals and notifications
- [[Automation Hub]] — notifications and status updates

## Notes
- Bolt framework conventions: max 3 stacked modals, max 100 blocks each, 3000 chars per text block
- Bold in Slack: use *bold* not **bold**
- 3-second acknowledgment window for Slack responses — use background tasks for long operations
- Socket Mode used by Help Centre Bot; Express receiver used by DBD
- Each automation has its own Slack app with separate tokens (dev/prod)
- Installed bots: DBD Newsletter Bot, Gong notetaker, Clay enrichment alerts, design-system-release-alerts bot, tldv bot
