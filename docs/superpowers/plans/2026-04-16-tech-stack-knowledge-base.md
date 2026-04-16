# Tech Stack Knowledge Base — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive tools knowledge base in the Obsidian vault with bidirectional project links, retrofit all projects with vault context imports, and set up a hook to auto-inject vault imports into future CLAUDE.md files.

**Architecture:** Tool notes live in `Areas/Triptease/_context/Tools/`, each linking to projects that use them. Project notes get `## Tech Stack` sections linking back. A global Claude Code hook ensures every new CLAUDE.md auto-imports the vault context. Notion and Slack are crawled for org-wide tool discovery beyond what's visible in codebases.

**Tech Stack:** Obsidian markdown, Claude Code hooks (shell script), Notion MCP, Slack MCP

**Spec:** `docs/superpowers/specs/2026-04-16-tech-stack-knowledge-base-design.md`

---

## Wave 1 — Independent tasks (run in parallel)

### Task 1: Retrofit all project CLAUDE.md files with vault import

Prepend `@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md` as the first line of every project's CLAUDE.md. For projects without a CLAUDE.md, create one.

**Files (modify existing):**
- `/Users/nikosummers/Desktop/ClaudeProjects/Beeswax/CLAUDE.md`
- `/Users/nikosummers/Desktop/ClaudeProjects/Ticket System/CLAUDE.md`
- `/Users/nikosummers/Desktop/ClaudeProjects/Help Centre/CLAUDE.md`
- `/Users/nikosummers/Desktop/ClaudeProjects/DBD/CLAUDE.md`
- `/Users/nikosummers/Desktop/ClaudeProjects/Claude Guest Personas/CLAUDE.md`
- `/Users/nikosummers/Desktop/ClaudeProjects/Obsidian/_System/personal-bot/CLAUDE.md`

**Files (create new):**
- `/Users/nikosummers/Desktop/ClaudeProjects/Cloudprinter/CLAUDE.md`
- `/Users/nikosummers/Desktop/ClaudeProjects/DBSEvents/CLAUDE.md`
- `/Users/nikosummers/Desktop/ClaudeProjects/Testing/CLAUDE.md`
- `/Users/nikosummers/Desktop/ClaudeProjects/abm-creator-deploy/CLAUDE.md`

- [ ] **Step 1: Prepend vault import to Beeswax/CLAUDE.md**

The current first line is `# Beeswax ABM Project`. Prepend the import line + blank line:

```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# Beeswax ABM Project
```

- [ ] **Step 2: Prepend vault import to Ticket System/CLAUDE.md**

Current first line: `# Triptease Automation Hub`. Prepend:

```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# Triptease Automation Hub
```

- [ ] **Step 3: Prepend vault import to Help Centre/CLAUDE.md**

Current first line: `# Help Centre Bot — Project Intelligence`. Prepend:

```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# Help Centre Bot — Project Intelligence
```

- [ ] **Step 4: Prepend vault import to DBD/CLAUDE.md**

Current first line: `# DBD Newsletter - Claude Code Guide`. Prepend:

```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# DBD Newsletter - Claude Code Guide
```

- [ ] **Step 5: Prepend vault import to Claude Guest Personas/CLAUDE.md**

Current first line: `# Guest Persona Generator`. Prepend:

```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# Guest Persona Generator
```

- [ ] **Step 6: Prepend vault import to Obsidian/_System/personal-bot/CLAUDE.md**

Current first line: `# Personal Telegram Bot`. Prepend:

```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# Personal Telegram Bot
```

- [ ] **Step 7: Create Cloudprinter/CLAUDE.md**

```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# Cloudprinter

Design asset management and banner generation for Triptease marketing collateral.

<!-- Project-specific instructions go below -->
```

- [ ] **Step 8: Create DBSEvents/CLAUDE.md**

```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# DBSEvents

Hospitality industry event scraper. Crawls event websites, deduplicates, stores to Google Sheets.

<!-- Project-specific instructions go below -->
```

- [ ] **Step 9: Create Testing/CLAUDE.md**

```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# Testing

Scratch/testing workspace.

<!-- Project-specific instructions go below -->
```

- [ ] **Step 10: Create abm-creator-deploy/CLAUDE.md**

```markdown
@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md

# ABM Creator Deploy

Deployment artifacts for the ABM Creator / Beeswax pipeline.

<!-- Project-specific instructions go below -->
```

---

### Task 2: Set up auto-CLAUDE.md hook

Add a global Claude Code hook that fires after any `Write` or `Edit` on a CLAUDE.md file and ensures the vault import line is present at the top.

**Files:**
- Modify: `~/.claude/settings.json` (add new PostToolUse hook)
- Create: `~/.claude/hooks/ensure-vault-import.sh`

- [ ] **Step 1: Create the hook script at `~/.claude/hooks/ensure-vault-import.sh`**

```bash
#!/bin/bash
# Ensures @~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md is the first line of any CLAUDE.md

# The tool result JSON is passed via stdin — extract the file path
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null)

# Only act on CLAUDE.md files
if [[ ! "$FILE_PATH" =~ CLAUDE\.md$ ]]; then
  exit 0
fi

# Don't self-reference the vault's own CLAUDE.md
VAULT_CLAUDE="$HOME/Desktop/ClaudeProjects/Obsidian/CLAUDE.md"
REAL_FILE=$(realpath "$FILE_PATH" 2>/dev/null || echo "$FILE_PATH")
REAL_VAULT=$(realpath "$VAULT_CLAUDE" 2>/dev/null || echo "$VAULT_CLAUDE")
if [[ "$REAL_FILE" == "$REAL_VAULT" ]]; then
  exit 0
fi

# Check if the import line is already present
IMPORT_LINE="@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md"
FIRST_LINE=$(head -1 "$FILE_PATH" 2>/dev/null)

if [[ "$FIRST_LINE" != "$IMPORT_LINE" ]]; then
  # Prepend the import line
  TEMP=$(mktemp)
  echo "$IMPORT_LINE" > "$TEMP"
  echo "" >> "$TEMP"
  cat "$FILE_PATH" >> "$TEMP"
  mv "$TEMP" "$FILE_PATH"
fi
```

- [ ] **Step 2: Make the script executable**

Run: `chmod +x ~/.claude/hooks/ensure-vault-import.sh`

- [ ] **Step 3: Add the PostToolUse hook to `~/.claude/settings.json`**

Add this entry to the `PostToolUse` hooks array in settings.json:

```json
{
  "matcher": "Edit|Write",
  "hooks": [
    {
      "type": "command",
      "command": "~/.claude/hooks/ensure-vault-import.sh"
    }
  ]
}
```

This goes in the existing `hooks.PostToolUse` array alongside the existing lint-on-save and pixel-agents entries.

- [ ] **Step 4: Test the hook**

Create a temporary test CLAUDE.md somewhere, edit it via Claude Code, and verify the import line gets prepended. Then delete the test file.

---

### Task 3: Crawl Notion and Slack for org-wide tools

Research task — search Notion and Slack for tools, software, and platforms used across Triptease.

- [ ] **Step 1: Search Notion for tool/software pages**

Use the Notion MCP to search for:
- "tools" / "software" / "tech stack" / "subscriptions"
- "onboarding" (often lists tools new hires need)
- "IT" / "admin" / "systems"
- Any databases or wikis that track software

Record: tool name, description, who uses it, any access URLs.

- [ ] **Step 2: Search Slack for tool mentions and integrations**

Use the Slack MCP to:
- Search public channels for: "Figma", "Canva", "Jira", "Asana", "Notion", "Datadog", "Mixpanel", "Google Analytics", "Salesforce", "HubSpot", "Zendesk", "Zapier", "Monday", "Miro", "Loom", "Confluence", "Linear"
- Search for channel names containing tool references
- Look for app integration messages (bot messages from tools)
- Search for messages about "new tool", "access to", "license for", "subscription"

Record: tool name, who mentioned it, context of use.

- [ ] **Step 3: Compile discovery results**

Create a temporary findings file at `docs/superpowers/plans/notion-slack-discovery.md` listing:
- Each tool found
- Category
- Who uses it / how
- Any access URLs
- Whether it's already known from codebase analysis or newly discovered

---

### Task 4: Create tool notes — AI tools

**Files (create all):**
- `Areas/Triptease/_context/Tools/Claude API.md`
- `Areas/Triptease/_context/Tools/OpenAI API.md`
- `Areas/Triptease/_context/Tools/Google Gemini.md`

- [ ] **Step 1: Create `Areas/Triptease/_context/Tools/` directory**

Run: `mkdir -p ~/Desktop/ClaudeProjects/Obsidian/Areas/Triptease/_context/Tools`

- [ ] **Step 2: Create Claude API.md**

```markdown
---
status: active
tags: [tool/ai]
category: AI
area: Triptease
created: 2026-04-16
---

# Claude API

## What It Does
Anthropic's LLM API for text generation, scoring, analysis, and agentic workflows.

## How We Use It
- Primary AI engine across all Triptease marketing automations
- Content scoring and generation in [[Direct Booking Digest]]
- Guest segment generation and refinement in [[Guest Personas]]
- Help article gap detection and content suggestions in [[Help Centre Bot]]
- Campaign copy generation in [[ABM Creator]]
- Brand-compliant content engine in [[Triptease Studio]]
- AI features in [[Automation Hub]] portal

## Access
- Console: https://console.anthropic.com
- Models used: claude-sonnet-4-6 (most projects), claude-sonnet-4 (Studio)

## Used By
- [[Guest Personas]] — segment generation, JTBD analysis, refinement, CRM matching
- [[Direct Booking Digest]] — article relevance scoring (0-100), newsletter copy generation
- [[Help Centre Bot]] — content gap detection, article update proposals, sunset verification
- [[ABM Creator]] — campaign copy generation
- [[Automation Hub]] — AI features in portal
- [[Triptease Studio]] — brand compliance checking, content generation with style/persona layers

## Notes
- Prompt caching used in Triptease Studio for cost efficiency
- Guest Personas has a learning system that feeds accumulated insights into Claude prompts
- Help Centre Bot uses a two-pass approach: regex candidates then Claude verification
```

- [ ] **Step 3: Create OpenAI API.md**

```markdown
---
status: active
tags: [tool/ai]
category: AI
area: Triptease
created: 2026-04-16
---

# OpenAI API

## What It Does
OpenAI's API platform — used primarily for Whisper speech-to-text transcription.

## How We Use It
- Voice note transcription in the personal Telegram bot
- Potential text generation in [[ABM Creator]]

## Access
- Console: https://platform.openai.com

## Used By
- Personal Telegram Bot — Whisper transcription of voice messages to text
- [[ABM Creator]] — potential usage for text generation

## Notes
- Not the primary LLM provider — Claude API is preferred for all text generation
- Whisper is the main use case (speech-to-text for voice notes)
```

- [ ] **Step 4: Create Google Gemini.md**

```markdown
---
status: active
tags: [tool/ai]
category: AI
area: Triptease
created: 2026-04-16
---

# Google Gemini

## What It Does
Google's multimodal AI API — used for image and infographic generation.

## How We Use It
- Infographic generation for hotel guest persona reports in [[Guest Personas]]

## Access
- Console: https://aistudio.google.com

## Used By
- [[Guest Personas]] — generates infographic images for persona reports (auto-approved, triggers PDF generation)

## Notes
- Specifically chosen for image generation capabilities
- Part of the Guest Personas pipeline step 8: generate infographic → auto-approve → spawn PDF
- Expect 3-5+ iterations for image generation tasks
```

---

### Task 5: Create tool notes — Infrastructure

**Files (create all):**
- `Areas/Triptease/_context/Tools/Railway.md`
- `Areas/Triptease/_context/Tools/AWS S3.md`
- `Areas/Triptease/_context/Tools/PostgreSQL.md`
- `Areas/Triptease/_context/Tools/Redis.md`
- `Areas/Triptease/_context/Tools/Netlify.md`

- [ ] **Step 1: Create Railway.md**

```markdown
---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# Railway

## What It Does
Cloud platform for deploying and hosting applications, databases, and services. Auto-deploys from GitHub on push.

## How We Use It
- Primary deployment platform for all Triptease marketing automations
- Hosts PostgreSQL and Redis databases
- Staging + production environments per service
- Auto-deploys on git push to main

## Access
- Dashboard: https://railway.com
- Triptease project: Triptease Marketing workspace

## Used By
- [[Guest Personas]] — prod + dev services, PostgreSQL
- [[Direct Booking Digest]] — Express server, PostgreSQL, Redis
- [[Help Centre Bot]] — bot + worker services, shared PostgreSQL (Postgres-m5QY)
- [[ABM Creator]] — abm-creator + beeswax-pipeline services
- [[Automation Hub]] — Next.js app, shared PostgreSQL (Postgres-m5QY)
- [[Triptease Studio]] — hosting
- [[Cloudprinter]] — (uses Netlify instead)

## Notes
- Shared database: Postgres-m5QY is shared between Automation Hub and Help Centre Bot
- Internal networking available between services (e.g., `http://beeswax.railway.internal:3000`)
- Public proxy for DB access: `autorack.proxy.rlwy.net:20324`
- Dockerfile or Nixpacks build supported — Dockerfile preferred for Node 22
- `[skip deploy]` in commit messages may prevent auto-redeploy (unverified)
```

- [ ] **Step 2: Create AWS S3.md**

```markdown
---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# AWS S3

## What It Does
Amazon's object storage service for files, assets, and data.

## How We Use It
- Asset storage for guest persona reports (infographics, PDFs, reviews, website crawl data)
- Learning system storage for the Guest Personas pipeline
- CRM daily data exchange between n8n and Guest Personas
- Static dashboard hosting

## Access
- Bucket: `guest-segments-generator` (us-east-1)
- Dashboard: https://guest-segments-generator.s3.amazonaws.com/dashboard.html

## Used By
- [[Guest Personas]] — infographic images, PDF reports, reviews markdown, website crawl data, learnings files, CRM daily CSVs, top 8 cache, cost tracking dashboard
- [[Automation Hub]] — file storage

## Notes
- Key S3 paths: `top8_cache/`, `learnings/`, `crm_daily/`, `crm_results/`, `crm_aggregate/`
- Top 8 cache has 90-day TTL (permanent if `crm_linked: true`)
- Learning system files: `pipeline_learnings.md` (rotating 10), `graduated_learnings.md` (permanent 50), `prompt_patch.md`
```

- [ ] **Step 3: Create PostgreSQL.md**

```markdown
---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# PostgreSQL

## What It Does
Relational database for structured data storage, managed via Prisma ORM in most projects.

## How We Use It
- Primary database for all web applications and automation services
- Hosted on Railway with internal + public proxy access

## Access
- Hosted on Railway (auto-provisioned per project)
- Shared instance: Postgres-m5QY (Automation Hub + Help Centre Bot)
- Public proxy: `autorack.proxy.rlwy.net:20324`
- Access via: `psql "$(railway variables --service Postgres-m5QY --json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['DATABASE_PUBLIC_URL'])")"`

## Used By
- [[Automation Hub]] — users, projects, tickets, automation runs, help centre articles (Prisma ORM)
- [[Help Centre Bot]] — content items, articles, evidence, scan state (Prisma ORM, shared DB with Hub)
- [[Direct Booking Digest]] — articles, published history, blacklisted authors, scoring feedback
- [[Guest Personas]] — run tracking via Automation Hub

## Notes
- Prisma ORM used in Automation Hub and Help Centre Bot
- Raw SQL migrations used in DBD
- Shared DB pattern: Hub and Help Centre Bot share Postgres-m5QY — schema changes affect both
- DATABASE_URL must be available at build time for Next.js projects (Prisma generates at build)
```

- [ ] **Step 4: Create Redis.md**

```markdown
---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# Redis

## What It Does
In-memory data store for caching, session management, and ephemeral data.

## How We Use It
- Modal cache and session data in the DBD newsletter pipeline
- Selection state and completion flags during Slack editorial workflows

## Access
- Hosted on Railway (auto-provisioned)
- Connected via `REDIS_URL` env var

## Used By
- [[Direct Booking Digest]] — modal cache, article selections, completion flags during editorial workflow

## Notes
- Used for ephemeral/session data only — persistent data goes to PostgreSQL
```

- [ ] **Step 5: Create Netlify.md**

```markdown
---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# Netlify

## What It Does
Static site hosting and deployment platform.

## How We Use It
- Hosts the Cloudprinter design asset management tool

## Access
- Dashboard: https://app.netlify.com

## Used By
- [[Cloudprinter]] — static site deployment for design asset management

## Notes
- Only used for Cloudprinter — Railway is the primary deployment platform for all other projects
```

---

### Task 6: Create tool notes — Scraping & Data

**Files (create all):**
- `Areas/Triptease/_context/Tools/Firecrawl.md`
- `Areas/Triptease/_context/Tools/Apify.md`
- `Areas/Triptease/_context/Tools/Selenium.md`
- `Areas/Triptease/_context/Tools/Google BigQuery.md`
- `Areas/Triptease/_context/Tools/Google Sheets.md`
- `Areas/Triptease/_context/Tools/Google Places API.md`
- `Areas/Triptease/_context/Tools/Google Custom Search API.md`

- [ ] **Step 1: Create Firecrawl.md**

```markdown
---
status: active
tags: [tool/scraping]
category: Scraping
area: Triptease
created: 2026-04-16
---

# Firecrawl

## What It Does
Web crawling and scraping API that extracts clean, structured content from websites.

## How We Use It
- Hotel website crawling for guest persona analysis in [[Guest Personas]]
- Event website scraping in [[DBSEvents]]

## Access
- Dashboard: https://firecrawl.dev

## Used By
- [[Guest Personas]] — crawls hotel websites to extract content for persona generation (pipeline step 4)
- [[DBSEvents]] — crawls hospitality event websites for event data

## Notes
- Part of the Guest Personas pipeline: Google Places → Booking.com URL → Apify reviews → Firecrawl website → Claude analysis
- Cost tracked on Guest Personas dashboard
- Alternative to Selenium for JavaScript-rendered pages
```

- [ ] **Step 2: Create Apify.md**

```markdown
---
status: active
tags: [tool/scraping]
category: Scraping
area: Triptease
created: 2026-04-16
---

# Apify

## What It Does
Web scraping platform with pre-built actors for extracting data from popular websites.

## How We Use It
- Scraping hotel reviews from Google Maps and Booking.com for guest persona generation

## Access
- Dashboard: https://console.apify.com

## Used By
- [[Guest Personas]] — Google Maps review scraping + Booking.com review scraping (pipeline step 3)

## Notes
- Pre-built actors handle platform-specific scraping logic
- Cost tracked on Guest Personas dashboard
- Part of the data collection pipeline before Claude analysis
```

- [ ] **Step 3: Create Selenium.md**

```markdown
---
status: active
tags: [tool/scraping]
category: Scraping
area: Triptease
created: 2026-04-16
---

# Selenium

## What It Does
Browser automation framework for web scraping and testing.

## How We Use It
- Event website scraping in [[DBSEvents]] alongside [[Firecrawl]]

## Access
- Open source — installed as a Python dependency

## Used By
- [[DBSEvents]] — browser-based scraping of hospitality event websites

## Notes
- Used in DBSEvents alongside Firecrawl for sites that need full browser rendering
- No cloud deployment — runs locally as a Python script
```

- [ ] **Step 4: Create Google BigQuery.md**

```markdown
---
status: active
tags: [tool/data]
category: Data
area: Triptease
created: 2026-04-16
---

# Google BigQuery

## What It Does
Google's serverless data warehouse for large-scale SQL analytics.

## How We Use It
- Behavioral reservation data for guest persona enrichment
- BQ reservation system that force-inserts segments backed by behavioral data
- Daily CRM data extraction for guest persona matching

## Access
- Console: https://console.cloud.google.com/bigquery

## Used By
- [[Guest Personas]] — behavioral data enrichment (journeys per segment), BQ reservation system (≥30 journeys threshold), CRM daily extraction via n8n
- [[Guest Persona CRM Tagging]] — daily BQ extraction → match CRM via booking references → push to CRM

## Notes
- BQ data not always present — all code must handle `behavioral_segments=None/[]` gracefully
- n8n uploads daily BQ CSVs to S3 for CRM matching
- BQ reservation system runs after rank_to_top_15, before enrich_with_behavioral_data
```

- [ ] **Step 5: Create Google Sheets.md**

```markdown
---
status: active
tags: [tool/data]
category: Data
area: Triptease
created: 2026-04-16
---

# Google Sheets

## What It Does
Google's spreadsheet platform — used as a lightweight output/reporting layer.

## How We Use It
- Newsletter output export in [[Direct Booking Digest]]
- Event data storage in [[DBSEvents]]
- Historical run data in [[Guest Personas]]

## Access
- Via Google Workspace (service account credentials for API access)

## Used By
- [[Direct Booking Digest]] — exports finalized newsletter articles to a Google Spreadsheet
- [[DBSEvents]] — stores scraped event data
- [[Guest Personas]] — historical output (now migrating to Automation Hub)

## Notes
- API access via base64-encoded service account JSON (`GOOGLE_SHEETS_CREDENTIALS` env var)
- Lightweight reporting layer — not used for primary data storage
```

- [ ] **Step 6: Create Google Places API.md**

```markdown
---
status: active
tags: [tool/data]
category: Data
area: Triptease
created: 2026-04-16
---

# Google Places API

## What It Does
Google API for looking up business details, ratings, and location data by Place ID.

## How We Use It
- First step in the Guest Personas pipeline: look up hotel details from a Google Place ID

## Access
- Console: https://console.cloud.google.com/apis

## Used By
- [[Guest Personas]] — pipeline step 1: get hotel name, address, rating, and details from Place ID

## Notes
- Cost tracked on Guest Personas dashboard
- Pipeline input is always a Google Place ID (format: `ChIJxxxx...`)
```

- [ ] **Step 7: Create Google Custom Search API.md**

```markdown
---
status: active
tags: [tool/data]
category: Data
area: Triptease
created: 2026-04-16
---

# Google Custom Search API

## What It Does
Programmable search engine API for finding specific URLs from Google search results.

## How We Use It
- Finding Booking.com URLs for hotels in the Guest Personas pipeline

## Access
- Console: https://console.cloud.google.com/apis

## Used By
- [[Guest Personas]] — pipeline step 2: search for hotel's Booking.com URL to scrape reviews

## Notes
- Specifically configured to search Booking.com domain
- Feeds into Apify review scraping step
```

---

### Task 7: Create tool notes — Communication & Design

**Files (create all):**
- `Areas/Triptease/_context/Tools/Slack.md`
- `Areas/Triptease/_context/Tools/Intercom.md`
- `Areas/Triptease/_context/Tools/Notion.md`
- `Areas/Triptease/_context/Tools/Figma.md`
- `Areas/Triptease/_context/Tools/Canva.md`

- [ ] **Step 1: Create Slack.md**

```markdown
---
status: active
tags: [tool/communication]
category: Communication
area: Triptease
created: 2026-04-16
---

# Slack

## What It Does
Team messaging platform — also used as the primary interface for automation tools via Slack Bolt framework.

## How We Use It
- Company-wide communication
- Primary UI for marketing automations (modals, commands, notifications)
- Slack Bolt (Node.js) framework powers interactive workflows
- Slash commands trigger pipelines

## Access
- Workspace: Triptease Slack
- Bolt apps: multiple custom apps per automation

## Used By
- [[Direct Booking Digest]] — `/digest` command, article selection modals, newsletter approval flow
- [[Help Centre Bot]] — content gap notifications, review modals, weekly summary messages
- [[Guest Personas]] — `/guest-segment` command, infographic posting, regeneration modals, CRM notifications
- [[ABM Creator]] — campaign creation modals and notifications
- [[Automation Hub]] — notifications and status updates

## Notes
- Bolt framework conventions: max 3 stacked modals, max 100 blocks each, 3000 chars per text block
- Bold in Slack: use `*bold*` not `**bold**`
- 3-second acknowledgment window for Slack responses — use background tasks for long operations
- Socket Mode used by Help Centre Bot; Express receiver used by DBD
- Each automation has its own Slack app with separate tokens (dev/prod)
```

- [ ] **Step 2: Create Intercom.md**

```markdown
---
status: active
tags: [tool/communication]
category: Communication
area: Triptease
created: 2026-04-16
---

# Intercom

## What It Does
Customer messaging and help centre platform.

## How We Use It
- Hosts Triptease's help centre articles
- [[Help Centre Bot]] monitors and improves article quality

## Access
- Dashboard: https://app.intercom.com

## Used By
- [[Help Centre Bot]] — syncs help centre articles, detects stale/deprecated content, proposes updates

## Notes
- Article.collectionId stores Intercom string ID (e.g., "102201"), NOT Prisma UUID
- Help Centre Bot compares release notes against articles to find gaps
```

- [ ] **Step 3: Create Notion.md**

```markdown
---
status: active
tags: [tool/communication]
category: Communication
area: Triptease
created: 2026-04-16
---

# Notion

## What It Does
Team wiki, project management, and documentation platform.

## How We Use It
- Company-wide documentation and knowledge management
- Release notes database tracked by [[Help Centre Bot]]
- Task and project tracking across teams

## Access
- Workspace: Triptease Notion

## Used By
- [[Help Centre Bot]] — reads release notes database and drafts database for article gap detection
  - Release notes DB: `24d46336-7897-809e-8247-dc5d62997bf0`
  - Drafts DB: `33346336-7897-81b8-a7d6-cb799d6e6ae3`

## Notes
- REST API with `Notion-Version: 2022-06-28` header (SDK v5 removed `databases.query`)
- Feature Status field rarely updated in practice — don't filter on it
- Meeting notes imported from Notion to Obsidian vault via scheduled agent
```

- [ ] **Step 4: Create Figma.md**

```markdown
---
status: active
tags: [tool/design]
category: Design
area: Triptease
created: 2026-04-16
---

# Figma

## What It Does
Collaborative design tool for UI/UX design, prototyping, and design systems.

## How We Use It
- Product UI design for Triptease platform
- Design system management
- Marketing asset design and prototyping

## Access
- Dashboard: https://figma.com
- Triptease workspace

## Used By
- Product/design team — UI/UX design for Triptease products
- Niko — design asset creation, component design for automation tools

## Notes
- MCP integration available in Claude Code for reading/writing Figma files
- Code Connect available for mapping Figma components to code
- Triptease design system documented (components, CSS tokens, setup guide available via MCP)
```

- [ ] **Step 5: Create Canva.md**

```markdown
---
status: active
tags: [tool/design]
category: Design
area: Triptease
created: 2026-04-16
---

# Canva

## What It Does
Online design platform for creating marketing materials, presentations, and social media content.

## How We Use It
- Marketing collateral creation
- Social media assets
- Presentation design
- Quick design work that doesn't need Figma

## Access
- Dashboard: https://canva.com
- Triptease team account

## Used By
- Marketing team — social media assets, presentation design, quick marketing materials

## Notes
- MCP integration available in Claude Code for design automation
- Supports brand kit management, template search, and design generation via API
- Complements [[Figma]] — Canva for quick marketing assets, Figma for product UI
```

---

### Task 8: Create tool notes — CRM, Marketing & Dev

**Files (create all):**
- `Areas/Triptease/_context/Tools/HubSpot.md`
- `Areas/Triptease/_context/Tools/Revenate.md`
- `Areas/Triptease/_context/Tools/Beeswax DSP.md`
- `Areas/Triptease/_context/Tools/GitHub.md`
- `Areas/Triptease/_context/Tools/Prisma.md`
- `Areas/Triptease/_context/Tools/n8n.md`
- `Areas/Triptease/_context/Tools/Auth.js.md`
- `Areas/Triptease/_context/Tools/Next.js.md`

- [ ] **Step 1: Create HubSpot.md**

```markdown
---
status: active
tags: [tool/crm]
category: CRM
area: Triptease
created: 2026-04-16
---

# HubSpot

## What It Does
CRM and marketing automation platform.

## How We Use It
- Website segment tagging for account-based marketing campaigns
- The HubSpot footer script on triptease.com contains the ABM segment tagger

## Access
- Dashboard: https://app.hubspot.com

## Used By
- [[ABM Creator]] — segment tagger script in triptease.com footer (currently pointing at staging buzz_key `triptease2sbx`, needs manual update for production)

## Notes
- HubSpot website footer HTML must be manually updated when switching ABM from staging to production
```

- [ ] **Step 2: Create Revenate.md**

```markdown
---
status: active
tags: [tool/crm]
category: CRM
area: Triptease
created: 2026-04-16
---

# Revenate

## What It Does
Hotel CRM platform for guest data management and marketing.

## How We Use It
- Daily guest data matching against persona segments
- CRM integration target for [[Guest Persona CRM Tagging]]

## Access
- API access via hotel-specific credentials

## Used By
- [[Guest Personas]] — daily CRM matching: n8n uploads Revenate CSVs → match guests to personas → push tags
- [[Guest Persona CRM Tagging]] — approved hotels: Boardwalk Aruba (1 hotel), Evans Hotels (3 resorts)

## Notes
- Part of a multi-CRM pipeline: Revenate, BookBoost, Growth Solutions, + 1 TBD
- CRM-linked hotels have permanent top 8 cache (no 90-day TTL expiry)
- Revenate API keys still needed from some hotels
```

- [ ] **Step 3: Create Beeswax DSP.md**

```markdown
---
status: active
tags: [tool/crm]
category: CRM
area: Triptease
created: 2026-04-16
---

# Beeswax DSP

## What It Does
Demand-side platform for programmatic advertising and account-based marketing.

## How We Use It
- Account-based marketing campaign targeting for hotels
- Programmatic ad delivery based on guest persona segments

## Access
- Staging buzz_key: `triptease2sbx`
- Production buzz_key: `triptease`

## Used By
- [[ABM Creator]] — creates and manages ABM campaigns via Beeswax API
  - ABM Creator service: `guestpersonas-production.up.railway.app`
  - Beeswax pipeline service: `beeswax-production.up.railway.app`
  - Internal: `http://beeswax.railway.internal:3000`

## Notes
- Default daily budget: $1.00 for both staging and production (never set higher without explicit instruction)
- beeswax-node-client cookie fix is lost on `npm install` — reapply if API calls time out
- Needs integration into [[Automation Hub]] (urgent priority)
```

- [ ] **Step 4: Create GitHub.md**

```markdown
---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# GitHub

## What It Does
Code hosting, version control, and collaboration platform.

## How We Use It
- All Triptease marketing automation code is hosted on GitHub
- Push-to-deploy workflow with Railway (auto-deploys on push to main)
- GitHub API used for file access in cloud-deployed bots

## Access
- Org: https://github.com/Triptease-Mktg (Triptease marketing automations)
- Personal: https://github.com/nikosummerst-ai (personal projects)

## Used By
- [[Guest Personas]] — `Triptease-Mktg/GuestPersonas.git`
- [[Direct Booking Digest]] — `Triptease-Mktg/DBD-Newsletter-Automation.git`
- [[Help Centre Bot]] — `Triptease-Mktg/help-centre-bot.git`
- [[ABM Creator]] — `Triptease-Mktg/abm-creator.git`
- [[Automation Hub]] — `Triptease-Mktg/Automation-Dashboard.git`
- Personal vault — `nikosummerst-ai/dailylog.git`

## Notes
- Railway auto-deploys on push to main — be careful with rapid pushes (can cause restart loops)
- Personal repos use PAT stored in git remote URL
- Triptease repos use SSH key (`nikosummers-sudo`)
```

- [ ] **Step 5: Create Prisma.md**

```markdown
---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# Prisma

## What It Does
TypeScript ORM for type-safe database access and schema management.

## How We Use It
- Database schema definition and migration management
- Type-safe database queries in TypeScript projects

## Access
- Open source — installed as a dependency
- Prisma Studio: `npm run db:studio`

## Used By
- [[Automation Hub]] — full Prisma setup with migrations, seeding, and Prisma Studio
- [[Help Centre Bot]] — shared database schema with Automation Hub (Postgres-m5QY)

## Notes
- Generated client lives in `src/generated/prisma/` (do not edit)
- DATABASE_URL must be available at build time for Next.js projects
- Shared schema between Hub and Help Centre Bot — changes affect both services
- If migration fails with "no baseline", use `prisma migrate dev --name baseline --create-only`
```

- [ ] **Step 6: Create n8n.md**

```markdown
---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# n8n

## What It Does
Open-source workflow automation platform for connecting services and automating data flows.

## How We Use It
- Orchestrates daily CRM data flows between BigQuery, S3, and Guest Personas
- Uploads daily BQ + Revenate CSVs to S3, then triggers `/crm-match` endpoint

## Access
- Self-hosted or cloud instance

## Used By
- [[Guest Personas]] — daily CRM workflow: extract BQ data → upload to S3 → trigger matching
- [[Guest Persona CRM Tagging]] — N8N framework for 4-hotel CRM pipeline setup

## Notes
- n8n BQ webhook fires to invalidate top 8 cache when new behavioral data arrives
- Table configured for 4 initial hotels (Boardwalk Aruba + 3 Evans Hotels)
```

- [ ] **Step 7: Create Auth.js.md**

```markdown
---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# Auth.js

## What It Does
Authentication library for Next.js applications (formerly NextAuth.js).

## How We Use It
- Google OAuth authentication restricted to @triptease.com domain
- Session management for the Automation Hub portal

## Access
- Open source — installed as `next-auth@beta` (v5)

## Used By
- [[Automation Hub]] — Google OAuth login, restricted to Triptease Google Workspace accounts

## Notes
- v5 (beta) — uses `auth.ts` config at project root, not API route
- `AUTH_TRUST_HOST=true` required on Railway
- `checks: ["pkce", "state"]` on Google provider (default nonce check causes errors)
- `signIn` callback must verify `profile.hd === "triptease.com"`
- New users default to SUBMITTER role — promote admins manually via psql
```

- [ ] **Step 8: Create Next.js.md**

```markdown
---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# Next.js

## What It Does
React framework for full-stack web applications with server-side rendering and API routes.

## How We Use It
- Primary framework for internal web portals
- App Router with TypeScript and Tailwind CSS

## Access
- Open source — installed as a dependency

## Used By
- [[Automation Hub]] — Next.js 16, App Router, TypeScript, Tailwind v4, standalone Docker output
- [[Triptease Studio]] — React 18 frontend

## Notes
- Next.js 16 used in Automation Hub (latest)
- `output: "standalone"` required for Docker/Railway builds
- Middleware must use `x-forwarded-host`/`x-forwarded-proto` headers, not `request.url`
- Node 22 forced via Dockerfile (`node:22-alpine`) — Nixpacks can't reliably resolve Node 22
```

---

## Wave 2 — After discovery (depends on Task 3)

### Task 9: Create additional tool notes from Notion/Slack discovery

After Task 3 completes, create tool notes for any newly discovered tools not already covered in Tasks 4-8.

**Files:** TBD based on discovery results — follow the same template from the spec.

- [ ] **Step 1: Review discovery results from `docs/superpowers/plans/notion-slack-discovery.md`**

Read the findings file. Identify tools that don't already have notes (created in Tasks 4-8).

- [ ] **Step 2: Create a tool note for each newly discovered tool**

Follow the exact template from the spec. For each tool:
- Use the appropriate `#tool/CATEGORY` tag
- Fill in "What It Does", "How We Use It" (from Notion/Slack context), "Access", "Used By"
- If a discovered tool is used by one of the known projects, add it to that project's tech stack in Task 10

- [ ] **Step 3: If discovery found no new tools, skip this task**

Log: "Notion/Slack discovery did not reveal tools beyond what was already documented from codebase analysis."

---

## Wave 3 — After all tool notes exist (depends on Tasks 4-9)

### Task 10: Add Tech Stack sections to Triptease project notes

Add a `## Tech Stack` section with wiki-linked tool references to each project note. Most project notes already have a `## Stack` line with plain text — keep that and add the wiki-linked section below or after the existing stack info.

**Files (modify all):**
- `Areas/Triptease/Projects/Guest Personas.md`
- `Areas/Triptease/Projects/Direct Booking Digest.md`
- `Areas/Triptease/Projects/Help Centre Bot.md`
- `Areas/Triptease/Projects/ABM Creator.md`
- `Areas/Triptease/Projects/Automation Hub.md`
- `Areas/Triptease/Projects/Cloudprinter.md`
- `Areas/Triptease/Projects/DBSEvents.md`
- `Areas/Triptease/Projects/HotelGEOChecker.md`
- `Areas/Triptease/Projects/DBS Guest Personas Print Assets.md`
- `Areas/Triptease/Projects/Guest Persona CRM Tagging.md`
- `Areas/Triptease/Projects/Landing Page.md`
- `Areas/Triptease/Projects/AI & Automation Session.md`
- `Areas/Triptease/_context/Triptease Studio.md`

- [ ] **Step 1: Add Tech Stack to Guest Personas.md**

Insert after the existing `## Stack` line (before `## Deployment`):

```markdown
## Tech Stack
- [[Claude API]] — segment generation, JTBD analysis, refinement, CRM matching
- [[Google Gemini]] — infographic image generation
- [[Firecrawl]] — hotel website crawling
- [[Apify]] — Google Maps + Booking.com review scraping
- [[Google BigQuery]] — behavioral reservation data, CRM extraction
- [[AWS S3]] — asset storage, learnings, CRM data, dashboard
- [[Google Sheets]] — historical output export
- [[Google Places API]] — hotel detail lookup by Place ID
- [[Google Custom Search API]] — Booking.com URL discovery
- [[Slack]] — `/guest-segment` command, modals, notifications
- [[Railway]] — hosting (prod + dev)
- [[n8n]] — CRM data flow orchestration
- [[Revenate]] — CRM daily guest matching
- [[GitHub]] — `Triptease-Mktg/GuestPersonas.git`
```

- [ ] **Step 2: Add Tech Stack to Direct Booking Digest.md**

Insert after the existing `## Stack` line (before `## Deployment`):

```markdown
## Tech Stack
- [[Claude API]] — article scoring (0-100) and newsletter copy generation
- [[Slack]] — editorial workflow, article selection modals, approval flow
- [[PostgreSQL]] — articles, published history, blacklist, scoring feedback
- [[Redis]] — modal cache, selections, completion flags
- [[Google Sheets]] — newsletter output export
- [[Railway]] — hosting
- [[GitHub]] — `Triptease-Mktg/DBD-Newsletter-Automation.git`
```

- [ ] **Step 3: Add Tech Stack to Help Centre Bot.md**

Insert after the existing `## Stack` line (before `## Deployment`):

```markdown
## Tech Stack
- [[Claude API]] — content gap detection, article update proposals, sunset verification
- [[Slack]] — bot notifications, review modals, weekly summary
- [[Notion]] — release notes + drafts database reading
- [[Intercom]] — help centre article sync
- [[PostgreSQL]] — content items, articles, evidence, scan state (shared DB with [[Automation Hub]])
- [[Prisma]] — ORM for database access
- [[Railway]] — bot + worker services
- [[GitHub]] — `Triptease-Mktg/help-centre-bot.git`
```

- [ ] **Step 4: Add Tech Stack to ABM Creator.md**

Insert after the existing `## Stack` line (before `## Deployment`):

```markdown
## Tech Stack
- [[Claude API]] — campaign copy generation
- [[Beeswax DSP]] — programmatic advertising, campaign management
- [[HubSpot]] — website segment tagger (footer script)
- [[Slack]] — campaign creation modals, notifications
- [[Railway]] — abm-creator + beeswax-pipeline services
- [[GitHub]] — `Triptease-Mktg/abm-creator.git`
```

- [ ] **Step 5: Add Tech Stack to Automation Hub.md**

Insert after the existing `## Stack` line (before `## Deployment`):

```markdown
## Tech Stack
- [[Claude API]] — AI features in portal
- [[Next.js]] — v16 App Router, TypeScript, standalone Docker
- [[Auth.js]] — v5 Google OAuth (restricted to @triptease.com)
- [[Prisma]] — ORM, schema management, migrations
- [[PostgreSQL]] — shared DB (Postgres-m5QY) with [[Help Centre Bot]]
- [[AWS S3]] — file storage
- [[Slack]] — notifications
- [[Railway]] — hosting
- [[GitHub]] — `Triptease-Mktg/Automation-Dashboard.git`
```

- [ ] **Step 6: Add Tech Stack to Cloudprinter.md**

Insert after `# Cloudprinter` description (before `## Deployment`):

```markdown
## Tech Stack
- [[Netlify]] — static site deployment
```

- [ ] **Step 7: Add Tech Stack to DBSEvents.md**

Insert after the existing `## Stack` line (before `## Deployment`):

```markdown
## Tech Stack
- [[Firecrawl]] — event website crawling
- [[Selenium]] — browser-based scraping
- [[Google Sheets]] — event data storage
```

- [ ] **Step 8: Add Tech Stack to HotelGEOChecker.md**

Insert after the description (before `## Next Steps`):

```markdown
## Tech Stack
- Details TBD — to be integrated into [[Automation Hub]]
```

- [ ] **Step 9: Add Tech Stack to Guest Persona CRM Tagging.md**

Insert after `## Architecture` section (before `## Key People`):

```markdown
## Tech Stack
- [[Google BigQuery]] — daily reservation data extraction
- [[n8n]] — workflow orchestration (BQ → S3 → matching)
- [[Revenate]] — CRM platform (Boardwalk Aruba, Evans Hotels)
- [[AWS S3]] — daily CSV exchange between n8n and matching service
- [[Claude API]] — guest-to-persona matching (Phase 2)
```

- [ ] **Step 10: Skip DBS Guest Personas Print Assets.md**

This is a design/print project, not a software project. No tech stack section needed.

- [ ] **Step 11: Skip Landing Page.md**

Scope not defined yet — no tech stack to document.

- [ ] **Step 12: Skip AI & Automation Session.md**

This is a recurring meeting, not a tech project.

- [ ] **Step 13: Update Triptease Studio.md Tech Stack with wiki links**

The file already has a `## Tech Stack` section. Replace it with wiki-linked version:

Current:
```markdown
## Tech Stack
Claude API (claude-sonnet-4), React 18, Railway hosting
```

Replace with:
```markdown
## Tech Stack
- [[Claude API]] — claude-sonnet-4, brand compliance checking, content generation (style + persona layers)
- [[Railway]] — hosting
```

---

### Task 11: Create Tools Index

**Files:**
- Create: `Areas/Triptease/_context/Tools Index.md`

- [ ] **Step 1: Create Tools Index.md**

Create a compact summary table of all tools. This should be generated AFTER all tool notes exist (including any from discovery in Task 9).

```markdown
---
status: active
tags: [reference]
area: Triptease
created: 2026-04-16
---

# Tools Index

Quick reference for all tools and software used across Triptease.

## AI
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Claude API]] | Guest Personas, DBD, Help Centre, ABM, Hub, Studio | LLM — scoring, generation, analysis |
| [[OpenAI API]] | Personal Bot | Whisper speech-to-text |
| [[Google Gemini]] | Guest Personas | Infographic image generation |

## Infrastructure
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Railway]] | All projects | Primary deployment platform |
| [[AWS S3]] | Guest Personas, Hub | Object storage, dashboards |
| [[PostgreSQL]] | Hub, Help Centre, DBD | Relational database |
| [[Redis]] | DBD | Caching, session data |
| [[Netlify]] | Cloudprinter | Static site hosting |

## Scraping
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Firecrawl]] | Guest Personas, DBSEvents | Website crawling |
| [[Apify]] | Guest Personas | Review scraping (Google Maps, Booking.com) |
| [[Selenium]] | DBSEvents | Browser-based scraping |

## Data
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Google BigQuery]] | Guest Personas, CRM Tagging | Behavioral data warehouse |
| [[Google Sheets]] | DBD, DBSEvents, Guest Personas | Lightweight reporting |
| [[Google Places API]] | Guest Personas | Hotel detail lookup |
| [[Google Custom Search API]] | Guest Personas | Booking.com URL discovery |

## Communication
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Slack]] | DBD, Help Centre, Guest Personas, ABM | Team messaging + automation UI |
| [[Intercom]] | Help Centre | Customer help centre |
| [[Notion]] | Help Centre, org-wide | Documentation, release notes |

## Design
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Figma]] | Product/Design team | UI/UX design, design systems |
| [[Canva]] | Marketing team | Marketing assets, presentations |

## CRM & Marketing
| Tool | Used By | Purpose |
|------|---------|---------|
| [[HubSpot]] | ABM Creator | Website segment tagging |
| [[Revenate]] | Guest Personas, CRM Tagging | Hotel CRM guest matching |
| [[Beeswax DSP]] | ABM Creator | Programmatic advertising |

## Dev
| Tool | Used By | Purpose |
|------|---------|---------|
| [[GitHub]] | All projects | Code hosting, CI/CD trigger |
| [[Prisma]] | Hub, Help Centre | TypeScript ORM |
| [[n8n]] | Guest Personas, CRM Tagging | Workflow automation |
| [[Auth.js]] | Hub | Google OAuth authentication |
| [[Next.js]] | Hub, Studio | React framework |
```

**Note:** If Task 9 (discovery) found additional tools, add rows for them in the appropriate category tables before creating this file.

---

### Task 12: Commit all changes

- [ ] **Step 1: Stage all new and modified files**

```bash
cd ~/Desktop/ClaudeProjects/Obsidian
git add Areas/Triptease/_context/Tools/
git add "Areas/Triptease/_context/Tools Index.md"
git add Areas/Triptease/Projects/
git add "Areas/Triptease/_context/Triptease Studio.md"
git add docs/superpowers/
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: add Tech Stack Knowledge Base with tool notes, bidirectional links, and tools index"
```

- [ ] **Step 3: Handle CLAUDE.md files in other projects**

The CLAUDE.md files for other projects (Beeswax, Ticket System, Help Centre, etc.) live in separate git repos. Each needs to be committed in its own repo:

```bash
# For each project that has its own git repo:
cd ~/Desktop/ClaudeProjects/Beeswax && git add CLAUDE.md && git commit -m "chore: add vault context import to CLAUDE.md"
cd ~/Desktop/ClaudeProjects/Ticket\ System && git add CLAUDE.md && git commit -m "chore: add vault context import to CLAUDE.md"
cd ~/Desktop/ClaudeProjects/Help\ Centre && git add CLAUDE.md && git commit -m "chore: add vault context import to CLAUDE.md"
cd ~/Desktop/ClaudeProjects/DBD && git add CLAUDE.md && git commit -m "chore: add vault context import to CLAUDE.md"
cd ~/Desktop/ClaudeProjects/Claude\ Guest\ Personas && git add CLAUDE.md && git commit -m "chore: add vault context import to CLAUDE.md"
cd ~/Desktop/ClaudeProjects/Cloudprinter && git add CLAUDE.md && git commit -m "chore: add vault context import to CLAUDE.md"
cd ~/Desktop/ClaudeProjects/DBSEvents && git add CLAUDE.md && git commit -m "chore: add vault context import to CLAUDE.md"
cd ~/Desktop/ClaudeProjects/Testing && git add CLAUDE.md && git commit -m "chore: add vault context import to CLAUDE.md"
cd ~/Desktop/ClaudeProjects/abm-creator-deploy && git add CLAUDE.md && git commit -m "chore: add vault context import to CLAUDE.md"
```

Note: Only commit to repos that have git initialized. Check with `git status` first. Don't push unless explicitly asked.

- [ ] **Step 4: Verify all tool notes have correct wiki links**

Quick sanity check: glob for all `.md` files in `Areas/Triptease/_context/Tools/` and verify each one exists and has the correct frontmatter structure.
