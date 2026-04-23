---
date: 2026-04-23
tags: [meeting]
attendees: [Alasdair Snow, Stephanie Suarez, Andrew Williamson, Jonathan Hickford, George Bettley, Liam, Niko Summers]
---
# Monthly Roadmap Review -

## Attendees
- [[Alasdair Snow]], [[Stephanie Suarez]], [[Andrew Williamson]], [[Jonathan Hickford]], [[George Bettley]], [[Liam]], [[Niko Summers]]

## Key Decisions
- H1 focus (through end of June): prepare demos for DBS, accelerate R&D, get prototype agent experiences into customer hands
- H2: scale agent experiences to customers
- New campaign manager shipped to hoteliers yesterday; campaign-level targeting for messages removed — campaigns are now collections of independently configured messages
- Budget management controls amber status — not yet in hotelier hands; basic budget-changing capability is immediate priority
- Mobile rates for API-connected hotels went live this week; hotels need re-contacting to re-enable for testing
- CRM sync will follow email capture release in M2; Lighthouse taking ownership of CRM integrations going forward

## Discussion
[[Alasdair Snow]] opened with strategic context on Triptease's shift to agent-based experiences. Traditional SaaS interfaces face a simplicity vs. depth trade-off and each new feature scales costs faster than revenue. Agents can embed expertise in the product, adapt interfaces to users, and shorten the journey from insight to action. Customer example: Banff Park Lodge (£28k/year) expressed feeling "lost in all the data." H2 competitors like Revinate are exploring the same space, raising customer expectations.

[[Stephanie Suarez]] presented M2 Creative Personalization: 200 MAUs, 144 monthly publishers (40–50% of target), 50% client activation rate, 61% MRR coverage (vs. 70% target), 83% M1 message support (target 90%). Recently shipped: click-to-copy promo code block, layers panel, HTML block demo for AI-generated mini apps (spin-the-wheel, itinerary planner). Coming soon: email capture with structured fields, save-your-own template, expanded branding service to auto-extract brand tokens from website URLs. Bulk edits planned for June. Member targeting for M2 being scoped for end of Q2.

[[Andrew Williamson]] presented the new campaign manager (shipped yesterday to hoteliers): multi-select in template library, clear progress indicators, all targeting conditions in one place, location exclude targeting, per-message status control, save-and-exit button. Campaign-level targeting eliminated — campaigns are now simply collections of independently configured messages. CS survey feedback was incorporated pre-release. Current metrics: 59% publish conversion rate (target 70%), 15% audience targeting (target 25%), 80% eligible customer adoption target by end of H1.

[[Jonathan Hickford]] presented budget management controls: moving to monthly budget model, hiding chat assistant and sub-channel breakdown for alpha, change history tracking added. Currently available to internal DA team only; amber due to being harder than anticipated. Future roadmap: budget modeling, sub-channel facets, agentic budget advisory flows. Currency will remain USD throughout.

[[George Bettley]] presented Guest Intelligence: cross-channel data feed pilot for Aubergine, Looker space improvements, retiring old single-channel explores. In progress: spend pace and impression share metrics, third-party analytics tools exploration, [[Guest Personas]] development with Growth Solutions. [[Guest Personas]] work will define H2 direction. Scheduled reporting via email (like Clarity) for SMBs being explored but no concrete plans yet.

[[Liam]] presented product activation: unlimited coverage for API-connected hotels (any room/night/adult/child within Google's 330-day limit), simplified parity monitoring navigation, mobile rates now live this week. May: base and feed support for price match, custom UTM parameters for D-blinks (unblocks Nexus/AVEN integration for large hotel tranche). Google API changes in Jan/Feb (splitting base rates and taxes) reduced available capacity significantly.

## Action Items
- [ ] CS team: Continue conversations with non-activated mid-market clients regarding M2 activation
- [ ] Product team: Send product update documentation for new campaign manager today
- [ ] Hotels to be re-contacted to re-enable mobile rates for testing
- [ ] Outstanding Q&A questions to be answered asynchronously via comments on question tickets

## Related Projects
[[Guest Personas]], [[Triptease Studio]], [[Landing Page]]