---
date: 2026-04-22
tags: [meeting]
attendees: [Sam, Monique]
---
# Daily Stand Up 22nd Apr

## Attendees
- Sam (Triptease), Monique (Langham Hotels), Lewis & Helen (Lighthouse team)

## Key Decisions
- Click capture rate at 50-55% is below the 70% minimum, but Lighthouse confirmed 72% after removing bot traffic — acceptable
- Gold Coast went live with UBIO price source (Rock Copper connectivity); member rates correct so far
- Custom booking engine issue identified by Lighthouse: rooms/rates recognition broken, preventing correct parity data

## Discussion

### Performance Overview
Rolling 7-day revenue down 9%, largely due to larger hotels being paused from budget exhaustion. Currently 30% behind booking pace. Chicago received budget approval and is back live. Chelsea Toronto still paused (bookings pace -5%, but higher ADRs offsetting). ANZ region significantly down (excluding Langham Gold Coast coming online). London performance flat.

### Technical Issues
Cookie consent banner blocking script loading, causing tracking volume loss. Team has repeatedly requested white-labelling of scripts. Monique previously mentioned reviewing auto-consent mode with security team. Lighthouse ticket 1247 open. Server-side tracking with AVEN in progress to quantify booking gaps.

### Budget & Bidding
TPA reactivation underway — Sam working to re-enable where spend allows. Hybrid bidding model expansion being investigated. Most hotels at 80–100% spend pace, limiting aggressive bidding.

### Hong Kong Properties
- Admiralty pacing up substantially, budget headroom allows aggressive bidding
- Langham Hong Kong down 57% on bookings; Eaton Hong Kong also struggling
- Both Langham HK and Eaton HK have budget + ROAS headroom to push harder

### Gold Coast Integration
Live on UBIO with internal connectivity (Rock Copper). No rate inaccuracy observed. Awaiting Synexis API adjustments for retesting. UBIO crawling frequency set to maximum to minimise bot detection risk.

## Action Items
- [ ] Sam: share list of hotels where TPA was activated and hotels switched to hybrid model
- [ ] Sam: push spend for Eaton Hong Kong and Langham Hong Kong
- [ ] Sam: notify team when TPAs are reactivated
- [ ] Request Monique for volume figure on users not accepting cookies
- [ ] Schedule call with Monique, Lighthouse (Lewis/Helen), and Langham web developers to resolve custom booking engine issues
- [ ] Reconfirm with Lighthouse consequences of going live with current custom booking engine setup
- [ ] Check which additional hotels can be moved to hybrid bidding model

## Related Projects
[[Landing Page]]