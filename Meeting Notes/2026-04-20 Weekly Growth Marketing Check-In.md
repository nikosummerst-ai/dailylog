---
date: 2026-04-20
tags: [meeting]
attendees: [Niko Summers, Tobias Gunkel, Valentina Goldie]
---
# Weekly Growth Marketing Check-In

## Attendees
- [[Tobias Gunkel]], [[Valentina Goldie]], Niko

## Key Decisions
- [[Guest Persona CRM Tagging]] integration with Revenant blocked — platform only surfaces email, hotels without email products can't be matched. Workaround: require email retargeting to enable BigQuery matching. Extended session with [[Liam]] tomorrow 1:45–6pm.
- [[ABM Creator]] Meta Parity Accuracy bug fixed via shadow DOM navigation (100% accuracy, tested on 3 hotels).
- Vercel security breach discussed (misconfigured OAuth) — production/staging/keys appear unaffected.
- Brand book must be established before [[Landing Page]] generation proceeds — topic deferred to marketing team meeting with [[Peter Yabsley]].
- [[Charlie Osmond]] "really desperate for leads" — [[ABM Creator]] rollout is urgent this week.
- [[DBS Guest Personas Print Assets]] Book Club: 8-page layout confirmed. [[Megan Bryant]] sending copy tomorrow/Wednesday.

## Discussion
[[Tobias Gunkel]] returned to full-time after a hectic break. [[Valentina Goldie]] travelling to Uruguay, back tomorrow. Curtis (new joiner) starting today — Niko has onboarding meeting at 11am.

**[[ABM Creator]] updates:**
- Meta parity accuracy bug fully fixed; 30-second retry added for chart animation labels.
- Duetto Detector fold-in completed with updated detection signals.
- SimilarWeb traffic error: screenshot captured correctly but Claude struggles to parse large multi-section screenshots — SSO login works but parsing is the issue.
- [[Automation Hub]] UI in progress — hotel selection UI instead of direct landing page link.
- Account list from [[Simon Law]] (early April) being mapped to Salesforce schema.
- Beeswax retargeting UI surfaced but Jonathan hasn't responded to messages.

**[[Guest Persona CRM Tagging]]:**
- [[Tobias Gunkel]] and [[Liam]] integrating guest persona tags into Revenant's CRM platform.
- Blocker: platform only surfaces email; hotels without email products can't be matched via BigQuery.
- Workaround: sign hotels up for free trial and require email retargeting to enable matching.
- [[Charlie Osmond]] is chasing progress on this.

**[[Landing Page]] & Infrastructure:**
- [[ABM Creator]] [[Landing Page]] had 2-hour outage — Railway rebuilt on newer Starlet version that dropped support for old template. Templates normalised; migration flagged as low-priority admin task.
- Brand guidelines needed before proceeding with Claude Design for landing page improvements.

## Action Items
- [ ] [[Tobias Gunkel]]: Confer with [[Valentina Goldie]] about homepage and [[Landing Page]] work
- [ ] [[Tobias Gunkel]]: Complete [[DBS Guest Personas Print Assets]] blog book club designs once [[Megan Bryant]] sends copy (tomorrow/Wed)
- [ ] [[Tobias Gunkel]]: Work with [[Liam]] on [[Guest Persona CRM Tagging]] session (tomorrow 1:45–6pm)
- [ ] [[Tobias Gunkel]]: Fix SimilarWeb traffic parsing error in [[ABM Creator]]
- [ ] [[Tobias Gunkel]]: Complete [[Automation Hub]] UI hotel selection work
- [ ] [[Tobias Gunkel]]: Finish mapping account schema to Salesforce format
- [ ] [[Tobias Gunkel]]: Add template compatibility for [[ABM Creator]] [[Landing Page]]
- [ ] Niko: Listen to [[Charlie Osmond]]'s voice note about new idea (possibly Seed Dance for video generation)
- [ ] Niko: Double-team with [[Tobias Gunkel]] messaging Jonathan about beeswax retargeting UI; also mention to [[Charlie Osmond]]
- [ ] Niko: Set up Curtis with cloud code, API keys, and developer console access
- [ ] Niko: Add Curtis to marketing team in Notion
- [ ] Niko: Work with [[Charlie Osmond]] on lead generation plan
- [ ] Niko: Create plan to roll out [[ABM Creator]] with available contacts and accounts
- [ ] Niko: Approve [[Tobias Gunkel]]'s Nov–Dec time off request (27th–5th, Florida trip)
- [ ] Team: Decide on brand book and guidelines (agenda item for marketing meeting with [[Peter Yabsley]])

## Related Projects
[[ABM Creator]], [[Guest Persona CRM Tagging]], [[Automation Hub]], [[Landing Page]], [[Guest Personas]], [[DBS Guest Personas Print Assets]]
