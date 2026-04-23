---
tags: [ai, automation, reference]
created: 2026-04-23
updated: 2026-04-23
---

# AI Releases Bank

Running log of every AI / tool release already announced to Niko by the `AI Releases - Real Time` trigger (`trig_01PCu1hLcSMAu8T7mQwbMTU7`). The trigger reads this file on each run and skips anything already listed, so we don't see the same release twice.

## Format

One entry per line:

```
- YYYY-MM-DD | Company/Tool | Short release tag (e.g. "GPT-5.1 launch", "Figma Sites beta")
```

Keep entries terse — the company/tool + release tag is the dedupe key. Normalise tool names (strip version punctuation: "GPT 5.1" → "GPT-5.1", "Claude Opus 4.7" → "Claude-Opus-4.7") so near-matches still dedupe.

## Entries

<!-- Trigger appends below this line. Do not delete the marker. -->
<!-- BANK-ENTRIES-START -->
- 2026-04-23 | OpenAI | ChatGPT for Clinicians launch
- 2026-04-23 | Beehiiv | Creator tools webinars paywalls launch
<!-- BANK-ENTRIES-END -->
