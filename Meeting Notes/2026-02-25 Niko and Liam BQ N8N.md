---
date: 2026-02-25
tags: [meeting, guest-personas, bigquery, n8n, architecture]
attendees: [Niko Summers, Liam]
source: notion
---

# Niko / Liam — BQ N8N Architecture

## Clay-Slack-Salesforce Integration Design
- **Problem**: Clay bot can't execute slash commands in Slack
- **Solution**: Salesforce trigger → Clay webhook → dedicated Slack channel → bot picks up Place ID + user ID → DMs user results

## Data Testing
- Ovation hotel: 65-68 MB, 6-7 seconds query time
- Naming inconsistency: BigQuery uses Keystone names, Salesforce uses different names
- Investigating Place ID as universal identifier

## [[Automation Hub]] Setup
- Global user ID system configured

## Key Decisions
- Move from Slack to Salesforce as primary trigger
- Create dedicated Slack channel for automation
- Use Place ID as potential alternative to name-based queries

## Action Items
- [ ] Niko to ask about BigQuery costs, investigate Place ID for BigQuery
- [ ] Liam to speak to Lighthouse about users in Automations app
- [ ] Liam to add Niko as admin
- [ ] Complete cost comparison for Charlie
