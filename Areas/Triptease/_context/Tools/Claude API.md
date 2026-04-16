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
