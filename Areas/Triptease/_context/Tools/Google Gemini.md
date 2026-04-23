---
status: active
tags: [tool/ai]
category: AI
area: Triptease
created: 2026-04-16
---

# Google Gemini

## What It Does
Google's multimodal AI — available as a consumer app, a developer API (via Google AI Studio), and integrated across Google Workspace (Docs, Sheets, Gmail, Slides).

## How We Use It
- Consumer app (gemini.google.com) — general-purpose chat, research, long-context document analysis, Deep Research
- Workspace integration — in-line AI in Docs/Sheets/Gmail via Google Workspace licence
- API (AI Studio) — image and infographic generation in automation pipelines

## Access
- Consumer app: https://gemini.google.com (Google SSO)
- API console: https://aistudio.google.com
- Workspace features: enabled per user via Google Workspace admin

## Used By
- GTM / Niko — daily-driver AI assistant alongside [[Claude API]] and [[ChatGPT]]
- [[Guest Personas]] — generates infographic images for persona reports (auto-approved, triggers PDF generation)

## Notes
- Strong at long-context tasks (1M+ token window) and Google Workspace integration
- API specifically chosen for image generation in the Guest Personas pipeline (step 8)
- Expect 3-5+ iterations for image generation tasks
