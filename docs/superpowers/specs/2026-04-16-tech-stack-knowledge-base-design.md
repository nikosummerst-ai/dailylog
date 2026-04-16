# Tech Stack Knowledge Base — Design Spec

## Overview

Build a comprehensive tools and software knowledge base in the Obsidian vault that maps every tool Triptease uses, links them bidirectionally to projects, and ensures every Claude Code project session automatically loads vault context.

## Goals

1. **Discoverability** — When planning a new project, instantly see what tools/APIs/services are available across the org
2. **Cross-project awareness** — Navigate from a tool to every project that uses it, and from a project to every tool in its stack
3. **Reuse patterns** — Enable Claude to suggest "we already use X in project Y, we could reuse that approach here"
4. **Automatic context** — Every project session loads vault context without manual setup

## Scope

- Triptease org tools only (no personal tools like Telegram Bot API, QMD)
- Tools discovered from: existing project codebases, Notion, Slack
- Capture: tool name, description, category, who uses it and how, access info, project links

---

## 1. Tool Notes

### Location
`Areas/Triptease/_context/Tools/`

### Template
```markdown
---
status: active
tags: [tool/CATEGORY]
category: CATEGORY
area: Triptease
created: 2026-04-16
---

# Tool Name

## What It Does
One-liner description.

## How We Use It
- Team/person and use case with [[wiki links]] to projects

## Access
- Dashboard/URL
- Who has access (if known)

## Used By
- [[Project Name]] — what it does in this project

## Notes
Anything useful: pricing tier, API limits, alternatives, gotchas.
```

### Tag Categories
- `#tool/ai` — Claude API, OpenAI, Google Gemini
- `#tool/infrastructure` — Railway, AWS S3, PostgreSQL, Redis
- `#tool/scraping` — Firecrawl, Apify, Selenium
- `#tool/communication` — Slack, Intercom
- `#tool/design` — Figma, Canva
- `#tool/data` — BigQuery, Google Sheets, Google Analytics
- `#tool/crm` — HubSpot, Revenate, Beeswax
- `#tool/dev` — GitHub, Prisma, Auth.js, Next.js

### Expected Volume
~25-35 tool notes based on initial discovery. Will grow as Notion/Slack crawl reveals more.

---

## 2. Tools Index

### Location
`Areas/Triptease/_context/Tools Index.md`

### Purpose
Compact quick-reference table of all tools. Not auto-imported separately — discoverable through vault context.

### Format
```markdown
---
status: active
tags: [reference]
area: Triptease
created: 2026-04-16
---

# Tools Index

| Tool | Category | Used By | Purpose |
|------|----------|---------|---------|
| [[Claude API]] | AI | Guest Personas, DBD, Help Centre, ABM, Hub, Studio | LLM — scoring, generation, analysis |
| [[Firecrawl]] | Scraping | Guest Personas, DBSEvents | Website crawling |
| ... | ... | ... | ... |
```

---

## 3. Bidirectional Linking

### Tool Notes → Projects
Each tool note has a "Used By" section with `[[wiki links]]` to every project that uses it, plus a one-liner of what the tool does in that project.

### Project Notes → Tools
Each existing Triptease project note gets a `## Tech Stack` section added with wiki-linked tool references. Example:

```markdown
## Tech Stack
- [[Claude API]] — segment generation, refinement, JTBD analysis
- [[Firecrawl]] — hotel website crawling
- [[Railway]] — hosting (prod + dev)
```

### Rules
- Don't restructure or rewrite existing project notes — only add the Tech Stack section
- If a project already has stack info in its overview, keep it and add the wiki-linked section alongside
- Tool "Used By" and project "Tech Stack" are mirrors — full graph connectivity

---

## 4. Notion & Slack Discovery

### Notion Crawl
- Search for pages/databases about: tools, software, subscriptions, tech stack, onboarding, IT
- Check team wikis for tool references
- Look for admin/ops documentation

### Slack Crawl
- Search public channels for tool mentions and software discussions
- Check channel names for tool-related channels (#design, #engineering, #tools, etc.)
- Look at installed Slack apps/integrations
- Surface who uses what and how (team/role context)

### Capture Per Tool
- Name, description, category
- Who uses it and how (team/role context from discussions)
- Access URLs or dashboard links
- Whether Niko currently uses it or it's available to leverage

### Exclusions
- Dead/deprecated tools
- Generic utilities (browsers, OS)
- Ambiguous finds flagged in a review section for user confirmation

---

## 5. Vault Import — Retrofit All Projects

### Import Line
```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md
```

### Placement
**Top of every CLAUDE.md** — first line, before any existing content.

### Projects to Update (existing CLAUDE.md — 6 files)
1. `/Users/nikosummers/Desktop/ClaudeProjects/Beeswax/CLAUDE.md`
2. `/Users/nikosummers/Desktop/ClaudeProjects/Ticket System/CLAUDE.md`
3. `/Users/nikosummers/Desktop/ClaudeProjects/Help Centre/CLAUDE.md`
4. `/Users/nikosummers/Desktop/ClaudeProjects/DBD/CLAUDE.md`
5. `/Users/nikosummers/Desktop/ClaudeProjects/Claude Guest Personas/CLAUDE.md`
6. `/Users/nikosummers/Desktop/ClaudeProjects/Obsidian/_System/personal-bot/CLAUDE.md`

### Projects to Create CLAUDE.md (4 files)
7. `/Users/nikosummers/Desktop/ClaudeProjects/Cloudprinter/CLAUDE.md`
8. `/Users/nikosummers/Desktop/ClaudeProjects/DBSEvents/CLAUDE.md`
9. `/Users/nikosummers/Desktop/ClaudeProjects/Testing/CLAUDE.md`
10. `/Users/nikosummers/Desktop/ClaudeProjects/abm-creator-deploy/CLAUDE.md`

### New CLAUDE.md Template (for projects without one)
```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# Project Name

<!-- Project-specific instructions go below -->
```

---

## 6. Auto-CLAUDE.md Hook

### Purpose
When any CLAUDE.md is written or edited in a Claude Code session, ensure the vault import line is present at the top.

### Implementation
Global Claude Code hook in `~/.claude/settings.json`:
- Trigger: `Write` or `Edit` tool calls on files matching `**/CLAUDE.md`
- Action: Shell script that checks if the import line exists at the top; if not, prepends it
- Skip: The vault's own CLAUDE.md (`~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md`)

### Hook Script Logic
```
1. Read the target CLAUDE.md
2. If path is the vault CLAUDE.md → exit (don't self-reference)
3. If first line is already the @import → exit (already present)
4. Prepend the @import line + blank line before existing content
5. Write back
```

---

## Non-Goals

- Personal tools (Telegram, QMD) — out of scope
- Tool subscription management or billing tracking
- Modifying the vault's own CLAUDE.md structure
- Automated tool discovery (one-time crawl, not recurring)
