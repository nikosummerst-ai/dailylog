---
status: active
tags: [project, automation]
area: Triptease
created: 2026-04-15
---

# Direct Booking Digest (DBD)

Weekly hospitality industry newsletter. Scrapes 16 news sources, scores with AI, generates copy.

## Stack
TypeScript, Express, Slack Bolt, PostgreSQL, Redis, Railway

## Tech Stack
- [[Claude API]] — article scoring (0-100) and newsletter copy generation
- [[Slack]] — editorial workflow, article selection modals, approval flow
- [[PostgreSQL]] — articles, published history, blacklist, scoring feedback
- [[Redis]] — modal cache, selections, completion flags
- [[Google Sheets]] — newsletter output export
- [[Railway]] — hosting
- [[GitHub]] — Triptease-Mktg/DBD-Newsletter-Automation.git

## Deployment
- **GitHub**: https://github.com/Triptease-Mktg/DBD-Newsletter-Automation.git
- **Railway (prod)**: https://dbd-app-production.up.railway.app
- **Database**: PostgreSQL + Redis (Railway auto-provisioned)

## Links
- Code: ~/Desktop/ClaudeProjects/DBD

## Project Intelligence
- CLAUDE.md: ~/Desktop/ClaudeProjects/DBD/CLAUDE.md
