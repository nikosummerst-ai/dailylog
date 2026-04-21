---
date: 2026-04-21
tags: [meeting]
attendees: [Stephanie Suarez, Chimmy Kalu, Elliott Smith, Francisco Rodrigues, Inês Coelho, James Maggs, Sam Firminger, Megan Bryant]
---
# Branding/Bulk Edits Planning Kick-off

## Attendees
- [[Megan Bryant]], [[Stephanie Suarez]], [[Chimmy Kalu]], [[Elliott Smith]], [[Francisco Rodrigues]], [[Inês Coelho]], [[James Maggs]], [[Sam Firminger]]

## Key Decisions
- Focus on **expanding branding service** as the highest-impact solution for reducing campaign complexity in [[Triptease Studio]]
- Any solution must include an AI extraction component (Pomeli-style brand token extraction from hotel URL)
- Three distinct work streams agreed: (1) extending branding service, (2) bulk edits for repetitive elements, (3) AI layer across both
- "Save Your Own Template" may be a quick win to complement main solutions but not a standalone fix
- Complete feasibility spikes before committing to an implementation approach

## Discussion

### Problem Context
Creating messages in [[Triptease Studio]] M2 is significantly more complex than M1 due to increased flexibility and configurability. Users spend an average of 22 minutes and 190+ clicks per campaign. 50% of Messages MRR comes from clients managing 20+ live messages across multiple properties. 100+ users still publish on M1 because M2 is too time-consuming to learn and easy to get wrong. Most editing effort goes into creative components: typography, images, content, and layouts.

### Five Solutions Evaluated
1. **Expanding Branding Service** — extract brand tokens (colours, typography, assets) from hotel URL via AI (Google Pomeli-style), with manual overrides and uploads; pre-configure CTA labels and page URL mappings
2. **Bulk Edits** — edit simple elements across multiple messages: headlines, text, images, CTA URLs, labels, and languages
3. **Save Your Own Template** — allow users to save messages as templates in the template library; requested by high-ACV clients like Warwick, Peninsula, and Four Seasons
4. **Styles Tab in Creative Builder** — add themes section within creative builder to edit properties in bulk rather than block-by-block
5. **AI/Agentic Solution** — command-line interface for changes like "change font to X" or "apply my branding"

### Key Discussion Points
- Two distinct problems identified: (1) too many clicks to create a single message with branding applied across blocks; (2) managing 20+ messages across multiple hotels requires a different solution
- [[Chimmy Kalu]] emphasised hoteliers don't want more things to configure — extended branding setup may create burden rather than reducing it
- [[Sam Firminger]] initially backed "Save Your Own Template" as highest impact / lowest effort; [[Chimmy Kalu]] argued it doesn't solve the real problem as users still do manual work upfront and it doesn't help with seasonal themes
- [[Inês Coelho]] proposed multiple branding configurations that users can swap between as an alternative
- Team agreed "Save Your Own Template" could be a quick win to complement the main solution, but not the sole solution
- Consensus emerged around expanding branding service as highest impact, with mandatory AI extraction to avoid manual configuration burden
- Branding service is old and hasn't been touched in a long time — modifications will take significant time; currently serves both M1 and M2, team prefers to leave M1 alone
- [[Elliott Smith]] tested AI extraction with Claude — pulled colours and typography fairly well with some minor issues
- Dragonfly and Kraken teams need to collaborate for template library work

### Supporting Data
- Users who duplicate campaigns have 84% publish rate vs 44% overall, suggesting value in pre-configured templates
- Users spend 2.5 minutes per session searching for templates
- Competitors (THN, Klaviyo, Canva) already offer branding themes and bulk edits as standard features

### Data Gaps
- Need granular events to understand which creative editing activities contribute most to effort
- Need to track which blocks and templates are most used
- Need to verify if Warwick's custom templates have actually increased their M2 usage

## Action Items
- [ ] Team: spike on extracting branding tokens from website URLs and assess feasibility
- [ ] Team: spike on whether extracted tokens can be used to pre-brand templates in the template library
- [ ] Team: identify top 3 most high-value extensions to the branding service
- [ ] Team: investigate Warwick's template usage and measure impact on M2 adoption since receiving custom templates
- [ ] [[Sam Firminger]] and team: work on rendering templates with branding applied instead of static screenshots
- [ ] [[Stephanie Suarez]]: add template library filtering work to backlog for collaboration with Kraken
- [ ] [[Elliott Smith]]: refine design for "save your own template" feature (noting template library has changed)
- [ ] [[Stephanie Suarez]]: summarise discussion and post meeting notes
- [ ] [[Chimmy Kalu]]: pair with team on spiking work (mornings available)

## Related Projects
[[Triptease Studio]]
