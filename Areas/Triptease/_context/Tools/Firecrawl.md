---
status: active
tags: [tool/scraping]
category: Scraping
area: Triptease
created: 2026-04-16
---

# Firecrawl

## What It Does
Web crawling and scraping API that extracts clean, structured content from websites.

## How We Use It
- Hotel website crawling for guest persona analysis in [[Guest Personas]]
- Event website scraping in [[DBSEvents]]

## Access
- Dashboard: https://firecrawl.dev

## Used By
- [[Guest Personas]] — crawls hotel websites to extract content for persona generation (pipeline step 4)
- [[DBSEvents]] — crawls hospitality event websites for event data

## Notes
- Part of the Guest Personas pipeline: Google Places → Booking.com URL → Apify reviews → Firecrawl website → Claude analysis
- Cost tracked on Guest Personas dashboard
- Alternative to Selenium for JavaScript-rendered pages
