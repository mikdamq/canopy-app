# Growth plan: tracking, keywords, site map, content and schema

**Status:** draft for Mikdam's review (15 Oct 2026). Nothing here is built yet. Reply "go" (or tell me what to change) and I'll build it step by step, one PR at a time.

**Where it comes from:** a 5-step brief (analytics → keywords → site map → article → schema audit), adapted to what Lamina really is: **farm software** (a live 3D twin), for **Jordan and the Gulf**, in **English and Arabic**, sold through a **free pilot**, with **no calls**. Anything in the brief that doesn't fit (growing hardware, investor deck, ROI calculator, made-up yield numbers) is left out, and each section says why.

**Ground rules:** every number on the site has a source link, nothing is invented, and no tool from an Israeli company is used.

---

## 1. Tracking: GA4 next to Umami and Clarity

**Decision (15 Oct 2026):** add Google Analytics 4 **directly** (no Tag Manager), **behind the same "Allow" prompt as Clarity**, and add it to the privacy policy.

### How it works

| Tool | What it's for | Loads |
|---|---|---|
| **Umami** | Visit counts and the funnel, without cookies | Always (no cookies) |
| **Clarity** | Heatmaps and recordings | Only after "Allow" |
| **GA4** (new) | Google's view of traffic sources, campaigns and key events; links to Search Console | Only after "Allow" |
| **Search Console** | Which Google searches show the site, and clicks | Outside the site (nothing to load) |

- One helper (`track()` in `lib/analytics.ts`) already fires every funnel event. It will send each event to **both** Umami and GA4, so the names match in both.
- **No personal data goes to GA4:** no farm names, names, emails or phone numbers. The `?farm=` part of demo addresses is removed before a page view is sent, as Umami already does.
- Google's **Consent Mode** starts as "denied"; GA4 only starts after "Allow". IP anonymisation is on by default in GA4. Google signals stay **off**.

### Events: the brief's names mapped to the real site

| Brief asked for | On Lamina | GA4 event name | When it fires | Parameters |
|---|---|---|---|---|
| `contact_form_submit` | Pilot request sent | `generate_lead` (Google's standard name) + `request_sent` | The request is saved | `farm_type`, `country`, `lang`, `source` |
| (extra) | Optional "Tell us more" sent | `request_details` | Details saved | `stage`, `size_band`, `role`, `lang` |
| (extra) | Form error | `request_error` | A field fails | `field`, `lang` |
| `3d_viewer_interact` | Demo opened / used / tour | `demo_opened`, `demo_interaction`, `demo_tour` | Demo loads; first real interaction; tour start/skip/done | `farm_type`, `named`, `stage`, `step`, `lang` |
| (extra) | WhatsApp tapped | `whatsapp_click` | Any WhatsApp button | `place` |
| `deck_download` | **Not applicable**: there's no investor deck on the site | — | — | — |
| `calculator_submit` | **Not applicable today**. A "cost per kg" calculator is a possible later page (see §3, B2) and would use this event | — | — | — |

**Key events (conversions) in GA4:** `generate_lead` (main), `whatsapp_click` and `demo_opened` (secondary).

### Custom dimensions (GA4 → Admin → Custom definitions, event-scoped)

| Dimension | Values | Comes from |
|---|---|---|
| `farm_type` | tower, container, greenhouse, lab, indoor, other | Demo type / form choice |
| `country` | e.g. Jordan, UAE, Saudi Arabia | Form (country list) |
| `lang` | en, ar | Page language |
| `size_band` | under 100 m², 100–500, 500–2,000, over 2,000 | Optional details (`areaM2`), **as a band, never the exact figure** |
| `place` | header, hero, faq, footer, done… | Which button was used |
| `stage` | start, skip, done, open, sent | Tour / details stage |

The brief's `estimated_sqm` becomes `size_band`. Sending the exact area would be a finer detail than we need, and bands are easier to read in reports.

### What I build (one PR)
1. `NEXT_PUBLIC_GA_ID` setting; the GA4 script loads only after "Allow", with Consent Mode.
2. `track()` sends to Umami + GA4; `generate_lead` added; `size_band` computed from `areaM2`.
3. Page views without `?farm=`.
4. Privacy policy (EN/AR) updated to name Google Analytics, what it collects and how to say no. "Last updated" date bumped.
5. CLAUDE.md, `docs/hosting-cpanel.md` (the new variable) and the owner to-do updated.

### What you do (about 10 minutes, steps go in `docs/owner-todo.md`)
1. **analytics.google.com** → Create property "Lamina" → Web data stream `https://laminafarm.app`.
2. Copy the **Measurement ID** (`G-…`, not secret) and add it as a GitHub variable `NEXT_PUBLIC_GA_ID` (same place as the Umami ID), then re-run the cPanel package workflow.
3. In GA4: register the custom dimensions above, mark `generate_lead` as a key event, set data retention to 14 months, keep Google signals off.
4. Link GA4 to Search Console (Admin → Product links).

---

## 2. Keywords and intent

**Honest limit:** I have no access to DataForSEO or another keyword tool here, so this list has **no search volumes**; any number would be invented. The real numbers come from **Google Search Console** about 2–4 weeks after you set it up (`docs/search-console.md`). We then re-rank this list by real impressions. If you ever buy a keyword tool, avoid Similarweb (an Israeli company).

### Three intent tiers (English and Arabic)

| Tier | English queries | Arabic queries | Page that answers it |
|---|---|---|---|
| **Informational** (learning) | what is a farm digital twin · how to track a vertical farm · vertical farm energy use per kg · container farm vs vertical farm · why did vertical farms fail · how much water does hydroponics save · vertical farming in the UAE / Saudi Arabia / Jordan · light recipe PPFD DLI explained | ما هو التوأم الرقمي للمزرعة · استهلاك الطاقة في المزارع العمودية · الزراعة المائية في الأردن · مزارع الحاويات في السعودية · لماذا فشلت المزارع العمودية | Guides (`/learn/…`) |
| **Commercial** (comparing) | vertical farm management software · indoor farm monitoring software · container farm software · greenhouse management software · CEA software · Freight Farms software alternative · farm traceability software | برنامج إدارة المزارع العمودية · نظام مراقبة المزارع الداخلية · برنامج إدارة البيوت المحمية · برنامج تتبع المحصول | Product, Solutions ×4, a "Container farm owners" page |
| **Transactional** (ready to act) | farm software free pilot · farm digital twin demo · vertical farm software Jordan / UAE / Saudi | تجربة مجانية لبرنامج المزرعة · عرض توأم رقمي للمزرعة | Pilot, Demo, Request |

### Competitor gap (software, not growers)

The brief named Plenty, Bowery and Freight Farms. They're growers or hardware sellers, and all three are in trouble, which is itself a content opportunity:

- **Freight Farms** (container farms) **ceased operations on 30 April 2025**. Owners keep their containers, but **cloud software access and support ended**. Those owners now need tracking software, and container farms are one of Lamina's four farm types. ([iGrow News](https://igrownews.com/agtech-companies/freight-farms/))
- **Bowery Farming** shut down (late 2024) and its assets were sold. ([Agriculture Dive](https://www.agriculturedive.com/news/celebrity-backed-indoor-farming-company-bowery-closes-lays-off-187-workers/732282), [Fertilizer Daily](https://www.fertilizerdaily.com/20251114-bowery-farmings-70m-georgia-vertical-farm-heads-to-liquidation-as-startups-collapse-triggers-nationwide-sell-offs/))
- **Plenty** filed for Chapter 11 in March 2025 and kept two sites running. ([Fertilizer Daily](https://fertilizerdaily.com/20250326-vertical-farming-startup-plenty-filed-for-bankruptcy-despite-raising-1-billion-from-softbank-walmart-and-jeff-bezos))

**The real software competitors:**

| Who | What | What they don't cover (Lamina's gap to fill) |
|---|---|---|
| **iUNU (LUNA) + Artemis** | Greenhouse cameras and sensors + cultivation management (US). ([AgFunder News](https://agfundernews.com/artemis-acquired-by-iunu-in-continued-rollup-plots-agrifinance-offering)) | Greenhouse-first, enterprise, English only, no Gulf focus |
| **Priva** | Greenhouse climate and energy control (Netherlands) | Hardware-linked control, not a whole-farm view |
| **Infinite Acres "Loop" (80 Acres) with Siemens** | Their own farms' platform; the digital twin is "in development". ([Siemens](https://www.siemens.com/en-us/company/insights/digital-transformation-80-acres-farms/)) | Not offered to small and mid-size farms |
| **Freight Farms "farmhand"** | Container farm software | **Switched off** (2025) |

**Questions buyers ask that nobody answers well (our content gap):**
1. How much energy does a vertical farm really use per kg, and where does it go?
2. What does it cost to run per kg, and how do I work it out for my farm?
3. Why did the big vertical farms fail, and what should a small farm track to avoid the same fate?
4. How do I keep a container farm tracked after Freight Farms shut down?
5. What changes in the Gulf heat (cooling, humidity, water)?
6. All of this **in Arabic**: there is almost no Arabic content on these topics.

---

## 3. Site map: one main guide + 3 topic groups

**Main guide (pillar):** *"Running an indoor farm with a digital twin: the complete guide"* at `/learn/indoor-farm-guide`. It answers the big question in the first lines, then summarises and links each group below. (The brief's pillar, "3D vertical farming technology & commercial feasibility", is about hardware; this is the Lamina version.)

| Group | Page | Status | Address |
|---|---|---|---|
| **A. Monitoring and traceability** | A1 What is a digital twin for a farm? | ✅ in PR #15 | `/learn/what-is-a-farm-digital-twin` |
| | A2 How to track a vertical farm from seed to delivery | ✅ in PR #15 | `/learn/seed-to-delivery-tracking` |
| | A3 Sensors for indoor farms: what to measure, and where | new | `/learn/indoor-farm-sensors` |
| | A4 Light recipes explained: spectrum, PPFD, DLI and photoperiod | new | `/learn/light-recipes` |
| **B. Energy and money** | B1 How much energy does a vertical farm use per kg? | new, **first to write** | `/learn/vertical-farm-energy-per-kg` |
| | B2 Cost per kg: how to work it out for your farm (optional calculator later) | new | `/learn/cost-per-kg` |
| | B3 Yield per square metre: how to measure it honestly | new | `/learn/yield-per-square-metre` |
| | B4 Why big vertical farms failed, and what small farms should track | new | `/learn/why-vertical-farms-fail` |
| **C. Gulf farming and resources** | C1 Indoor farming in the Gulf heat: cooling, humidity, power | new | `/learn/gulf-heat-indoor-farming` |
| | C2 How much water does hydroponics really save? | new | `/learn/hydroponics-water-use` |
| | C3 Container farm vs. vertical farm: what to track in each | ✅ in PR #15 | `/learn/container-vs-vertical-farm` |
| | C4 Container farm owners: keeping your farm tracked after Freight Farms | new | `/learn/container-farm-software` |

That makes **9 new guides + the main guide**, each in English and Arabic. At about 2–3 a week, it's a 4–5 week run. Each guide links to its Solutions page, the demo (with the right farm type) and the pilot request.

### Internal linking (which page links to which, and with what words)

| From | To | Link text (natural, in the sentence) |
|---|---|---|
| Home | Main guide | "the complete guide to running an indoor farm" |
| Main guide | A1 | "what a farm digital twin is" |
| Main guide | B1 | "how much energy a vertical farm uses per kg" |
| Main guide | C1 | "farming indoors in the Gulf heat" |
| Every guide | Main guide | "the complete guide" (breadcrumb + a line near the end) |
| A1 | A3 | "which sensors to start with" |
| A2 | B3 | "measure yield per square metre" |
| A3 | A4 | "light recipes" |
| A4 | B1 | "lighting is usually the biggest share of energy" |
| B1 | B2 | "turn energy into cost per kg" |
| B1 | C1 | "cooling in hot climates" |
| B2 | Pilot | "try it free for three months" |
| B4 | B1, B2 | "energy per kg", "cost per kg" |
| C1 | Solutions → Container farms | "container farms in the Gulf" |
| C2 | Solutions → Greenhouses | "hydroponic greenhouses" |
| C3 | C4 | "if you run a Freight Farms container" |
| C4 | Demo (`?type=container`) | "see a container farm in the demo" |
| Product | A1 | "Read the guide: what is a digital twin for a farm?" (✅ already in PR #15) |
| FAQ | Guides page | "Guides for indoor farm teams" (✅ already in PR #15) |
| Solutions → Vertical farms | A2, B1 | "seed-to-delivery tracking", "energy per kg" |
| Solutions → Container farms | C3, C4 | "container vs. vertical", "after Freight Farms" |
| Solutions → Greenhouses | C2 | "water use in hydroponics" |
| Solutions → Research labs | A4 | "light recipes" |

---

## 4. First article: B1, "How much energy does a vertical farm use per kg?"

The brief's topic ("3D volumetric stacking increases yield per m²") is about growing hardware, and the comparison table it asked for would need numbers that don't exist in published sources. B1 answers a question buyers really ask, with real published figures.

### Answer block (top of the page, 40–50 words, draft)

> Published studies put lettuce grown in vertical farms at roughly **10–18 kWh of electricity per kg**, with reported cases from about 9 to 39 kWh/kg. Lighting is usually the largest load, followed by cooling and dehumidification, which grow in hot climates. Tracking kWh per kg, per floor, shows where to save.

*(47 words.)*

### Headings (each one a question people search for)
- How much electricity does a vertical farm use per kg of lettuce?
- Why do published numbers vary so much?
- Where does the energy go: lighting, cooling or pumps?
- Does a hot climate like the Gulf change the numbers?
- How do I measure kWh per kg on my own farm?
- How can a farm lower its energy per kg?
- Questions (FAQ)

### Figures table (sources to be re-read in full before publishing)

| Measure | Figure | Source | Note |
|---|---|---|---|
| Energy per kg, lettuce (review of case studies) | 10–39 kWh/kg, median 18 | [Research Square preprint](https://www.researchsquare.com/article/rs-10962166/v1.pdf) | Preprint, not yet peer-reviewed |
| Energy per kg, lettuce (benchmarking) | about 10–18 kWh/kg | [arXiv 2603.15806](https://arxiv.org/pdf/2603.15806) | Quotes recent benchmarking work |
| Lighting electricity per kg (several farms compared) | 3.1–31.5 kWh/kg | [University of Salford](https://salford-repository.worktribe.com/OutputFile/4019714) | Lighting only |
| Modelled container farm, lettuce | 8.93 kWh/kg; USD 2.57/kg | [Sharif University repository](https://repository.sharif.edu/resource/494349/-/&from=search&&query=grouting&field=subjectkeyword&count=20&execute=true) | Model, not a measured farm; this link needs checking (it may point to the wrong record) |
| Share of energy: lighting / HVAC (cold-climate pilot) | 46–75% / 22–52% | [University of Manitoba thesis](https://mspace.lib.umanitoba.ca/items/ac54c125-4283-4507-a3b3-c06e20a397d0) | Cold climate; cooling rises in warm months |
| Hot-climate scenarios (incl. Dubai) | light intensity (PPFD) is the main driver of total energy | [arXiv 2507.18419](https://arxiv.org/pdf/2507.18419v1.pdf) | Check the Dubai breakdown in the full paper |

The page will say plainly that **Lamina doesn't sell lights or hardware**; it helps farms measure their own kWh per kg.

### Term boxes (short definitions shown beside the text)
- **kWh per kg:** electricity used, divided by the weight of sellable crop.
- **PPFD:** how much usable light reaches the plants each second (µmol/m²/s).
- **DLI:** the total usable light a plant gets in a day (mol/m²/day).
- **Photoperiod:** how many hours a day the lights are on.
- **HVAC/HVACD:** heating, ventilation, air conditioning (and dehumidification).

---

## 5. Schema and AI-readiness

### Already in place (checked on all 32 pages, 15 Oct 2026)
Titles, descriptions, canonical links, EN↔AR links, share images, one H1, alt text, Organization, WebSite, SoftwareApplication, Service, FAQPage, Article, BreadcrumbList, sitemap, robots (AI crawlers welcome), `llms.txt`.

### To add
| Item | Why |
|---|---|
| **TechArticle** for technical guides (A3, A4, B1–B3, C1–C2); Article for the others | Tells search and AI tools the page is technical reference |
| **`citation`** on each guide, listing its sources | Shows where every number comes from (helps AI citations) |
| **`about` / `mentions`** (e.g. "vertical farming", "hydroponics", "digital twin") | Ties pages to known topics |
| **Author page** for Mikdam (on /about) with `sameAs` → your LinkedIn | Search engines trust a named, real author more |
| WebPage + breadcrumbs on the request and privacy pages | The only two pages without structured data |
| Shorter descriptions (~155 characters) and titles (~60) on about 20 pages | Today they're cut off with "…" in Google |
| **Product schema: not used** | Lamina is software, so SoftwareApplication (already there) is the right type; Product would describe hardware we don't sell |

### AI citability checklist (run on each new guide before it goes live)
1. The first 50 words answer the question on their own.
2. Every number has a unit, a date or context, and a source link.
3. Each section makes sense if read alone (AI tools quote sections, not pages).
4. Tables are real HTML tables, not pictures.
5. Facts in structured data match the visible text.
6. The page names who wrote it and when it was updated.

---

## 6. Order of work (after your "go")

1. **PR A, tracking:** GA4 behind "Allow", event mapping, privacy policy, plus the schema and description fixes from §5. About 1 day.
2. **PR B, main guide + B1** (energy per kg), EN/AR, with the new schema. You review the copy.
3. **PR C onwards:** two or three guides per PR, in this order: C4 (Freight Farms owners: timely), B4 (why farms fail), C1 (Gulf heat), then the rest.
4. After 2–4 weeks of Search Console data: re-rank the topics by real searches.

## What I need from you
- **"Go"** on this plan, or changes (which topics, which order).
- **Your LinkedIn profile address** (for the author page).
- When PR A is ready: create the GA4 property and add the Measurement ID (steps in §1).
