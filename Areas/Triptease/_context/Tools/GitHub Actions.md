---
status: active
tags: [tool/dev]
category: Dev
area: Triptease
created: 2026-04-16
---

# GitHub Actions

## What It Does
CI/CD pipeline automation integrated directly into [[GitHub]] repositories.

## How We Use It
- Primary CI/CD tool for build, test, and deploy pipelines across all engineering squads
- Automates testing on every PR and deployment on merge to main

## Access
- Accessed via [[GitHub]] repository settings (no separate dashboard)

## Used By
- Engineering — all squads use GitHub Actions for CI/CD pipelines

## Notes
- Org-wide primary CI/CD tool
- Runs within [[GitHub]] — no separate account or dashboard needed
- Workflows defined as YAML files in `.github/workflows/` in each repo
