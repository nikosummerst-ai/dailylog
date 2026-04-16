---
status: active
tags: [tool/data]
category: Data
area: Triptease
created: 2026-04-16
---

# Google Places API

## What It Does
Google API for looking up business details, ratings, and location data by Place ID.

## How We Use It
- First step in the Guest Personas pipeline: look up hotel details from a Google Place ID

## Access
- Console: https://console.cloud.google.com/apis

## Used By
- [[Guest Personas]] — pipeline step 1: get hotel name, address, rating, and details from Place ID

## Notes
- Cost tracked on Guest Personas dashboard
- Pipeline input is always a Google Place ID (format: ChIJxxxx...)
