---
type: context
last-updated: 2026-04-15
source: Triptease_Product_Reference_v3.md
---

# Product Reference

Canonical reference for Triptease company overview, products, integrations, competitive positioning, and commercial models. Originally built as an LLM knowledge base; maintained here as the Obsidian vault's single source of truth.

---

## 1. Company Overview

Triptease is a hospitality technology company that provides a **data-driven, multi-channel direct booking platform** for hotels and accommodation providers worldwide. The company's core mission is to help hotels increase direct bookings, reduce dependency on Online Travel Agencies (OTAs), and lower guest acquisition costs.

Triptease has been operating for over **10 years** and currently partners with **30,000 hotel properties** (**15,000+ clients**). Its customer base ranges from very small independent inns (as few as 12 rooms) to major global brands with thousands of rooms across their portfolio.

### Notable Clients

A comprehensive and up-to-date list of published customer case studies can be found on the [Triptease Customer Stories page](https://www.triptease.com/customer-stories).

Some publicly referenced customers include:

- **Major Brands and Chains:** Motel One, Deutsche Hospitality, Best Western Great Britain, Warwick Hotels and Resorts, Macdonald Hotels and Resorts, Ramada Encore, Frasers Hospitality, Archipelago International, Auberge Resorts Collection
- **Regional and Independent Groups:** Evans Hotels, Royal Group Hotels and Resorts, SunStream Hotels and Resorts, Saltwater Hotels and Resorts, New Orleans Hotel Collection, Luxury Family Hotels, Keahotels, Classik Hotel Collection, Kingston Hotels Group
- **Landmark and Luxury Properties:** Rio Hotel and Casino (Las Vegas), The Brown Hotel (Louisville), Baur au Lac (Zurich), The Palms Hotel and Spa (Miami), One King West (Toronto), Carlton Hotel (Singapore), Alcron Hotel (Prague), Hotel Interlaken (Switzerland)
- **Boutique and Unique Stays:** The Inn at Christmas Place, Dr. Wilkinson's Resort, Dream Inn (Santa Cruz), Yays Concierged Boutique Apartments, The Discovery Leisure Company
- **Hostels and Alternative Accommodation:** HI USA (Hostelling International), GCP Hospitality / Haka House, Lub d

### Regional Coverage and Team Structure

Triptease operates globally with teams organized by region and property size:

- **North America and Caribbean**
- **Latin America (LatAm) and South America**
- **EMEA**
- **Middle East**
- **Asia-Pacific**
- **Oceania**

### Office Locations

- **London (HQ):** 75 Bermondsey Street, London SE1 3XF, United Kingdom
- **Barcelona:** Monday Pau Claris, C/ de Pau Claris 79, L'Eixample, 08010
- **New York:** 151 East 80th, Suite 5a, 10075
- **Singapore:** 7500A Beach Road #04-326 The Plaza, 199591

---

## 2. The Triptease Platform

### 2.1 Data Marketing Platform (Back-End)

All Triptease products sit on top of the **Triptease Data Marketing Platform**, which serves as the central hub for data collection, reporting, and campaign management. The platform aggregates three types of intelligence fed into a central algorithm that makes **millions of automated decisions** across all media channels:

**Audience Intelligence** tracks where guests come from (geolocation by country and city), what device they use (mobile vs. desktop), how long they stay on the website, which parts of the site they click on, their party composition (solo, couple, family, group), and their lead time before booking. Guest segments can be targeted by interest type (e.g. spa, wellness, luxury, golf, events, dining).

**Demand Intelligence** reveals when guests are searching, what dates they are searching for, how many searches occur per specific date (not just impression share), when they are booking, and critically when they are searching but *not* booking, identifying conversion gaps. The platform provides heat maps of search activity, conversion rate by day, bookers per day, and nightly price per day.

**Pricing Intelligence (Parity Monitoring)** scrapes OTA pricing data to show when and by how much OTAs are undercutting the hotel's direct rate. This monitoring is available even if the hotel only contracts a single Triptease channel. The platform reveals which specific OTA is undercutting, on which dates, by how much, and how many searches were affected. Data can be viewed in table, calendar, or chart format, and exported to Excel.

### 2.2 Tracking and Attribution

**Script Placement:** Triptease installs a tracking script on the hotel's booking engine (not the main website). The script sits inside the hotel's **Google Tag Manager (GTM)**, which does not require cookie consent to be loaded.

**Cookie Consent Handling:** For the approximately 20% of visitors who do not consent to cookies (in GDPR-compliant markets), Triptease assigns a **session-based anonymous ID** that persists for 30 days as long as the visitor uses the same device and IP. Once first-party data (e.g., email) is captured during the booking journey, that email is associated with the anonymous ID, enabling ongoing tracking.

**Attribution Models:** Triptease supports multiple attribution models:
- **Last-click attribution**
- **30-day attribution window** (standard agency model)
- **Booking journey attribution** (Triptease's unique model): tracks every interaction a guest had across all channels leading to a booking, showing the exact cost to acquire that booking. Unlike GA4's percentage-based estimates, Triptease provides nominal/exact figures.

**Industry context:** On average, there are approximately **71 touchpoints** before a hotel booking is completed.

### 2.3 Unified Reporting Dashboard

Hotels get access to a comprehensive reporting dashboard that provides:

- Full-funnel conversion visibility: website sessions to booking engine searches to bookings
- Revenue generated per channel and across all channels combined
- Percentage of website direct revenue attributed to each channel (benchmark: meta should be ~9-10% of total website revenue)
- Booking engine conversion rate (CVR)
- Click and impression data by metasearch platform (Google, TripAdvisor, Kayak, etc.)
- Cross-channel campaign reporting with **[[Booking Journey Visualization]]**: showing each booking's full path across channels with associated costs
- Parity monitoring reports with OTA-by-OTA undercut detail
- Guest insights by check-in date, segment, geography, and device
- All data exportable to Excel
- **Booking reconciliation tool** for commission model clients

---

## 3. Products and Channels

Triptease offers its products both individually (a la carte) and as bundled packages. Hotels do not need to contract the full platform: they can start with a single channel and expand later. All channels report into the same unified platform.

### 3.1 Triptease Metasearch

Lists the hotel's direct booking link across Google Hotel Ads, TripAdvisor, Kayak, Trivago, and other metasearch engines, positioning the hotel's direct rate alongside OTA listings in search results. Triptease manages both **sponsored (paid) links** and **free booking links** on the hotel's behalf.

**Intelligent Bidding Automation:** Triptease uses a proprietary deep learning algorithm (built over 10+ years of machine learning) that makes over **80 million bid adjustments per day** across its portfolio, translating to approximately **30,000+ decisions per day per hotel**, based on **9 factors:**

1. Guest origin/location (country + city)
2. Booking window / lead time
3. Device type (mobile vs. desktop)
4. Day of week and seasonality
5. Parity status (are you the cheapest?)
6. On-site behavioral signals (time on site, pages viewed, return visitor)
7. Occupancy data (via RMS integration)
8. Historical conversion patterns
9. CRM data: to determine if guest is a returning customer who doesn't need aggressive bidding

**Critical technical note:** Triptease does **not** use Google Performance Max (PMax) for Travel Goals. It has tested PMax and found lower ROAS results compared to its own proprietary bidding algorithm. This is a key differentiator.

**Parity-Based Bidding:** If the hotel does not have the best price (i.e., an OTA is undercutting), Triptease will either lower bids or move the hotel to free links only, ensuring ad spend is not wasted. This is called **parity blackout**.

**Need-Date / Occupancy-Based Bidding (Date Boost):** Through integrations with Revenue Management Systems (Flyr/Pace, Duetto, and others), Triptease can automatically increase bidding on dates where forecasted occupancy is low. Hotels can also manually set target dates for boosted bidding.

**Metasearch Price Match:** A unique differentiating feature. When an OTA is undercutting the hotel's direct price, Triptease can automatically display a matched (or slightly lower) rate on the metasearch listing. The hotel creates promo codes at incremental discount levels; Triptease applies the minimum discount required to beat the OTA price. The rate adjustment applies **only on metasearch**, not on the hotel's website for direct visitors. If the OTA undercut exceeds the hotel's threshold, Triptease stops bidding entirely (parity blackout). This feature operates **24/7/365** automatically with no manual intervention.

**Available Platforms:** Google Hotel Ads, TripAdvisor (including TASP), Google Travel Property Ads (TPAs), Kayak, Trivago, Bing.

### 3.2 On-Site Personalization (Triptease Messages)

A suite of customizable on-site messaging tools designed to reduce abandonment and guide guests toward booking direct:

- **Price Check:** Shows the guest the direct price vs. up to three OTAs in real-time
- **Price Match:** When an OTA is undercutting, offers to match the lower price instantly via a promo code
- **Nudge Messages:** Create urgency and social proof
- **Email Capture:** Offers a discount or special offer in exchange for the guest's email address
- **Targeted Messages:** Deliver specific offers to targeted guest segments
- **Full-Screen Messages:** High-impact messages for major announcements or promotions
- **Location-Based Messages:** Target guests from specific geographic areas

**A/B Testing:** Hotels can A/B test different message copy, creative, and offers to optimize conversion rates. The platform automatically identifies the winning variant.

### 3.3 Display Retargeting

Brings abandoning visitors back to the hotel website through personalized ads on Facebook, Instagram, and the Google Display Network. Unlike generic retargeting, Triptease ads are dynamically populated with the **exact dates** the guest searched for, the **best available price** for those dates, and an image of the hotel.

**Lookalike Audiences:** Triptease can create lookalike audiences based on the hotel's most valuable past bookers, enabling prospecting campaigns to find new guests with similar profiles.

### 3.4 Triptease Paid Search

Manages Google and Bing paid search campaigns (brand, non-brand, and competitor keywords) to capture high-intent search traffic. Works in synergy with metasearch: Triptease's unified platform tracks the entire journey across both channels, ensuring proper attribution and preventing double-counting. **Parity-aware bidding** can automatically pause or reduce spend if the hotel is being significantly undercut by OTAs.

### 3.5 Triptease Email

Sends automated emails to guests who start a booking but don't complete it. Triggered when a guest enters their email during the booking process but abandons the session. The email contains the specific details of their search (dates, room type) and a clear call-to-action to complete the booking.

---

## 4. Pricing and Commercial Models

Triptease offers three primary commercial models:

1. **Pay per Booking (Commission):** A percentage of the net booking value for each confirmed booking. The most common model. Commission rates vary but are typically **7-10%**.
2. **Pay per Click (CPC):** A fixed cost for each click generated from a metasearch or paid search ad. Used by hotels that prefer a fixed-cost advertising model.
3. **Subscription (SaaS Fee):** A flat monthly or annual fee per property. More common for on-site messaging products or for very large enterprise clients.

**Hybrid models** are also available. **Booking reconciliation** for commission-based clients allows hotels to review, amend, or cancel bookings before paying commission.

---

## 5. Integrations

Triptease integrates with over **120+ booking engines**, including:

- Sabre SynXis
- Amadeus iHotelier
- D-Edge
- TravelClick (Amadeus)
- SiteMinder
- SHR (Windsurfer)
- Roiback
- Mirai

And leading **Revenue Management Systems (RMS)** for occupancy-based bidding:

- Flyr (formerly Pace)
- Duetto
- BEONx
- Ideas
- Outrigger

---

## 6. Key Differentiators

- **Unified Multi-Channel Platform:** Manages meta, search, retargeting, and on-site messages in one place with a single source of truth for data and attribution
- **Parity-Aware Performance:** The entire platform is built around parity data. Triptease is the only provider that automatically adjusts bidding and messaging strategy in real-time based on OTA undercutting
- **Automated Metasearch Price Match:** A unique tool that no competitor offers, allowing hotels to compete with OTAs on price without manual intervention or giving away unnecessary margin
- **Booking Journey Attribution:** Provides true, end-to-end visibility into the cost of acquiring a guest across multiple touchpoints
- **Deep Learning Algorithm:** 10+ years of machine learning and a massive dataset power a bidding engine that consistently outperforms both manual management and competitor/platform-native tools (like Google PMax)
- **Flexibility and Modularity:** Hotels can start with one product and scale up, or switch commercial models as their needs change

---

## 7. Competitive Positioning

### vs. DerbySoft
Metasearch-only provider, primarily NORAM. Pricing: 8-15% of ad spend. No on-site personalization, no retargeting, no cross-channel view. No automated Price Match. No Date Boost.

### vs. Cendyn
Large hospitality CRM and marketing cloud. Commission: 10-15%. Metasearch is an add-on, not core. Often described as a "black box" with limited transparency.

### vs. Avvio / SynXis (Sabre)
Booking engine provider with metasearch add-on. Pricing: 10-15% of ad spend + 3% tech fee. ROAS reporting excludes Free Booking Links. No automated Price Match. No Date Boost. Typical cost of sale: 10-15% + 3% tech fee vs. Triptease's ~3-4%.

### vs. Koddi
Enterprise white-label metasearch for brand co-op programs (Marriott "PLUS", Hilton "Elevate/Amplify", Hyatt "TOP-UP", BWH "MediaMax", Accor "Premium"). Charges ~15% of ad spend. One-size-fits-all optimization at corporate level vs. Triptease's property-level profit optimization. Triptease can **layer on top** of a Koddi brand program.

### vs. Sojern
Commission-based travel ad network. Commission: 10-15%. Acquired by RateGain (Oct 2025). Frequently described as opaque ("black box"). No native metasearch. No parity-aware bidding. Double-billing/overlap risk documented.

### vs. The Hotels Network (THN / Lighthouse)
On-site personalization specialist. Acquired by Lighthouse (Apr 2025). Launched Superpilot AI automation layer (Jun 2025). Strong website-native personalization but narrow scope: no metasearch, no paid search, no retargeting, no cross-channel coordination.

### vs. Mirai
Booking engine/CRS-first provider with metasearch + paid search as add-ons. Commission: 8-10% + 2-3% BE fees. Very strong in Spain and Latin America, weaker outside those markets.

### vs. ROIback (HBX Group)
BE/CRS infrastructure provider with paid channels as add-ons. Commission: 8-15% + 2-3% BE fees. Spain and LATAM focused. Uses WiHP/Whiphopper for metasearch connectivity. Resells THN widget for on-site personalization.

### vs. D-Edge (Accor-owned)
Booking engine/CRS provider. Digital marketing via MediaGenius platform. Self-serve platform: hotel staff must actively manage campaigns. Commission model may pause campaigns mid-month if budget is exhausted. Triptease typically paces at 60-70% of budget while over-delivering on performance (ROAS up to 40x).

### Competitor Commercial Model Summary

| Competitor | Pricing Model | Typical Fee | Regions |
|---|---|---|---|
| DerbySoft | % of ad spend | 8-15% of spend | NORAM |
| Cendyn | Commission | 10-15% of booking value | APAC, global |
| Avvio/SynXis | % of ad spend + tech fee | 10-15% + 3% tech fee | Global |
| Koddi | % of ad spend | ~15% of spend | EMEA, NORAM |
| Sojern | Commission | 10-15% of booking value | Global |
| Mirai | Commission + BE fees | 8-10% + 2-3% BE fees | Spain, LATAM |
| ROIback | Commission + BE fees | 8-15% + 2-3% BE fees | Spain, LATAM |
| D-Edge | Commission or license | 15% commission (7-9% effective) or $130-655/mo | EMEA, APAC |
| THN | Per-property fee | Lower per-hotel (often) | Global |

---

## 8. Performance Benchmarks and Results

- **Metasearch ROAS:** Typically **10-15x**. Can reach **25-30x** for highly optimized accounts.
- **Paid Search ROAS:** **8-12x** on average.
- **Retargeting ROAS:** **15-20x** on average. Can reach up to **90x** in some cases.
- **Booking Engine CVR Uplift:** On-site messages typically increase CVR by **10-25%**.
- **Cost of Sale Reduction:** Hotels switching to Triptease from high-commission competitors often see total cost of sale **reduced by 20-40%**.

### Published Case Study Highlights

- **Rio Las Vegas:** 15:1 ROAS on metasearch in the Las Vegas market
- **Motel One:** 101% increase in direct revenue from metasearch after switching to Triptease
- **Royal Group Hotels and Resorts:** Increased direct bookings by 25% across their portfolio
- **Evans Hotels:** 20:1 ROAS on direct booking campaigns
- **The Inn at Christmas Place:** Maintains over 90% direct bookings
- **HI USA:** Generates over $100,000 in monthly revenue through Triptease
- **GCP Hospitality:** Reduced cost of sale by 30% while increasing direct bookings by 40%

---

## 9. Ideal Customer Profile (ICP)

Triptease delivers the most value for properties with:

- **High OTA Dependency:** Hotels paying too much in commission to OTAs
- **Significant Parity Issues:** Hotels frequently being undercut by OTAs
- **Desire for Data and Transparency:** Hotels frustrated with "black box" marketing partners
- **Multiple Properties / Hotel Groups:** Need for centralized reporting and strategy across a portfolio

### Strongest segments:
- **Luxury and High-End Independent Hotels** (e.g., Evans Hotels)
- **Mid-to-Large Sized Hotel Groups** (e.g., Motel One, Best Western Great Britain, Royal Group)
- **Hostels and Alternative Accommodation** (e.g., HI USA, GCP Hospitality)
- **Unique Independent Properties with a Strong Story** (e.g., The Inn at Christmas Place)
- **Hotels with a dedicated marketing/revenue manager** who can actively use the platform's insights

---

## 10. Implementation and Onboarding

- **Onboarding Time:** Typically **2-4 weeks** from contract signing to go-live
- **Process:**
  1. Kick-off call: align on goals, strategy, and timelines
  2. Script Installation: hotel's web developer places the Triptease tracking script in their GTM
  3. Connectivity: Triptease connects to the hotel's booking engine and (if applicable) RMS
  4. Campaign Setup: Triptease's team builds the initial campaigns based on the hotel's goals
  5. Training: Triptease provides dashboard training for the hotel team
  6. Go-Live: campaigns are activated
- **Support:** All clients get a dedicated Customer Success Manager (CSM)

---

## Related

- [[About Triptease]] — company overview, mission, values
- [[Leadership]] — exec team and senior leaders
- [[Org Structure]] — squads (Rockhopper, Dragonfly, Tamarin, etc.) that build these products
- [[OKRs and Strategic Priorities]] — current focus
- [[AI at Triptease]] — AI strategy, MCPs, internal tooling
- [[Direct Booking Summit]] — flagship owned event
- [[Glossary - Triptease]] — internal slang
- [[Hospitality Glossary]] — industry terms
- [[Slack Channels]] — channel directory
- [[Brand Voice and Style Guide]]
- [[Brand Guidelines - Visual]]
- [[Triptease Studio]]
- [[Guest Personas]]
- [[ABM Creator]]
- [[Tools Index]]
