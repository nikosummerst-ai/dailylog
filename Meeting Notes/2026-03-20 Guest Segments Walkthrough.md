---
date: 2026-03-20
tags: [meeting, guest-personas, walkthrough]
attendees: [Niko Summers, Megan Bryant]
source: notion
---

# Guest Segments Walkthrough

Detailed walkthrough of [[Guest Personas]] tool for [[Megan Bryant]].

## Access Routes
- Slack command (`/dashboard`) or Salesforce button
- Reports take ~15 minutes end-to-end

## How It Works
1. **Prospect route**: reviews + website scraping only
2. **Client route**: enriched with BigQuery data
3. Processes: ~40K lines reviews, 50K website content, 50K BigQuery data
4. Generates 25 initial personas → 15 after enrichment → user selects top 8
5. Translation feature available

## Upcoming Changes
- Auto-selection replacing manual persona selection
- Infographic approval step being removed
- Using Claude Opus 4.6 for better constraint adherence

## Targeting Issues
- Sticky bars not supported (only inline banners, nudges, full screen takeovers, countdown timers)
- Can't combine location audiences with date boost audiences
- Can't combine booking engine targeting with audience targeting

## Action Items
- [ ] Niko to speak to Liam about Salesforce access for marketing accounts
- [ ] [[Megan Bryant]] to spot-check 5 recent PDF reports for targeting condition issues
- [ ] [[Megan Bryant]] to update targeting conditions list with combination rules
- [ ] Schedule follow-up in 1-2 months
