---
type: context
last-updated: 2026-04-20
sources: [Notion - AI @ Triptease, Slack]
---

# AI at Triptease

Triptease is mid-transformation into an AI-first / agent-native company. This page captures the strategy, tooling, and conventions. See [[OKRs and Strategic Priorities]] for the formal targets.

---

## The Thesis

**Charlie Osmond (Mar 2026):** Feb/Mar 2026 was the inflexion point for "spinning up agent teams." Every Tripteaser's job is moving toward managing agents. AI proficiency will be a hiring requirement by end of 2026.

**Inspirations:** Brex, Ramp, Paperclip — companies running AI-native ops.

**Operating principle:** AI is part of how we operate every day — embraced and encouraged across all work. Codified as the **AI Adopter** value (5th of [[About Triptease#Mission Vision and Values|How We Win]]).

---

## Internal AI Adoption (KR3 — H1 2026)

| Metric                                   | Current                                                 |
| ---------------------------------------- | ------------------------------------------------------- |
| Employees actively using AI              | 81%                                                     |
| Token consumption growth (since Jan '26) | 3x                                                      |
| People on Claude Max tier                | 9                                                       |
| Claude usage limits                      | **None** (confirmed by Dan Bodart, `#global`, Apr 2026) |

---

## Tooling Stack

### Primary LLMs
- **[[Tools/Claude API|Claude]]** (Anthropic) — primary. Chat, Code, Cowork, Projects, Skills, MCPs.
- **[[Tools/ChatGPT|ChatGPT]] / Codex** — secondary, esp. for Codex coding tasks
- **[[Tools/Google Gemini|Gemini]]** — image generation, multimodal
- **[[Tools/Perplexity|Perplexity]]** — research / cited search
- **[[Tools/Manus|Manus]]** — autonomous agents
- **Spokenly** — voice → text

### AI App Builders / Vibe Coding
- **[[Tools/Cursor|Cursor]]** — AI-first code editor
- **[[Tools/Lovable|Lovable]]** — full-stack React + Supabase
- **[[Tools/Replit|Replit]]** — vibe coding
- **[[Tools/Bolt|Bolt]]** — AI app building
- **[[Tools/Google Stitch|Google Stitch]]** — UI design + frontend code

---

## Internal MCP Servers

Triptease has built proprietary MCP (Model Context Protocol) servers exposing internal tools to Claude:

| MCP | What it exposes | Owning squad |
|---|---|---|
| [[Tools/Triptease Spotlight\|Spotlight]] | Hotel search, tag aggregation, hotel links | [[Org Structure#Orca\|Orca]] |
| [[Tools/Triptease Budget MCP\|Budget MCP]] | Budgets, daily/monthly budgets, hotels | [[Org Structure#Tamarin\|Tamarin]] |
| [[Tools/Triptease Parity\|Parity]] | Parity monitoring | [[Org Structure#Rockhopper\|Rockhopper]] |
| [[Tools/Triptease Retargeting MCP\|Retargeting]] | Retargeting campaigns | [[Org Structure#Tamarin\|Tamarin]] |
| [[Tools/Triptease Price Feed\|Price Feed]] | Price feed data | [[Org Structure#Rockhopper\|Rockhopper]] |
| [[Tools/Triptease Rockhopper Hotel Config\|Rockhopper Hotel Config]] | Hotel config | [[Org Structure#Rockhopper\|Rockhopper]] |
| [[Tools/Triptease Rockhopper Debug Tools\|Rockhopper Debug Tools]] | Debug | [[Org Structure#Rockhopper\|Rockhopper]] |
| **Triptease Design System MCP** | Components, CSS tokens, setup guides | [[Org Structure#Launchpad\|Launchpad]] (Matt Elcock, Mar '26) |

---

## Shared Skills & Plugins

**Repo:** `github.com/triptease/claude-plugins`

Reusable Claude Code skills, agent definitions, and plugins shared across the company. Contributions welcome — Tripteasers are encouraged to package up working AI workflows for others to reuse.

---

## Externally-Facing AI Initiatives (KR2)

**Target:** 40 in H1 2026, framed as **Insight → Recommendation → Action**.

**Active examples:**
- M1 → M2 Messages migrator
- Date Boost Advisor
- M2 budget recommendations
- Persona insights ([[Guest Personas]])
- Guest Intelligence
- Guided campaign creation
- Design system chat prototypes

---

## Niko's Automation Stack

Niko Summers (AI & Automation Specialist) runs a stack of production AI automations — see [[Automation Stack]] for the full list and [[Tools Index]] for the underlying SaaS.

Active projects:
- [[Guest Personas]] — AI hotel guest segments
- [[Direct Booking Digest]] — weekly hospitality newsletter
- [[ABM Creator]] — Beeswax account-based marketing
- [[Help Centre Bot]] — Intercom AI assistant
- [[Automation Hub]] — internal portal
- [[Cloudprinter]] — design asset / banner generation
- [[DBSEvents]] — hospitality event scraping
- [[Triptease Studio]] — internal AI content engine

---

## Rituals & Ramp

- **AI Show & Tell** — monthly internal demo session
- **AI Ramp Program** — onboarding for AI fluency
- **`#ai-chat`** — main Slack channel for AI discussion
- **AI Asset Library** (Notion) — MCPs / skills / prompts
- **AI Tools Guide** (Notion) — what to use when

---

## Related

- [[About Triptease]]
- [[OKRs and Strategic Priorities]] — KR2 and KR3
- [[Automation Stack]] — Niko's projects
- [[Tools Index]] — full tooling inventory
- [[Triptease Studio]] — AI content engine
- [[Slack Channels]] — `#ai-chat` and others
