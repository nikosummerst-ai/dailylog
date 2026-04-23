---
status: active
tags: [tool/dev, tool/ai]
category: Dev
area: Triptease
created: 2026-04-20
---

# Cursor

## What It Does
AI-first code editor (VS Code fork) with built-in agent mode, inline code generation, and multi-file edits. Supports Claude, GPT, and Gemini models.

## How We Use It
- Primary local IDE for [[GitHub]]-hosted automation projects
- Agent mode for multi-file refactors and feature builds
- Inline chat for quick edits, explanations, and debugging

## Access
- App: https://cursor.com (download desktop app)
- Sign-in via Google SSO

## Used By
- GTM / Niko — all local development on automation projects (Guest Personas, DBD, Help Centre, ABM, Hub)
- Anyone writing code locally outside [[Replit]] / [[Bolt]]

## Notes
- Paired with [[Claude API]] (via API key or Cursor subscription) for the underlying model
- Good alternative to Claude Code when a GUI editor is preferred over a terminal-based workflow
- Settings and keybindings are VS Code compatible
