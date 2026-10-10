# Phase 3: get found, clearer navigation, a shorter form

Owner's brief (10 Oct 2026): the site is live but nobody can find it. From now on everything is built **SEO- and GEO-friendly** (GEO = showing up in AI answers: ChatGPT, Gemini, Perplexity, Copilot, Claude). One landing page isn't enough; we need 5–7+ real pages. Fix the header hierarchy. Make the request form much shorter, with optional extra questions that only reach us. The owner's phone feedback comes later (on hold).

**Decisions (10 Oct 2026):** all pages, including Guides now · WhatsApp and email both required · short form first · Claude drafts the EN/AR copy, the owner reviews it before it goes live.

Status: ☐ to do · ◐ in progress · ☑ done (with the PR)

---

## A. The short form (biggest effect on requests)

**Before:** 3 steps and 15 fields. Too much for a first contact.

**New:** one short screen, written for farms, not a generic "Contact us".
- **Required (6):** name, WhatsApp/phone, email, farm name, farm type (chips: tower, container, indoor room, greenhouse, lab, other), country.
- Consent tick box, then **Send request**.
- Prefilled from the demo: farm name and farm type.
- Same thank-you screen and the same two emails as now.

**Then, optional: "Tell us more (about 2 minutes)"**, shown on the thank-you screen.
- Area, number of levels, crops, how they track the farm today, sensor brand, goals, anything else.
- Saved to the **same request** in Supabase; we get a short "More details for {farm}" email. **The visitor gets no second email.**
- They can skip it; nothing is lost.
- Safe by design: the second part can only add to the request just sent (a one-time token returned with the first save), never change or read anyone else's.
- No Supabase change needed: the existing columns already hold these answers.

☑ A1 short form · ☑ A2 optional details + owner-only email · ☑ A3 no Supabase change needed · ☑ A4 emails: "you'll get a second email if they add details"

## B. Header and navigation

**Today:** Live demo · How it works · Features · Who it's for · FAQ, all as same-level links to sections of one page. The two actions don't stand apart.

**New hierarchy:**
- **Left:** logo.
- **Middle (where you can go):** Product · Solutions ▾ (the 4 farm types) · Pilot · About · FAQ.
- **Right (what you can do):** language switch · **Live demo** (outlined button) · **Request a pilot** (solid green button).
- **Phone:** logo · Request · ☰. The menu groups the same things: pages, then the two buttons.
- The footer gets a full site map (all pages, both languages), which also helps search engines.

☑ B1 new header (desktop + phone) · ☑ B2 menu sheet grouped · ☑ B3 footer site map

## C. Pages (each in English and Arabic, each with its own address, title and description)

| Page | Address | What it's for | Search terms it targets |
|---|---|---|---|
| Home | `/en` | The story in 5 seconds + live 3D | vertical farm software, farm digital twin |
| Product (how it works) | `/en/product` | Twin, light recipes, seed-to-plate, data, setup | vertical farm management software, indoor farm monitoring |
| Solutions × 4 | `/en/solutions/vertical-farms`, `/container-farms`, `/greenhouses`, `/research-labs` | One page per farm type, with its own 3D image and use cases | container farm software, hydroponic greenhouse monitoring… |
| Pilot program | `/en/pilot` | Offer, terms, timeline, pricing answer | free farm software pilot Jordan / UAE / Saudi |
| About | `/en/about` | Who's behind it, why, Amman, the Gulf focus (trust) | Lamina farm, Lamina Jordan |
| FAQ | `/en/faq` | Every question, answer first (AI tools quote these) | how much does vertical farm software cost… |
| Live demo | `/en/demo` | Stays as is | |
| Request a pilot | `/en/request` | The short form | |
| Privacy | `/en/privacy` | As is | |
| Guides | `/en/learn/…` | Short articles ("What is a digital twin for a farm?") — the strongest GEO signal | what is a farm digital twin… |

☑ C1 page shells + routing · ☑ C2 Product · ☑ C3 Solutions ×4 (+ Solutions index) · ☑ C4 Pilot · ☑ C5 About · ☑ C6 FAQ · ☑ C7 Home links out to the pages · ☐ C8 Guides (first 3 articles, next PR)

## D. SEO and GEO, built in everywhere

- **Every page:** unique title and description (EN/AR), one `h1`, clear `h2`s, canonical link, language alternates, share image, breadcrumbs.
- **Structured data (JSON-LD):** Organization, WebSite, SoftwareApplication (Lamina), FAQPage, BreadcrumbList, and Service for the pilot. This is what Google and AI tools read to understand the business.
- **Answer-first writing:** each section opens with a plain one-sentence answer, then details. Facts stated plainly (who, where, what it costs, how long), the way AI tools like to quote.
- **Alt text** on every image, in both languages; the 3D canvas gets a text description.
- **`llms.txt`:** a short plain-text summary of Lamina and its pages for AI tools.
- **`robots.txt`:** allow search and AI crawlers (Google, Bing, OpenAI, Anthropic, Perplexity); keep `/api` closed.
- **Sitemap:** every page, both languages, with alternates.
- **Speed:** keep Lighthouse high; images in WebP with sizes; the 3D only where it helps.
- **Internal links:** every page links to related pages and to the demo and request.
- **Fix L8** (instant Back button) and confirm L7 (real phone speed) along the way.

☑ D1 metadata helper + JSON-LD · ☑ D2 robots, sitemap, llms.txt · ☑ D3 alt text on every new image · ◐ D4 L8 Back button (header fixed; confirm on a phone) · ◐ D5 checks (done locally; Rich Results test once live)

## E. Owner tasks for this phase (also in `owner-todo.md`)
- Google Search Console and Bing Webmaster Tools: verify laminafarm.app (DNS record in cPanel Zone Editor; step-by-step guide to come), then submit the sitemap.
- Google Business Profile (optional, helps "near me" and trust).
- Review the new page copy (EN/AR) before it goes live, especially About and Pilot.

## Suggested order
1. **A (form)** — fastest win for requests.
2. **B + C1 + D1–D2** — header, page shells, technical SEO in one go.
3. **C2–C7** — page content, a few pages per PR, each reviewed by the owner.
4. **D3–D5**, then Search Console, then C8 guides.
