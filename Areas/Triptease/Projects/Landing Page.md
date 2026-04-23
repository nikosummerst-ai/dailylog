---
status: active
priority: high
tags: [project]
area: Triptease
created: 2026-04-16
updated: 2026-04-23
---

# Website Optimisation 2026 — Landing Pages

Redesigning all Triptease website landing pages. Valentina (copy) → Niko (Figma layouts) → 6M agency (HubSpot dev).

## Key Links

- **Project hub (Notion):** https://www.notion.so/triptease/Triptease-Website-Optimisation-2ff46336789780429413d6786e739c60
- **Figma WIP file:** https://www.figma.com/design/UQhAZ9zCnrQBND2fszYc1Z/Triptease-Website-2026--Copy- (Niko's Pro team)
- **Original Figma file (Page 1):** fileKey `thCPjjZAYRkNmvhUDZgdgW`
- **Design kickoff notes:** https://www.notion.so/triptease/Website-Design-Kickoff-329463367897805b8640f0f300108967

## Pages to Design (13 total)

| Page | Notion spec | Figma status |
|------|-------------|--------------|
| Homepage | ✅ Done | 🔨 In progress (Niko WIP) |
| Data Marketing Platform | ✅ Done | ⏳ Not started |
| Metasearch | ✅ Done | ⏳ Not started |
| Paid Search | ✅ Done | ⏳ Not started |
| Display Ads | ✅ Done | ⏳ Not started |
| Personalization | ✅ Done | ⏳ Not started |
| Price Match | ✅ Done | ⏳ Not started |
| Date Boost | ✅ Done | ⏳ Not started |
| Email | ✅ Done | ⏳ Not started |
| Ecommerce Manager persona | ✅ Done | ⏳ Not started |
| Triptease vs Agencies | ✅ Done | ⏳ Not started |
| Triptease vs Manual | ✅ Done | ⏳ Not started |
| Hotel Type pages | ✅ Done | ⏳ Not started |

## Homepage — What's Done (as of 2026-04-23)

Working in frame `4052:92` (Page 1) inside Figma WIP file. (Old frame ID `2138:517` archived.)

### Structural changes applied per Valentina's Notion spec:
- ✅ 14 text copy swaps applied (new subheads, problem card bodies, story attributions, CTA copy)
- ✅ Tabbed Products section replaced with 7-card vertical stack (alternating left/right)
- ✅ 2 more customer story cards added (Frasers, McDreams) alongside Dream Inn
- ✅ FAQ section added (accordion-style, 10 questions, first row expanded)
- ✅ Final CTA subhead added
- ✅ Section reorder attempted: Problems ↔ Products swapped; Integrations moved to after Stories
- ✅ Final CTA/FAQ overlap fixed

### Additional changes (2026-04-22 / 2026-04-23):
- ✅ Full colour overhaul: page is now mostly white — dark bg limited to Hero + Final CTA only (matches triptease.com)
- ✅ Products section rebuilt as sticky-scroll left-nav pattern: 7 panels, each showing [Nav list | Visual card | Content]
- ✅ Products section text scaled to 1.4× (aligned with rest of homepage — 62pt H3, 28pt body, 24pt bullets)
- ✅ Proven Results + FAQs text also scaled 1.4× to match
- ✅ Section intro headline: "Multiple ways to" black + "increase direct bookings." copper→purple gradient (#ED6E2E → #5E43C2)
- ✅ Progress bar dots recoloured to gray-900 (black) for visibility on white bg
- ✅ HTML scroll prototype updated to match light design (`triptease-products-scroll-preview.html`)
- ✅ Background export plate created (2560×1440 PNG, node `4187:92`) — purple/orange blur orbs on white

### Still outstanding on Homepage:
- Visual placeholders need replacing with real product screenshots/imagery
- Valentina to supply hotel/people imagery references (noted in kickoff)
- PM (Pete) review still pending on copy before Figma goes to dev
- Integrations section (section 8) not yet verified post-reorder

### Section order (target per Notion spec):
Hero → Logo strip → Platform → Problems → Products (vertical stack) → Testimonials → Stories (3 cards) → Integrations → FAQ → Final CTA

## Workflow

1. **Niko** creates Figma layouts per Valentina's Notion specs → saves to WIP page
2. **Valentina + Pete** review Figma layout for PM sign-off
3. **6M agency** implements in HubSpot from approved Figma
4. **Valentina** QA + go-live

## Figma Account Notes

- Use `niko.summers@triptease.com` (Pro plan, Dev seat) for MCP work
- marketing@triptease.com (Ailish) is Starter plan — 6 calls/month, avoid for MCP
- Rate limits = per file's owning team, not just user account

## Product Page Template

All product pages follow the same structure:
1. Hero (product headline + subhead + CTA + visual placeholder)
2. Social proof bar (logo strip)
3. Framing section ("What effective X looks like" — 3-4 principles)
4. Core capabilities (vertical stack of pillars)
5. "Stronger when connected to platform" section
6. Customer story (outcome-first, named property)
7. FAQs (accordion)
8. Final CTA

Build rule: no hero image/carousel/video. Gradient bg. Single primary CTA. Mobile collapses to single column. All HubSpot modules reference existing patterns from `/solutions`.

## Decisions

- **Light-first colour strategy** — page is white throughout; dark (`#1B1E27`) reserved for Hero + Final CTA only. Matches triptease.com brand direction.
- **Products scroll pattern** — sticky left-nav (product name list, active state) + right visual card. Chosen over carousel (too horizontal) and stacked full-viewport (too static). HTML prototype used for stakeholder preview.
- **Text scale multiplier = 1.4×** — not 2×. 2× causes panel overflow and layout collapse; 1.4× matches visual weight of other homepage sections.
- **Headline gradient** — copper (#ED6E2E) → purple (#5E43C2), linear, L→R, applied to key payoff words only via `setRangeFills`.
- **Design system file** — style guide rules now persisted to `.claude/rules/triptease-website-typescale.md` in the Landing Pages project.

## Recent Work

### 2026-04-23
- Converted homepage from dark to light (white page, dark for Hero + CTA only); fixed legacy image fill on Home wrapper causing dark wash
- Rebuilt Products section as left-nav sticky scroll pattern (3-column: nav + visual + content per panel)
- Scaled Products, Proven Results, FAQs text to 1.4× to match rest of page
- Added copper→purple gradient to "increase direct bookings" headline; progress dots set to black
- Created 2560×1440 background export plate (node 4187:92)
- Next: start Metasearch product page using homepage type scale + section template
