---
status: active
tags: [tool/crm]
category: CRM
area: Triptease
created: 2026-04-16
---

# Beeswax DSP

## What It Does
Demand-side platform for programmatic advertising and account-based marketing.

## How We Use It
- Account-based marketing campaign targeting for hotels
- Programmatic ad delivery based on guest persona segments

## Access
- Staging buzz_key: triptease2sbx
- Production buzz_key: triptease

## Used By
- [[ABM Creator]] — creates and manages ABM campaigns via Beeswax API

## Notes
- Default daily budget: $1.00 for both staging and production (never set higher without explicit instruction)
- beeswax-node-client cookie fix is lost on npm install — reapply if API calls time out
- Needs integration into [[Automation Hub]] (urgent priority)
