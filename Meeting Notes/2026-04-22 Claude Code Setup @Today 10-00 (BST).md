---
date: 2026-04-22
tags: [meeting]
attendees: [Niko Summers, Curtis Hurd-McFarlane]
---
# Claude Code Setup

## Attendees
- [[Niko Summers]], [[Curtis Hurd-McFarlane]]

## Key Decisions
- Switched default model to Opus 4.7 for most capable performance
- Disabled auto-compact to prevent context degradation (~70% context lost per compaction cycle)
- Configured sub-agent first policy for tasks involving 2+ files
- Installed core skills: Find Skills, Resume, Session Handoff, Triptease Style

## Discussion
Onboarding session for [[Curtis Hurd-McFarlane]] (Associate Go-to-Market Automation Manager) to the Triptease Claude Code environment. Curtis came with prior Claude Code, Make, and Vapi experience from running a voice AI agency and had completed most Triptease onboarding the day before.

**Development Environment:** Installed Homebrew, VS Code, Claude Code extension, Python, GitHub, and Node.js via setup scripts. Configured Claude CLI in terminal, set up GitHub organisation access for Triptease repos, and created a Claude Projects folder structure (each project gets its own subfolder; open in VS Code with File > Open Folder).

**Skills and Plugins:** Core skills installed — Find Skills, Resume, Session Handoff, Triptease Style — plus Superpowers (HTML design), Context 7 (latest API docs), and Playwright (browser automation). Skills are global across all projects. Recommended keeping skill token overhead under 5,000. The `/plugin` command browses and installs additional capabilities; Find Skills skill auto-suggests relevant ones per task.

**Context Management:** Auto-compact disabled because repeated compacting loses ~70% of context over time ("context rot"). Session Handoff skill saves a full chat summary to project files; Resume skill loads it to continue without context loss. Recommended doing a handoff at 150–200K tokens (Opus 4.7 has a 1M context window). Status bar installed to monitor context usage in terminal.

**Claude Modes:** Plan mode (Shift+Tab) for initial project planning — context is cleared after the planning phase. Auto mode bypasses permission prompts for a smoother workflow. Accept Edits mode enables automatic code acceptance. Model changed with `/model` command.

**Sub-Agents:** Separate Claude instances that handle specific tasks without consuming the main chat context. Sub-agent first policy auto-spawns agents for tasks involving 2+ files; parallel sub-agents can handle multiple tasks simultaneously for complex projects.

**Interface Options:** Terminal/CLI in VS Code has the most up-to-date features and the custom context bar. Desktop app has a cleaner UI with usage percentage indicator but more permission restrictions and may lack the newest features. VS Code extension is a middle-ground option. All interfaces share the same skills and configuration.

**Triptease Tools and Documentation:** Triptease Style skill provides brand voice, tone guidelines, and newsletter templates for marketing copy. All AI automation projects are documented in Notion under Marketing > Marketing Custom AI and Automation Tools, including project descriptions, tech stack, and invocation instructions. Notion extension can auto-create project documentation. Weekly AI automation sessions run every Thursday at 10am.

## Action Items
- [ ] [[Curtis Hurd-McFarlane]]: Install Claude desktop app
- [ ] [[Curtis Hurd-McFarlane]]: Familiarise with Claude Code setup and all installed tools
- [ ] [[Curtis Hurd-McFarlane]]: Add new automation projects to the Notion AI automation tools page when working on them
- [ ] [[Niko Summers]]: Send [[Curtis Hurd-McFarlane]] a prompt for setting up global permissions
- [ ] [[Curtis Hurd-McFarlane]]: Meet with [[Peter Yabsley]] to define initial projects to tackle
- [ ] [[Niko Summers]] + [[Curtis Hurd-McFarlane]]: Schedule follow-up session next week covering .gitignore, .claudeignore, and remaining setup items

## Related Projects
[[Automation Hub]]
