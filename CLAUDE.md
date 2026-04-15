# Obsidian Vault — Niko's Second Brain

## Who I Am
Niko Summers — AI & Automation Specialist at Triptease (London).
I build marketing automations, AI-powered tools, and content systems for the hospitality industry.

## Vault Structure
- `Areas/` — Business areas and personal. Each has `_context/` (canonical docs), `Projects/`, `Content/`, `Notes/`
  - `Areas/Triptease/` — All Triptease work
  - `Areas/Personal/` — Personal projects and notes
- `Daily logs/` — One note per day + pinned Backlog
- `Meeting Notes/` — Meeting transcripts and summaries
- `Notes/` — Evergreen reference notes (SOPs, research, ideas)
- `_System/` — Templates and attachments (don't modify)

## The _context/ Pattern
Each area's `_context/` folder holds canonical docs about that business/domain.
These are the single source of truth. When something changes, update the file in `_context/` — every agent and project that references it gets the update automatically.

## Note Conventions
- Frontmatter: `status` (active/paused/done), `tags`, `area`, `date`/`created`
- Use [[wikilinks]] for internal connections
- Tags: lowercase, hyphenated (#project, #meeting, #automation)
- Tasks: `- [ ]` open, `- [x]` done
- Daily notes: `YYYY-MM-DD.md` in `Daily logs/`

## What Claude Can Do
- Create and edit notes following the conventions above
- Search the vault for relevant context before asking me
- Link related notes with [[wikilinks]]
- Extract tasks from daily notes into project files
- Generate summaries from daily notes
- Research topics and save to Notes/ or the relevant Area's Notes/

## What Claude Should NOT Do
- Never delete notes — move to an Archive/ folder instead
- Never change a note's filename without asking
- Never modify files in `_System/Templates/`
- Don't create files in `_System/attachments/`
- Don't edit raw meeting transcripts — add notes below them
