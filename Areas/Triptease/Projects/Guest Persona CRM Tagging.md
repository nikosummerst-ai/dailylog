---
status: active
priority: high
tags: [project, automation, crm, guest-personas]
area: Triptease
created: 2026-04-16
---

# Guest Persona CRM Tagging

Custom CRM integration endpoints that plug [[Guest Personas]] data into hotel CRM systems. Hotels choose which guest personas they want, then booking data (guest journeys on website) is matched to guest personas by tagging them and pushing into their CRM. This tells the hotel who to target before arrival so they know who the guest is.

Related: [[Guest Personas]], [[2026-03-27 CRM Guest Personas]]

## How It Works
1. Hotel selects which guest personas they want to track
2. Booking data / guest website journeys are collected
3. System matches guests to personas by tagging them
4. Tagged data is pushed to the hotel's CRM via custom endpoints
5. Hotel uses this for pre-arrival targeting — knowing who the guest is before they arrive

## CRM Platforms in Pipeline
- **Revinate** — approved clients: Boardwalk Aruba (1 hotel), Evans Hotels (3 resorts)
- **BookBoost**
- **Growth Solutions**
- 1 other TBD

## Architecture
Daily automation: BigQuery extraction -> match CRM via booking references -> push to CRM UDF fields

## Key People
- [[Liam]] — has been asking about production readiness; created BigQuery workflow + N8N framework
- [[Tobias Gunkel]] — prioritization discussions

## Next Steps
- [ ] Check Slack for latest messages with [[Liam]] about production status
- [ ] Build custom endpoints for each CRM platform
- [ ] Obtain Revinate API keys
- [ ] Set up N8N table with 4 hotels and config
- [ ] Ask product about BigQuery access/table setup
- [ ] Generate report for the CRM for the hotel (per-hotel persona reports)
- [ ] Test with Boardwalk Aruba and Evans Hotels first
- [ ] Keep personas static (no 90-day deletion) for CRM integrations
- [ ] Update "honeymoon" to broader "romance/couples" for Boardwalk

## Notes
- Uses the [[Guest Personas]] system as the source of persona definitions
- Makes a report for the CRM for the hotel based on selected personas
