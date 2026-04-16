---
status: active
tags: [reference]
area: Triptease
created: 2026-04-16
---

# Tools Index

Quick reference for all tools and software used across Triptease. See individual tool notes in [[Tools/]] for details.

## AI
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Claude API]] | Guest Personas, DBD, Help Centre, ABM, Hub, Studio | LLM — scoring, generation, analysis |
| [[OpenAI API]] | Personal Bot | Whisper speech-to-text |
| [[Google Gemini]] | Guest Personas | Infographic image generation |

## Infrastructure & Security
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Railway]] | All automation projects | Primary deployment platform |
| [[AWS S3]] | Guest Personas, Hub | Object storage, dashboards |
| [[PostgreSQL]] | Hub, Help Centre, DBD | Relational database (Railway) |
| [[Redis]] | DBD | Caching, session data |
| [[Netlify]] | Cloudprinter | Static site hosting |
| [[Google Cloud Platform]] | Engineering (platform) | Cloud Run, Kubernetes, IAM |
| [[Cloudflare]] | Engineering | CDN, Workers, Pages, DNS |
| [[Fastly]] | Engineering | CDN for app.triptease.io |
| [[Vercel]] | Engineering, Sales tools | Web app deployment |
| [[Stripe]] | Finance, Events | Payment processing |
| [[1Password]] | Org-wide | Password/credential management |
| [[Clerk]] | Engineering (platform) | Authentication, SSO, roles |
| [[Datadog]] | Engineering | Monitoring, logging, alerting |
| [[Aikido Security]] | Engineering (trial) | Supply chain security |

## Data & Analytics
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Google BigQuery]] | Guest Personas, CRM Tagging | Behavioral data warehouse |
| [[Google Sheets]] | DBD, DBSEvents, Guest Personas | Lightweight reporting |
| [[Google Places API]] | Guest Personas | Hotel detail lookup |
| [[Google Custom Search API]] | Guest Personas | Booking.com URL discovery |
| [[Google Analytics]] | Product, CS, hotel clients | Website analytics (GA4) |
| [[Google Tag Manager]] | PIMs, integrations | Client-side tag management |
| [[Looker]] | Product, CS, Engineering, Sales | BI dashboards |
| [[Looker Studio]] | CS, Sales, GTM | Client-facing reporting |
| [[Fullstory]] | Product Management | Session recording, UX analytics |
| [[Mixpanel]] | Product Management | Product analytics |
| [[Airtable]] | GTM, Sales | No-code database, reporting trials |

## Scraping
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Firecrawl]] | Guest Personas, DBSEvents | Website crawling API |
| [[Apify]] | Guest Personas | Review scraping (Google, Booking) |
| [[Selenium]] | DBSEvents | Browser-based scraping |
| [[Thunderbit]] | GTM | Lightweight web scraping |

## Communication
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Slack]] | All projects | Team messaging + automation UI |
| [[Intercom]] | Help Centre | Customer support platform |
| [[Notion]] | Help Centre, org-wide | Documentation, wiki, release notes |
| [[Mailchimp]] | Product (email), CS | Hotel email campaigns |
| [[Gong]] | CS, Sales | Call recording + intelligence |

## Design
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Figma]] | Product, Design, Niko | UI/UX design, design systems |
| [[Canva]] | Marketing | Marketing assets, presentations |
| [[Webflow]] | Marketing | Company website, event pages |
| [[Venngage]] | Marketing | Presentation design |

## CRM & Sales
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Salesforce]] | Sales, CS, RevOps | Primary CRM |
| [[HubSpot]] | ABM Creator, Marketing | Segment tagging, email |
| [[Revenate]] | Guest Personas, CRM Tagging | Hotel CRM guest matching |
| [[Beeswax DSP]] | ABM Creator | Programmatic advertising |
| [[Clay]] | Sales, RevOps | Sales intelligence, enrichment |
| [[LinkedIn Sales Navigator]] | Sales | Prospecting, contact search |
| [[Vitally]] | CS | Customer success platform |
| [[Canny]] | Product, CS | Product feedback voting |

## Project Management
| Tool | Used By | Purpose |
|------|---------|---------|
| [[Linear]] | Org-wide | Issue tracking (replaced Jira) |
| [[Workable]] | People team | Recruitment / ATS |

## Dev & Automation
| Tool | Used By | Purpose |
|------|---------|---------|
| [[GitHub]] | All projects | Code hosting, version control |
| [[GitHub Actions]] | Engineering | CI/CD pipelines |
| [[Prisma]] | Hub, Help Centre | TypeScript ORM |
| [[n8n]] | Guest Personas, CRM Tagging | Workflow automation |
| [[Auth.js]] | Hub | Google OAuth authentication |
| [[Next.js]] | Hub, Studio | React framework |
| [[Gumloop]] | GTM, CS, Sales | No-code workflow automation |
| [[Zapier]] | CS, RevOps | Workflow automation |
| [[Terraform]] | Engineering | Infrastructure as Code |
| [[Axe DevTools]] | Engineering | Accessibility testing |
| [[Replit]] | GTM | AI vibe coding |
| [[Bolt]] | GTM | AI app building |
