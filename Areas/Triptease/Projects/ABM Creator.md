---
status: active
priority: high
urgent: true
tags: [project, automation]
area: Triptease
created: 2026-04-15
updated: 2026-04-16
---

# ABM Creator (Beeswax)

Account-based marketing campaign automation for hotel targeting via Beeswax DSP.

> [!warning] HIGH PRIORITY / URGENT
> Needs to be sorted out and integrated into the [[Automation Hub]].

## Stack
Node.js, Express, Beeswax API, Railway

## Tech Stack
- [[Claude API]] — campaign copy generation
- [[Beeswax DSP]] — programmatic advertising, campaign management
- [[HubSpot]] — website segment tagger (footer script)
- [[Slack]] — campaign creation modals, notifications
- [[Railway]] — abm-creator + beeswax-pipeline services
- [[GitHub]] — Triptease-Mktg/abm-creator.git

## Deployment
- **GitHub**: https://github.com/Triptease-Mktg/abm-creator.git
- **Railway (prod)**: https://abm-creator-production.up.railway.app
- **Beeswax MCP**: https://beeswax-production.up.railway.app

## Next Steps
- [ ] Sort out current state and get working reliably
- [ ] Integrate into the [[Automation Hub]] dashboard
- [ ] [[Tobias Gunkel]] to document technical details of new ABM process

## Links
- Code: ~/Desktop/ClaudeProjects/Beeswax

## Project Intelligence
- CLAUDE.md: ~/Desktop/ClaudeProjects/Beeswax/CLAUDE.md
