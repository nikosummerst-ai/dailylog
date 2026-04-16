# Vault Router Redesign — Design Spec

## Overview

Replace the heavy `@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md` import in every project's CLAUDE.md with a token-efficient "thin vault router" block. The router tells Claude the vault exists, where to find things, and when to proactively search — without loading any vault content into context.

## Problem

The current `@import` loads the full vault CLAUDE.md (~3000+ tokens) into every project session on every turn. Research shows CLAUDE.md should be under 200 lines and act as a router, not a database. Most sessions don't need cross-project or vault context, yet every session pays the token cost.

## Goals

1. **Reduce token overhead** — from ~3000+ tokens to ~300-500 per project session
2. **Preserve discoverability** — Claude still knows the vault exists and proactively searches when relevant
3. **Automation Hub exception** — the central dashboard keeps richer cross-project awareness
4. **Auto-apply to new projects** — hook ensures new CLAUDE.md files get the router automatically

---

## 1. Thin Vault Router Block

Replaces `@~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md` in all project CLAUDE.md files (except Automation Hub).

```markdown
# Vault Context
# Niko's Obsidian vault at ~/Desktop/ClaudeProjects/Obsidian is the single source of truth
# for all project context, tools, brand info, and org knowledge.
# DO NOT read vault files unless the task requires it. Use QMD for search.
#
# Key paths:
# - Tools: Areas/Triptease/_context/Tools/ (63 tool notes)
# - Tools Index: Areas/Triptease/_context/Tools Index.md
# - Projects: Areas/Triptease/Projects/ (12 project notes with Tech Stack + CLAUDE.md paths)
# - Brand: Areas/Triptease/_context/Brand Voice and Style Guide.md
# - Product: Areas/Triptease/_context/Product Reference.md
# - Automation Stack: Areas/Triptease/_context/Automation Stack.md
#
# When to check the vault (do this proactively, don't wait to be asked):
# - Planning a new feature/automation → read Tools Index for available tools
# - Starting a new project → read Areas/Triptease/Projects/ for similar patterns
# - Choosing a tech stack → read relevant tool notes for how we already use them
# - Writing content for Triptease → read Brand Voice and Style Guide
#
# Search: Use QMD MCP (query tool) for concept search, or read files directly by path.
# Each project note has a ## Project Intelligence section with CLAUDE.md paths for deep dives.
```

**Placement:** First lines of the CLAUDE.md, before any existing content (same position as the current @import).

---

## 2. Automation Hub Rich Router

The Ticket System project gets a richer block with a compact project index.

```markdown
# Vault Context
# Niko's Obsidian vault at ~/Desktop/ClaudeProjects/Obsidian is the single source of truth.
# Search: Use QMD MCP for concept search, or read files directly by path.
#
# Automation Projects (this dashboard manages all of these):
# - Guest Personas (active, high) — ~/Desktop/ClaudeProjects/Claude Guest Personas/CLAUDE.md
# - Direct Booking Digest (active) — ~/Desktop/ClaudeProjects/DBD/CLAUDE.md
# - Help Centre Bot (paused) — ~/Desktop/ClaudeProjects/Help Centre/CLAUDE.md
# - ABM Creator (active, urgent) — ~/Desktop/ClaudeProjects/Beeswax/CLAUDE.md
# - Cloudprinter (active) — ~/Desktop/ClaudeProjects/Cloudprinter/CLAUDE.md
# - DBSEvents (active) — ~/Desktop/ClaudeProjects/DBSEvents/CLAUDE.md
# - HotelGEOChecker (active, low) — no separate codebase
# - Guest Persona CRM Tagging (active, high) — within Guest Personas
#
# Key vault paths:
# - Tools Index: Areas/Triptease/_context/Tools Index.md
# - Projects: Areas/Triptease/Projects/ (full notes with Tech Stack sections)
# - Brand/Product: Areas/Triptease/_context/
#
# When to check the vault (do this proactively, don't wait to be asked):
# - Planning a new feature/automation → read Tools Index for available tools
# - Starting a new project → read Areas/Triptease/Projects/ for similar patterns
# - Choosing a tech stack → read relevant tool notes for how we already use them
# - Referencing another automation → read its CLAUDE.md path listed above
# - Writing content for Triptease → read Brand Voice and Style Guide
#
# Search: Use QMD MCP (query tool) for concept search, or read files directly by path.
```

---

## 3. Hook Update

Update `~/.claude/hooks/ensure-vault-import.sh` to:
- Prepend the thin vault router block (not the @import line) to new CLAUDE.md files
- Detect if the file is the Automation Hub's CLAUDE.md (path contains "Ticket System") and use the rich router instead
- Skip the vault's own CLAUDE.md (existing behavior)
- Skip if the router block is already present (check for "# Vault Context" on first line)

---

## 4. Files to Modify

### Remove @import, add thin router (9 files):
1. `/Users/nikosummers/Desktop/ClaudeProjects/Beeswax/CLAUDE.md`
2. `/Users/nikosummers/Desktop/ClaudeProjects/Help Centre/CLAUDE.md`
3. `/Users/nikosummers/Desktop/ClaudeProjects/DBD/CLAUDE.md`
4. `/Users/nikosummers/Desktop/ClaudeProjects/Claude Guest Personas/CLAUDE.md`
5. `/Users/nikosummers/Desktop/ClaudeProjects/Obsidian/_System/personal-bot/CLAUDE.md`
6. `/Users/nikosummers/Desktop/ClaudeProjects/Cloudprinter/CLAUDE.md`
7. `/Users/nikosummers/Desktop/ClaudeProjects/DBSEvents/CLAUDE.md`
8. `/Users/nikosummers/Desktop/ClaudeProjects/Testing/CLAUDE.md`
9. `/Users/nikosummers/Desktop/ClaudeProjects/abm-creator-deploy/CLAUDE.md`

### Remove @import, add rich router (1 file):
10. `/Users/nikosummers/Desktop/ClaudeProjects/Ticket System/CLAUDE.md`

### Update hook script (1 file):
11. `~/.claude/hooks/ensure-vault-import.sh`

### QMD reindex (command):
12. `qmd update && qmd embed`

---

## 5. What Stays Unchanged

- All 63 tool notes in `Areas/Triptease/_context/Tools/`
- Tools Index at `Areas/Triptease/_context/Tools Index.md`
- All project notes with Tech Stack + Project Intelligence sections
- Vault CLAUDE.md (`~/Desktop/ClaudeProjects/Obsidian/CLAUDE.md`)
- Global `~/.claude/CLAUDE.md`
- `~/.claude/rules/obsidian.md`
- settings.json hook configuration (same trigger, just updated script content)

## Non-Goals

- Restructuring the vault folder hierarchy
- Changing the global CLAUDE.md or rules files
- Modifying tool notes or project notes
- Changing QMD configuration
