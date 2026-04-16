---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# GitHub

## What It Does
Code hosting, version control, and collaboration platform.

## How We Use It
- All Triptease marketing automation code is hosted on GitHub
- Push-to-deploy workflow with Railway (auto-deploys on push to main)
- GitHub API used for file access in cloud-deployed bots

## Access
- Org: https://github.com/Triptease-Mktg (Triptease marketing automations)
- Personal: https://github.com/nikosummerst-ai (personal projects)

## Used By
- [[Guest Personas]] — Triptease-Mktg/GuestPersonas.git
- [[Direct Booking Digest]] — Triptease-Mktg/DBD-Newsletter-Automation.git
- [[Help Centre Bot]] — Triptease-Mktg/help-centre-bot.git
- [[ABM Creator]] — Triptease-Mktg/abm-creator.git
- [[Automation Hub]] — Triptease-Mktg/Automation-Dashboard.git

## Notes
- Railway auto-deploys on push to main — be careful with rapid pushes (can cause restart loops)
- Personal repos use PAT stored in git remote URL
- Triptease repos use SSH key (nikosummers-sudo)
