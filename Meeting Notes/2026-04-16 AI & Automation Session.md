---
date: 2026-04-16
tags: [meeting]
attendees: [Niko Summers, Valentina Goldie, Tobias Gunkel]
---
# AI & Automation Session — 16 Apr (10:00 BST)

## Attendees
- [[Niko Summers]], [[Valentina Goldie]], [[Tobias Gunkel]], and others

## Key Decisions
- Next session will focus on DBS automation needs
- Calendar meeting title to be updated to reflect DBS focus
- Use ChatGPT for chat and Claude for coding to conserve Claude tokens
- Code modularisation recommended to reduce Claude context consumption

## Discussion
Session kicked off with positive news from the Navigate event — Guest Personas flyers and roll-up were well-received. The 1,500 Euro investment was deemed worthwhile, though flyers missed the welcome packs and were instead placed on tables at the general session.

**Claude AI credit issues**: Multiple team members experiencing slowness (e.g. updates taking 17 minutes). Likely related to an upcoming Claude model release — Anthropic typically throttles existing models 2 weeks before a new version ships. Valentina identified reading preview HTML files as the main token consumer due to file size.

**Obsidian demo**: Niko demonstrated his Obsidian knowledge management setup as an alternative to Apple Notes for AI-enhanced project management. The system auto-ingests meeting notes so Claude has full historical context without manual explanation. Includes project docs, GitHub links, Railway production details. Daily briefing pulls from Notion, Slack, Google Calendar, and Gmail. Still experimental — Niko has been using it about a week.

**Claude desktop app**: A major update was released in the last 24 hours with terminal access and HTML preview built in. Context window usage is now visible with a token breakdown. Unclear if it's better than VS Code — Niko to test and report back.

**DBS event planning**: Primary automation need is transcription for key learnings and post-event content. Translation for Mexican attendees is required. Rosie AI ($6,000 USD) is out of budget — exploring Google Translate API and OpenAI Whisper as alternatives.

## Action Items
- [ ] Niko: Share Obsidian setup documentation with [[Valentina Goldie]]
- [ ] Niko: Test new Claude desktop app and report back on whether it's better than VS Code
- [ ] Niko: Research translation tools for [[DBS Event]] (Google Translate API, OpenAI Whisper)
- [ ] [[Valentina Goldie]]: Optimise prompt usage by reducing frequency of preview HTML reads
- [ ] [[Valentina Goldie]]: Consider modularising HTML files to reduce context consumption
- [ ] [[Valentina Goldie]]: Message Tobes about Claude credits
- [ ] Team: Focus next session on DBS automation needs
- [ ] Team: Update calendar meeting title to reflect DBS focus

## Related Projects
[[DBS Event]] · [[Guest Personas]] · [[Triptease Studio]]