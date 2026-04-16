---
status: active
tags: [tool/infrastructure]
category: Infrastructure
area: Triptease
created: 2026-04-16
---

# Cloudflare

## What It Does
CDN, serverless compute (Workers), frontend hosting (Pages), and DNS management platform.

## How We Use It
- Engineering uses Cloudflare Pages for frontend hosting (e.g., budgets editor)
- Cloudflare Workers for serverless edge compute
- DNS management for Triptease domains
- MCP server experimentation for Claude integrations

## Access
- Dashboard: https://dash.cloudflare.com (Triptease account)

## Used By
- Engineering — Tamarin squad uses Cloudflare Pages for the budgets editor
- Engineering — DNS and CDN management

## Notes
- Tamarin squad hosts the budgets editor on Cloudflare Pages
- Engineering exploring migration of CDN workloads from [[Fastly]] to Cloudflare
- MCP server experimentation underway for Claude Code integrations
