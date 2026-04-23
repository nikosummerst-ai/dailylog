---
status: active
tags: [project, onboarding]
area: Triptease
created: 2026-04-20
start-date: 2026-04-20
---

# Curtis Onboarding

New starter on the GTM automation team. Joins **today (Mon 20 Apr)**. Self-taught, not a developer, already using Claude Code. Briefing from Peter: don't assume knowledge.

Session booked in his calendar for this afternoon.

## This morning — provision accounts before the session

### AI tooling (Niko admin)
- [x] **Anthropic Console** — invite to Triptease workspace, generate him an API key
- [x] **Claude.ai** — Team seat
- [ ] **Claude Code** — confirm his CLI is pointed at the company API key, not a personal one
- [x] **ChatGPT** — Team seat
- [ ] **Perplexity** — Pro seat
- [x] **Google Gemini** — confirm enabled in his Google Workspace licence

### GTM automation stack (Niko admin)

- [ ] **Airtable** — Triptease workspace invite
- [x] **n8n** — create login on Triptease instance (get URL + creds into [[1Password]])
- [x] **Cursor** — team seat (optional, if he wants a GUI editor)

### Dev & deployment (Niko admin)
- [x] **GitHub** — invite to `Triptease-Mktg` org, read access on automation repos (Guest Personas, DBD, Help Centre Bot, ABM Creator, Automation Hub, DBSEvents, Cloudprinter)
- [x] **Railway** — invite to Triptease Marketing workspace

### Flag to other admins
- [ ] **IT / People team** — confirm Google SSO seats: Google Workspace, Slack, Notion, Linear, 1Password, Figma
- [ ] **RevOps / Sales** — Salesforce + HubSpot read access
- [ ] **CS lead** — Gong, Vitally read access
- [ ] **Product** — Mixpanel, Fullstory read access
- [ ] **Data team** — Looker, Looker Studio, BigQuery read access

## Monday session — walk through with him

### Orientation
- [ ] Tour the [[Automation Hub]] — dashboard, ticket system, run history
- [ ] Walk through the Obsidian vault: `_context/`, `Projects/`, `Tools/`, daily notes
- [ ] Show the [[Tools Index]] and automation stack docs
- [ ] Explain where shared credentials live in [[1Password]]

### Claude Code setup
- [ ] Confirm his install works + API key is company billing
- [ ] Walk through `CLAUDE.md` pattern (project-level + global)
- [ ] Show the Obsidian `@` import pattern for loading vault context
- [ ] Show a couple of his likely-used skills / slash commands

### GitHub (biggest friction point for non-devs)
- [ ] Clone one automation repo end-to-end with him
- [ ] Branches, commits, pushes, PRs — the basics
- [ ] Show a real PR flow on one of the marketing repos
- [ ] Set up his GitHub PAT if he needs to push to personal repos

### Deployment flow
- [ ] Show Railway deploy flow: push to `main` → auto-deploy
- [ ] Walk through a log + run history for one automation
- [ ] Show how to check an automation is healthy

### Automation tools (pick 1-2 to demo live)
- [ ] Demo a Gumloop workflow end-to-end
- [ ] Show a Zapier Zap and where we use it
- [ ] Show n8n if relevant to his first project

## First week — self-serve (things he can tick off without you)

- [ ] Read `Areas/Triptease/_context/About Triptease.md`
- [ ] Read `Areas/Triptease/_context/Automation Stack.md`
- [ ] Read `Areas/Triptease/_context/Brand Voice and Style Guide.md`
- [ ] Skim the [[Tools Index]]
- [ ] Read one existing project note end-to-end (suggest: [[Direct Booking Digest]])
- [ ] Clone one repo locally, run it, push a trivial change to a branch
- [ ] Build a throwaway Gumloop workflow to get the mechanics
- [ ] Join relevant Slack channels (ask Niko which)
- [ ] Set up his Claude Code with his CLAUDE.md preferences

## Hold off until there's a clear need
AWS S3, GCP, Cloudflare, Fastly, Datadog, Terraform, Clerk, Aikido, Prisma, Bolt, Replit, Lovable, Manus, Google Stitch, Firecrawl, Apify — introduce when a use case comes up, not up front.

## Notes
- Peter flagged 30 min won't be enough — block 90 min minimum
- He's self-taught and not a developer, so lean on live walk-throughs over documentation dumps
- Leave space for him to ask basic questions — don't assume Git / CLI / API fluency
