---
date: 2026-04-21
tags: [meeting]
attendees: [Niko Summers, Liam]
area: Triptease
created: 2026-04-21
---

# CRM Guest Persona Workflow Building

## Attendees
- [[Niko Summers]], [[Liam]]

## Key Decisions

### Technical Architecture
- Guest persona data is stored in a data table on the Railway server.
- BigQuery data is stored in an AWS bucket and expires after three months.
- Daily BigQuery exports will stay in NAN.
- Matched anonymous IDs with guest personas will be uploaded to AWS.
- Final matched data (emails + persona tags) will be stored in AWS folders organised by CRM, not NAN tables, to enable product team scalability.
- Each CRM will have separate workflows to keep clients contained.

### Data Flow and Integration
- Process will extract emails from CRM API, run BigQuery, match emails to BigQuery event data, send via webhook to server for AI matching logic, then push results back to NAN.
- Server will handle all matching logic using the cached top 8 personas already generated for each hotel.
- No temporary IDs will be created in NAN to avoid complication.
- Google Place ID will be used as the primary identifier for organising data.
- Matching will be done on patterns rather than individual rows to manage costs.

### Data Security and Storage
- AWS storage preferred over NAN tables for better security protections and to ease hotels' concerns.
- Server will be protected behind admin key and authenticated by triptease.com accounts.
- Data security approval still needed for storing emails on event data.
- Files will be organised in AWS with dedicated folders (BigQuery folder, reviews folder, website folder) — current setup is unorganised.

## Discussion

### CRM Integration Status
- Working with two hotel groups — one with three hotels, one with one hotel.
- Waiting for signatures on three zero-value contracts.
- Revenate API keys are ready and available in existing workflows.
- Current test workflow pulls the last two pages (~50 people) from Revenate but needs date-based filtering.

### Alternative Integration Options
- [[John Hickford]]'s work with Synexis API might allow joining event data with Synexis booking numbers, which could be matched to CRM data.
- Team decided not to limit guest personas to only Synexis customers — need to maintain flexibility for other booking engines.

### Scalability
- Daily data size approximately 2–5 GB per hotel — should be manageable.
- Each CRM will have separate workflow instances to avoid conflicts.
- Need a solution for exempting client hotels from expiration — possibly maintaining a list of Place IDs.
- Concern about scaling exemption management when hundreds of hotels are added.

### Hotel-Specific Notes
- Lodge at Torrey Pines and Evans Hotels [[Guest Personas]] reports have been generated.
- Boardwalk requested changing "Honeymoon" tag to "romance" — only tag change needed, no new infographic required.

### Next Steps After Testing
- [[Liam]] will not test pushing to CRM yet as UDFs aren't created.
- Will test data coming back into NAN first.
- Both available to jump back on call during booked time if needed.

## Action Items
- [ ] [[Niko Summers]]: speak with data security about storing emails on event data and pushing to CRM
- [ ] [[Liam]]: export BigQuery test data for one day for one of the hotels
- [ ] [[Liam]]: create new workflow to pull email addresses from Revenate API
- [ ] [[Liam]]: set up webhook connection between NAN and server for guest persona matching
- [ ] [[Liam]]: ensure specific hotels don't expire in the system (one-off task)
- [ ] [[Liam]]: validate matching logic through multiple tests and pattern analysis
- [ ] [[Liam]]: modify Boardwalk file to change "Honeymoon" tag as requested
- [ ] Team to request Lighthouse and data security to update BigQuery script to include email addresses

## Related Projects
[[Guest Persona CRM Tagging]], [[Guest Personas]]
