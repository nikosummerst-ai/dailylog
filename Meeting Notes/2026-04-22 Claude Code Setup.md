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
- Disabled auto-compact to prevent context degradation
- Configured sub-agent first policy for tasks involving 2+ files
- All interfaces (terminal, desktop, VS Code extension) share the same skills and configuration

## Discussion
Onboarding session for [[Curtis Hurd-McFarlane]] (Associate Go-to-Market Automation Manager) on Claude Code CLI and tooling at Triptease. Curtis completed onboarding videos and set up most accounts the previous day; has prior experience with Claude Code, Make, and Vapi from running a voice AI agency.

**Development environment:** Installed Homebrew, VS Code with Claude Code extension, Python, GitHub CLI, and Node.js via setup scripts. Set up GitHub organisation access for Triptease repositories. Configured Claude CLI in terminal and created Claude Projects folder structure.

**Skills installed:** Find Skills, Resume, Session Handoff, Triptease Style, Superpowers (HTML design), Context 7 (latest API docs), Playwright (browser automation and UI testing). Skills are global across all projects; recommended keeping total skill overhead under 5,000 tokens.

**Context management:** Auto-compact disabled — repeated compacting causes ~70% context loss over time ("context rot"). Session Handoff skill saves a full chat summary to project files; Resume skill loads that handoff to continue without loss. Recommended triggering a handoff at 150–200K tokens (Opus 4.7 with 1M context window). Status bar installed to monitor context usage in terminal.

**Claude modes:** Plan mode (Shift+Tab) for initial project planning — clears context after planning phase. Auto mode bypasses permission prompts. Accept edits mode for automatic code acceptance.

**Sub-agents:** Separate instances handling specific tasks without consuming main chat context. Configured sub-agent-first policy — automatically spawns sub-agents for tasks involving 2+ files. Parallel sub-agents can handle multiple tasks simultaneously on complex projects.

**Interface options:** Terminal/CLI in VS Code has the most up-to-date features and custom context bar. Desktop app has cleaner UI with usage percentage indicator but more permission restrictions and may lack newest features. VS Code Claude extension is a middle-ground option. All share the same skills and config.

**Triptease tools:** Triptease Style skill provides brand voice, tone guidelines, and newsletter templates. All AI automation projects documented in Notion under Marketing > Marketing Custom AI and Automation Tools — includes project descriptions, tech stack, and invocation instructions. Weekly AI automation sessions run every Thursday at 10am.

## Action Items
- [ ] [[Curtis Hurd-McFarlane]]: Install Claude desktop app
- [ ] [[Curtis Hurd-McFarlane]]: Familiarise with the Claude Code setup and installed tools
- [ ] [[Curtis Hurd-McFarlane]]: Add new automation projects to the Notion AI automation tools page when working on them
- [ ] [[Niko Summers]]: Send Curtis a prompt for setting up global permissions
- [ ] [[Curtis Hurd-McFarlane]]: Meet with Pete about defining initial projects to tackle
- [ ] Schedule follow-up session next week to cover .gitignore, .claudeignore, and remaining setup items

## Related Projects
[[Automation Hub]]