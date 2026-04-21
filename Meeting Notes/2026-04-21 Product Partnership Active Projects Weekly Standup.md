---
date: 2026-04-21
tags: [meeting]
attendees: [Ruben Westmeijer, Kieran, Jonathan, Krystal, Lewis, Kelvin]
---
# Product Partnership Active Projects Weekly Standup

## Attendees
- [[Ruben Westmeijer]], [[Kieran]], [[Jonathan]], [[Krystal]], [[Lewis]], [[Kelvin]]

## Key Decisions
- Apply Sendai Meta CPA partner-name fix to Parity (Parity may want their name displayed instead of Triptease in Google)
- Price Check Light announcement expected next week; 30-day opt-out window begins after partner sends communication letter
- CRS API: schedule beta phone call with Sabre to unlock test hotel data; Kieran to deploy deep link format recording post-meeting
- TripAdvisor direct connectivity worth pursuing — Krystal has an existing relationship from a previous role
- Avon will update its 2020 connectivity agreement to include price feed distribution
- Price feed reselling formally identified as a new product requiring a Keystone entry

## Discussion
**Sendai Meta CPA:** Successfully resolved partner-name display for Sendai in Google — a five-minute fix using country-specific incorporation documents. Same approach applicable to Parity and Avivo; Parity may be interested as some hotels have already raised the question.

**Price Check Light:** One-pagers shared with partner; waiting on partner's communication letter to kick off the 30-day opt-out window. Technical flow: partner sends opt-out list → new CSV with enabled/no column → script added to opted-in hotels → reprocess. Opted-out hotels removed from BigQuery product modules. Dragonfly reads from product modules. [[Lewis]] coordinating from Lighthouse side.

**CRS API (Synexis/Sabre):** Production API key received but beta hotel access requires a scheduled phone call first. Two weeks' production access after beta call, then full production access. Deep link format data collection is ready to deploy. Data security concern: scope of live production credentials unclear — [[Jonathan]] to test read permissions outside certification scope. Standard Synexis onboarding will enable both the rates feed app and new price match data integration app. Goal: data from 30 hotels across two interested clients to estimate cash value.

**TripAdvisor Direct Connectivity:** Three APIs involved — rates feed, reporting data pull, and bid setting. Previous WTM attempt cancelled due to TripAdvisor layoffs. Direct connectivity would provide a reinsurance policy when moving ~400 hotels off the sticky plaster to Synexis. [[Krystal]] meeting with TripAdvisor in a couple of weeks.

**Proxy Migration:** Mobile rates migration complete; custom UTM parameters work starting next; estimated two months worst case to completion. Sticky Blaster and Sendai proxy will be pulled once custom UTM parameters are done.

**Avon Connectivity:** Confirmed they will update the 2020 agreement to include price feed distribution. Possible surcharge expected. Current contract: €28/month per hotel plus €2,200 for API calls. Three to four major clients pushing for ability to share hotel IDs.

**Price Feed Reselling:** Triptease is implicitly launching a new product — selling price feeds to third parties. Need a new Keystone product for tracking. Google claims price feeds provide 10% more conversions on paid search. Could charge a flat fee exceeding Sabre costs. [[Ruben Westmeijer]] and [[Krystal]] to discuss at GOT meeting this week.

**Sendine White Label Scripts:** Sendine wants scripts to write directly to their "Sinres" database for use across multiple products. Team is protective — scripts are "crown jewels" — open to selling but need proper valuation. Concern about strengthening Sendine's position in the meta market.

**Partner Data Sharing Framework:** Similar requests from Sendine, Duetto, and Cloudbeds. Critical distinction: sharing raw data vs. calculated metrics affects data protection requirements. Data gathered under analytics consent primarily; partners' use cases may require customers to alter cookie/GDPR consent mechanisms. Joint responsibility for consent where white label scripts are deployed.

## Action Items
- [ ] [[Ruben Westmeijer]]: Reach out to Parity about changing partner name display in Google listings (Sendai fix approach)
- [ ] [[Ruben Westmeijer]] and [[Krystal]]: Discuss price feed reselling product at GOT meeting this week
- [ ] [[Ruben Westmeijer]]: Find latest booking data for Bridgestone to supplement visibility data
- [ ] [[Kieran]]: Deploy deep link format recording for CRS API after this meeting
- [ ] [[Jonathan]]: Schedule beta phone call with CRS for US hotel certification
- [ ] [[Jonathan]]: Test data access scope limitations when receiving live CRS access
- [ ] [[Kelvin]] and team: Connect with [[Ruben Westmeijer]] on TripAdvisor direct connectivity technical requirements
- [ ] Team: Conduct 15-minute sync before running Price Check Light script in 30+ days
- [ ] Team: Establish centralised framework for white label scripts with Sendine, Duetto, and Cloudbeds
- [ ] Team: Review data privacy and consent implications for partner data sharing

## Related Projects
[[DBS Event]]
