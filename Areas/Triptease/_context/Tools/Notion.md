---
status: active
tags: [tool/communication]
category: Communication
area: Triptease
created: 2026-04-16
---

# Notion

## What It Does
Team wiki, project management, and documentation platform.

## How We Use It
- Company-wide documentation and knowledge management
- Release notes database tracked by [[Help Centre Bot]]
- Task and project tracking across teams
- Internal knowledge base and rollout pages for new tools (Clay, Gong, etc.)
- Product AI bot sources answers from Notion + Slack + [[Linear]]

## Access
- Workspace: Triptease Notion

## Used By
- [[Help Centre Bot]] — reads release notes database and drafts database for article gap detection

## Notes
- REST API with Notion-Version: 2022-06-28 header (SDK v5 removed databases.query)
- Feature Status field rarely updated in practice — don't filter on it
- Meeting notes imported from Notion to Obsidian vault via scheduled agent
