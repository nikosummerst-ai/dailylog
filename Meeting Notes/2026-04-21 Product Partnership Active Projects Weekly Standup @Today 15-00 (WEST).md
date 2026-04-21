---
date: 2026-04-21
tags: [meeting]
attendees: [Jonathan Hickford, Kieran Jones, Ruben Westmeijer, Marton Zugn, Kiran Smith, Sam Firminger, Nigel Haig, Kelvin Smith, Helen Williamson, Lewis Cummins, Jake Howard, Krystal De Anda]
---
# Product Partnership Active Projects Weekly Standup

## Attendees
- [[Jonathan Hickford]], [[Kieran Jones]], [[Ruben Westmeijer]], [[Marton Zugn]], [[Kiran Smith]], [[Sam Firminger]], [[Nigel Haig]], [[Kelvin Smith]], [[Helen Williamson]], [[Lewis Cummins]], [[Jake Howard]], [[Krystal De Anda]]

## Key Decisions
- Sendai partner name display in Google resolved; same fix available for Parity and Avivo
- Price Check Light announcement expected next week; 30-day opt-out window begins after communication is sent
- CRS API: deep link format data collection ready to deploy; beta phone call with Sabre to be scheduled
- TripAdvisor direct connectivity being actively explored — [[Krystal De Anda]] has existing relationship and is meeting them in coming weeks
- Avon confirmed they will update the 2020 connectivity agreement to include price feed distribution
- Price Feed Reselling product being implicitly launched; needs new Keystone product for tracking
- Need centralised framework for white label scripts across Sendine, Duetto, and Cloudbeds

## Discussion
**Sendai / Parity Meta CPA:** Sendai partner name display in Google resolved in five minutes with a documents-based fix (country-specific). [[Ruben Westmeijer]] to explore same approach for Parity, which has had hotels question the Triptease branding.

**Price Check Light:** One-pagers shared; waiting on partner communication letter. Hotels that opt out removed from BigQuery product modules; Dragonfly reads from product modules to reflect enablement. [[Lewis Cummins]] coordinating from Lighthouse side.

**CRS API (Sabre/Synexis):** Production API key received but beta phone call needed for test hotel access. Hotel identified and permission granted. [[Kieran Jones]] leading beta phase and data collection. Standard Synexis onboarding will include both rates feed app and new price match data integration app. Implementation will go within booking journey/service, not Lighthouse events.

**Proxy Migration:** Progressing well; delays mostly on client side. Mobile rates migration complete; custom UTM parameters work starting next. Estimated two months worst case. Sticky Blaster and Sendai proxy pulled once UTM work done.

**TripAdvisor Direct Connectivity:** Previous November WTM attempt cancelled due to TripAdvisor layoffs; earlier attempts in 2023 and pre-COVID with code already written. Three APIs: rates feed, reporting data pull, bid setting. Direct connectivity would provide reinsurance when moving 400 hotels off sticky plaster to Synexis.

**Price Feed Reselling:** Implicitly launching new product selling price feeds to third parties. Google claims price feeds provide 10% more conversions on paid search. Could charge flat fee exceeding Sabre costs.

**Sendine White Label Scripts:** Sendine wants scripts writing directly to their "Sinres" database. Scripts considered "crown jewels" — open to selling but need proper valuation. Concern about strengthening Sendine's position in meta market.

**Partner Data Sharing Framework:** Cloudbeds, Sendine, and Duetto all requesting direct data access. Critical GDPR distinction: sharing raw data vs. calculated metrics triggers different consent requirements. Data predominantly gathered under analytics consent. Partners' use cases may require hotels to alter cookie banner/GDPR consent mechanisms.

## Action Items
- [ ] [[Ruben Westmeijer]]: Reach out to Parity about changing partner name display in Google listings
- [ ] [[Kieran Jones]]: Deploy deep link format recording for CRS API after this meeting
- [ ] [[Jonathan Hickford]]: Schedule beta phone call with CRS for US hotel certification
- [ ] [[Jonathan Hickford]]: Test data access scope limitations when receiving live CRS access
- [ ] [[Ruben Westmeijer]] and [[Krystal De Anda]]: Discuss price feed reselling product at GOT meeting this week
- [ ] [[Kelvin Smith]] and team: Connect with [[Ruben Westmeijer]] on TripAdvisor direct connectivity technical requirements
- [ ] Team: Establish centralised framework for white label scripts (Sendine, Duetto, Cloudbeds)
- [ ] Team: Review data privacy and consent implications for partner data sharing
- [ ] Team: Conduct 15-minute sync before running Price Check Light script in 30+ days

## Related Projects
[[Automation Hub]]
