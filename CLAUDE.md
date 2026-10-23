# Lamina: project context

Read this first. It explains what we're building, what's decided, and what's next.

## The product

A live 3D "digital twin" for vertical and indoor farms, called **Lamina (لامينا)**: Latin for "layer", and the blade of a leaf. It was chosen on 9 Oct 2026, replacing the working name "Canopy". The domain is **laminafarm.app** and the mailbox is **hello@laminafarm.app**. Repo and internal keys still say `canopy`. Farm owners see every floor, crop, light recipe and crate, from seed to delivery, in one view.

**Business model:** free pilot now, paid later. No calls: the site, WhatsApp and short screen-recorded videos do the selling; we don't sell self-serve yet.

**Visitor flow (built):**
1. Landing page (`/en`, `/ar`) with a live 3D farm and a "Your farm's name" field.
2. Personalised demo (`/[lang]/demo?farm=Name&type=container`): the full twin on sample data, carrying their farm name and farm type (vertical tower, container farm, hydroponic greenhouse or research lab, picked in the welcome card), with "Get this for my farm" calls to action everywhere.
3. Pilot request form (`/[lang]/request`): one short screen (farm name, farm type, name, email, WhatsApp, country, consent), saved to Supabase, emailed to the owner and the visitor, then a "What's next" screen (send layout photos on WhatsApp; reply within one business day with a short video of their demo). No calls. A draft is kept in sessionStorage. The thank-you screen offers optional "Tell us more" questions (role, size, crops, tracking, goals, message): `/api/requests/details` adds them to the same Supabase row, using a signed two-day pass from the first response (`lib/server/details-token.ts`), and emails only the owner ("More details: …"); the visitor gets no second email.
4. After the request (and layout photos on WhatsApp), we set up a tenant for the farm by hand (no customer app yet).

**Target users:** farm owners, grow managers and operations teams. Start with Jordan and the Gulf; also container farms, hydroponic greenhouses and research labs, not only tower farms.

## Owner

Mikdam Qandil, Sr. UX/UI Designer. The site doubles as a showcase of design and UX craft, so polish and motion quality matter.

**Working preferences:** ask before proceeding on anything unclear or outward-facing, and keep a to-do list. Explain plainly; he's a designer, not an engineer.

**Always keep these files current (owner's request, 9 Oct 2026; the third added 23 Oct):**
- `docs/owner-todo.md`: **everything needed from the owner**, in one list. Add items the moment a need comes up, tick them when done, and point him to it at the end of each piece of work.
- `docs/problems-and-fixes.md`: every problem we hit and how we solved it (what we saw, the cause, the fix, how to check next time). Add an entry whenever something goes wrong and gets fixed.
- `docs/ux-review-2.md`: the current UX fix plan (round 2: navigation). Work through it step by step, and mark each item ◐ in progress or ☑ done (with the PR) as it lands. Round 1 (F1–F25) is in `docs/ux-review/index.html`, all done.

## Decisions so far

- **Stack:** Next.js 16 (App Router), React 19, Tailwind 4, React Three Fiber, `motion/react`, Zod, Nodemailer. No GSAP in this repo.
- **Hosting:** **Netlify is for staging and quick previews only, not production** (owner, 9 Oct 2026). **No Vercel, and no products from Israeli companies**; check any new tool or service against this before suggesting it. **Production runs on the owner's Namecheap hosting** through cPanel → Setup Node.js App (Passenger): `STANDALONE=1 pnpm build` makes `.next/standalone`; `deploy/cpanel/package.sh` turns it into `dist/lamina-cpanel.zip` (no `node_modules`: cPanel's "Run NPM Install" installs next/react/react-dom; startup file `deploy/cpanel/app.js` resets `HOSTNAME`). The GitHub workflow `cpanel-package.yml` builds that zip on every merge to `main` and, when the `FTP_SERVER`/`FTP_USERNAME`/`FTP_PASSWORD` secrets are set, `deploy/cpanel/publish.sh` uploads it over FTPS (lftp mirror, an FTP account limited to the app folder) and restarts the app by touching `tmp/restart.txt`; it warns when `package.json` changed (then the owner presses Run NPM Install). It also deletes `.next/server/route-cache` before the restart: Next 16 saves a copy of each page there on first visit and prefers it over the build, which kept the live site on its 10 Oct pages until 23 Oct; `experimental.isrFlushToDisk: false` in `next.config.ts` stops it writing those copies at all. The package also puts `BUILD.txt` at `/build.txt`, so after a merge you can check which commit is live. Without the secrets the owner uploads the zip by hand (`docs/hosting-cpanel.md`). Public `NEXT_PUBLIC_*` values are baked in at build time from GitHub Actions variables; server secrets live in the cPanel app's environment variables. Never point the domain at Netlify. `netlify.toml` pins the build; security headers live in `next.config.ts`. The domain and mailbox stay at Namecheap: the owner has Namecheap hosting with cPanel, and the domain uses Namecheap Web Hosting DNS, so DNS records are edited in **cPanel → Zone Editor** (not Namecheap's Advanced DNS); the mailbox is a cPanel email account. Keep the code host-neutral: no host-only APIs.
- **Data:** Supabase (`supabase/schema.sql`, table `pilot_requests`) via REST with the service role key, server only.
- **Email:** SMTP (works with the cPanel mailbox); Resend can replace it later via the same env vars. The two emails (the visitor's confirmation in their language, the owner's new-request notice in English) are in `src/lib/email/templates.ts`: table layout, inline styles, images by absolute URL from `public/email/` (a header image per farm type, plus the logo mark), green success header, signed "The Lamina team". Their copy is under `email` in the dictionaries.
- **Booking:** optional. If `NEXT_PUBLIC_BOOKING_URL` is set, the thank-you screen shows a small "Prefer to talk? Pick a time" link; there is no booking embed, since there are no calls.
- **Analytics:** Umami (cookie-free, no banner) for visit counts and the funnel; Microsoft Clarity (heatmaps, recordings) and Google Analytics 4 (`NEXT_PUBLIC_GA_ID`, loaded directly with gtag.js, no Tag Manager; Consent Mode with ads off, Google signals off) load only after the visitor clicks "Allow" in the consent prompt (`components/analytics.tsx`). `track()` sends each event to all three; GA4 gets `type` as `farm_type`, `request_sent` also as `generate_lead`, the details' area only as `size_band`, and page views without `?farm=`. Never send names, contacts or farm names to GA4. Fire funnel events with `track()` from `lib/analytics.ts`: `demo_opened`, `demo_interaction`, `request_error`, `request_sent`, `request_details`, `demo_tour`, `whatsapp_click`. Any new tracking tool must be added to the privacy policy.
- **SEO:** `NEXT_PUBLIC_SITE_URL` is the live address (falls back to Netlify's `URL`, the site's main address). Every page sets its canonical link, language alternates and share image with `pageMeta()` from `lib/seo.ts`. The demo is `noindex`. The owner's guide to Google Search Console and Bing Webmaster Tools is `docs/search-console.md`.
- **WhatsApp:** `WhatsAppLink` (`components/ui/whatsapp-link.tsx`) opens a chat with a ready message (farm name included when known) and fires `whatsapp_click`. Number in `NEXT_PUBLIC_WHATSAPP_NUMBER`, default +962 78 7016 351.
- **Outreach:** `docs/outreach-links.xlsx` builds personalised demo links with UTM tags; its "Farm type" column adds `&type=` so each farm sees its own kind of farm. Umami strips `?farm=` but keeps `utm_*` (`stripFarm` in `lib/analytics.ts`).
- Everything degrades gracefully: with no env vars, form requests are logged to the server console.
- **Languages:** English and Arabic (RTL). All copy lives in `src/i18n/en.ts` and `src/i18n/ar.ts` (same shape, `{placeholder}` syntax, `fmt()` helper). `src/proxy.ts` (Next 16's renamed middleware) redirects `/` by browser language.
- **Brand name:** `BRAND` ("Lamina") and `BRAND_AR` ("لامينا") in `src/lib/site.ts`. Use `brandName(lang)` in running text and titles; the logo, share images and email sender use the Latin `BRAND`. The meta titles and WhatsApp messages in the dictionaries spell it out directly.

## Design and code rules

- **This is Next.js 16:** APIs differ from older versions. Check `node_modules/next/dist/docs/` before using a Next API you're unsure of. `middleware` is now `proxy.ts`.
- **Look (owner, 18 Oct 2026: "more modern and visually mature"):** alternating full-width bands, dark (forest/emerald) and light (cream/sage); rounded cards (24–32px); pill buttons and pill labels; key words of a heading in a lime badge (`Hl` on the home page); big bold figures for numbers; FAQ as a thin-line accordion; the footer is forest with the farm-name field and a large faint wordmark.
- **Palette:** tokens in `src/app/globals.css`: forest `#0e3b29` (hero and title bands, footer), emerald `#08291c` (deeper bands), cream `#f6f4ec` (the page ground, `bg`), sage `#e3ebdc` (light bands and chips), **lime `#c6f04d`** (main buttons, badges, highlighted words, the scroll bar), ink `#0f2a1e` (text), green `#1f7a45` (green text and links on cream), leaf `#2e9e5b` (logo mark and small shapes only), LED pink `#ff4fd8`. **Text on lime is always forest; lime text only on forest/emerald; never white or small text on leaf or lime.** Fonts: Plus Jakarta Sans (Latin, headings and text, extrabold headings with tight tracking), IBM Plex Sans Arabic (Arabic), IBM Plex Mono (small numbers). The share images and emails still use the old palette and Bricolage (to update).
- **Motion kit:** `src/components/motion/kit.tsx` (Reveal, WordReveal, Typewriter, CountUp, Magnetic, Spotlight, ScrollProgress). The custom cursor was dropped with the 18 Oct redesign.
- **Reduced motion:** always respect it (the landing is wrapped in `MotionRoot`; pings and reveals stop).
- **Arabic text:**
  - Never animate letter by letter (it breaks letter joins); use word-level reveals.
  - No letter-spacing on Arabic (handled in `globals.css`).
  - Use logical properties (`start`/`end`, `ms`/`me`) and `rtl:` variants; flip arrows with `rtl:rotate-180`.
- **Responsive:** down to 360px wide with no horizontal scroll.
- **3D farm:** `src/components/twin/`:
  - `sim.ts` is the model (plain TS class; the HUD reads a throttled snapshot via `useSyncExternalStore`).
  - `layouts.ts` describes the four farm types (`tower`, `container`, `greenhouse`, `lab`): where each of the 4 growing units sits, its beds, LEDs, sensors, where crates are handed over, and the camera framing. The sim and the scene both read it; `FarmSim.setType()` swaps it. The tower uses the lift; the others use a floor cart. Every unit's long side runs along x, so the drone always sweeps the same way.
  - The landing page always shows the tower (the hero stills match it).
  - `?type=` is carried by the language switch and into the request form, which pre-selects the farm type ("lab" is a request option too).
  - `scene.tsx` is R3F. Its Canvas uses `resize={{ offsetSize: true }}`, so CSS transforms never shrink it.
  - DOM labels are pinned to 3D points through `AnchorSink` (don't use drei `Html`; it broke under React 19).
- **Site navigation:**
  - `components/ui/site-header.tsx` is the one header on every page (landing, privacy, request).
    - It's fixed and always visible: clear at the top, a compact frosted bar after 40 px. Never hide it on scroll; the owner asked for it to stay.
    - Every page opens on a forest band, so its default `tone` is `"dark"` (white text, emerald bar, lime Request button); `tone="light"` exists for a page that opens on cream. The request page puts it on a forest strip.
    - It renders its own spacer (`HEADER_H`). `html` has `scroll-padding-top: 80px`, so section links land below it.
    - `variant="request"` drops the section links and the call to action.
    - Hierarchy: logo · pages (Product, Solutions ▾ with the four farm types, Pilot, About, FAQ) · actions on the right (language switch, outlined **Live demo**, green **Request a pilot**). Phones: logo, Request, ☰. The page list lives in `components/ui/site-nav.ts`.
  - `components/ui/site-menu.tsx` is the ☰ sheet (focus trap, Escape): pages with the farm types under Solutions, then Request and Live demo. It's portalled to `<body>`, so the frosted bars don't clip it. The demo's top bar uses it too (`always`).
  - The footer (`site-footer.tsx`, takes the whole dictionary) is forest: the farm-name field as its sign-up bar, a full site map of the current language, contacts, and a faint wordmark.
- **Home page (`app/[lang]/page.tsx`):** forest hero (`landing/home-hero.tsx`: farm type typed in a lime badge, the name field, the live 3D farm in a rounded frame), "Built for" pills, the pilot in numbers (only promises already on the site), how it works (sage), a 2 × 2 feature matrix with 3D stills, farm-type cards (sage), a pilot band in place of testimonials (emerald: pilot spots, what we ask, the founder's note), FAQ, footer. Its extra copy is in `src/i18n/home.ts`. Section ids `how`, `features`, `who`, `pilot`, `faq` are what the language switch keeps.
- **Content pages (SEO/GEO, phase 3, `docs/phase-3-plan.md`):** `/[lang]/product`, `/solutions`, `/solutions/[slug]` (`vertical-farms`, `container-farms`, `greenhouses`, `research-labs`; same addresses in both languages, see `lib/routes.ts`), `/pilot`, `/about`, `/faq`, and the guides: `/learn` and `/learn/[slug]` (13 guides, listed in `GUIDES`/`GUIDE_SLUG` in `lib/routes.ts`; `indoor-farm-guide` is the main (pillar) guide; the plan behind them is `docs/growth-plan.md`; body text may link with `[words](/path)`; a guide can carry `terms`, `sources` (shown at the end and as `citation`), `about` and `kind: "tech"` (TechArticle); every number needs a source; copy in `src/i18n/guides-en.ts` / `guides-ar.ts`, loaded with `getGuides()`, built from `components/page/guide.tsx` and `guide-client.tsx`, with Article and FAQPage structured data). **Guide layout (owner, 16 Oct 2026: less white, more brand colour, easier reading):** the Guides page has a forest title band with topic links (`GUIDE_TOPIC`: monitoring, money, gulf), the main guide as a featured card overlapping it, then the guides by topic (the middle topic on an emerald band); a guide page has a forest title band (it follows `PageShell`'s forest header band seamlessly), the image overlapping it, one 720px reading column with numbered sections, a reading progress bar and a floating "On this page" button, then the terms on an emerald band and the questions on a sage band. A new guide goes into `GUIDES`/`GUIDE_SLUG` and both guide files; the sitemap, `llms.txt`, the Guides page and the FAQ page pick it up. Copy in `src/i18n/pages-en.ts` / `pages-ar.ts` (same shape, loaded with `getPages()`), written answer-first: each page and section opens with a plain sentence that answers the question. Pages are built from `components/page/blocks.tsx` inside `PageShell` (a forest band with the header, breadcrumbs and the page's `intro`, then the page, a lime closing call to action, the footer and JSON-LD). Blocks that sit on the forest band style themselves with Tailwind's `in-[.band]:` variant (the band carries `class="band"`); use `primaryCls`/`secondaryCls` for any custom link that should look like the buttons. Every page sets `contentMeta()` and structured data from `lib/schema.ts` (Organization, WebSite, SoftwareApplication, Service, FAQPage, BreadcrumbList); facts there must match the visible copy. Images are the 3D stills in `public/farms/` (WebP, two sizes) with real alt text in both languages. `/llms.txt` summarises the site for AI tools from the English copy; `robots.ts` welcomes search and AI crawlers. A new page goes into `PAGE` (`lib/routes.ts`), the sitemap, the header/menu/footer lists and `llms.txt`.
  - The language switch (`components/ui/lang-switch.tsx`) keeps the visitor's section; in the demo it carries floor, time and "welcome seen" (`f`, `t`, `w`, removed from the address once used).
- **Hero still:** `public/hero/farm-wide.webp` and `farm-compact.webp` show before the 3D loads (re-capture them if the hero scene or camera changes). The scene calls `onReady` after its first frame.
- **Demo layout and tour (13 Oct 2026):** the farm is the main thing on screen. A toolbar (`Dock` in `twin-app.tsx`: Floor & lights · Clock · Seed to plate · Today) opens **one panel at a time** (right column on desktop, below the farm on phones; Floor & lights open by default); the old always-on cards and the "Try this" checklist are gone. After the welcome card, first-time visitors get a **guided tour** (`twin/tour.tsx`): a spotlight on the real control and a bubble pointing at it, 7 steps (zoom into a unit, live readings, light recipe, its effect, clock, seed to plate, request). Doing a step's action moves on by itself (`FarmSim.tried`, reset by `resetTried()`); Next/Back/Skip are always there; Escape skips. Targets carry `data-tour="…"`; the tour opens the panel a step needs. Finished or skipped is remembered per device (`localStorage` `canopy-tour`); the **Tour** button in the demo's top bar replays it. Funnel event `demo_tour` (`stage`: start, skip, done).
- **Request form fields:** the country is a list (`lib/countries.ts`, names saved in English, shown from `request.countries`); leaving step 1 adds the country code to a local phone number (`withCountryCode`).
- **Skip link:** every page has a "Skip to content" link to `#main`; give a new page's main area `id="main"`.
- **Request form scrolling:** steps scroll to the form card after the new step has appeared, and scroll anchoring is off on that page (it fought the step swap).
- **Share images:** `app/api/og/route.tsx` (`next/og`). Its renderer, Satori, can't lay out Arabic by itself, so the `Words` helper places each word right to left at its measured width (`opentype.js`). Fonts are TTF files in `assets/fonts/`.
- **404 and error pages:** `[lang]/not-found.tsx` (reached through the `[lang]/[...missing]` catch-all) and `[lang]/error.tsx` share `components/ui/status-page.tsx`. They run in the browser, so their copy is in `src/i18n/status.ts`, not the main dictionaries. Next 16's error component gets `retry`, not `reset`.
- **Element ids:** don't give an element an id that matches a global the page uses (e.g. `id="clarity"`): browsers expose ids as `window` properties.
- **Launch prep:** `docs/launch-prep.md` is the checklist of decisions, content and accounts to finish before launch.
- **Marketing kit:** `docs/marketing/` (one-pager PDF, LinkedIn banners, 5 posts, demo clips; EN/AR, LinkedIn first, bold tone). It's rendered from the live site by the scripts in `docs/marketing/source/`; re-run them if the brand or the 3D scene changes.
- **After the request is sent,** `<html data-request-sent>` makes the language switch open the other homepage instead of an empty form.
- **Before committing:** run `pnpm lint` and `pnpm build`, and check desktop and phone, in English and Arabic.

## Roadmap

1. **Launch essentials:**
   - done: privacy policy page (EN/AR) at `/[lang]/privacy`, linked from the footer and the form;
   - done: analytics with funnel events (Umami + Clarity behind consent);
   - done: share images (personalised for demo links), favicon, SEO metadata, `robots.txt`, `sitemap.xml`;
   - done: branded 404/error pages, WhatsApp buttons, founder section (draft copy), outreach link sheet, accessibility pass (Lighthouse 100 on all pages), landing 3D pauses off-screen;
   - next: set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_CLARITY_ID`, then confirm no farm names appear in Umami;
   - next: final name and domain; email deliverability (SPF, DKIM, DMARC at Namecheap);
   - next: founder photo, and the owner's edits to the founder copy;
   - next: an end-to-end test once the live site (cPanel), Supabase and SMTP are connected (Cal.com is optional now);
   - done: marketing kit in `docs/marketing/` (waiting on the owner's review and the live domain).
2. **Validation (2–4 weeks):** **decision (8 Oct 2026): no calls.** The owner won't run sales or feedback calls, so the site has to replace the call: see the "no-call path" in the UX review (`docs/ux-review/index.html`; live page https://claude.ai/artifact/SVX8YYtGad7CpwoeTs5EqN). The review lists 25 prioritised fixes (F1–F25) in three sprints. All 25 are done (F13, the farm-type choice in the demo, came last). The call script stays as the source for 5 async questions. The kit is in `docs/validation/`:
   - done: call script (`call-script.en.md`, `call-script.ar.md`, Modern Standard Arabic) with a scorecard;
   - done: 22 target farms in Jordan, the UAE and Saudi Arabia (`target-farms.md`, public sources; verify each is active), also prefilled in `docs/outreach-links.xlsx`;
   - done: WhatsApp, LinkedIn and email messages, EN/AR (`outreach-messages.md`);
   - pilot offer: setup in about two weeks, then 3 months free; in return a 2-minute feedback form every two weeks and permission to mention them (anonymously if they prefer);
   - Goal: about 10 conversations (WhatsApp or email), 5 who'd use it weekly (score 4–5 on the scorecard questions), 2 pilots.
3. **Customer app (only if validation says yes):**
   - auth and one tenant per farm;
   - a farm builder (draw layout, floors, racks, zones, sensors);
   - manual and CSV data;
   - then sensor integrations, alerts and paid plans.

## Copy promises to confirm with the owner before launch

- "Reply within one business day"
- "About two weeks" to set up
- "Free for pilot farms"
- "Your data is never shared or sold"
- Contact email `hello@laminafarm.app` (was `info@mikdam.com`)
- Founder section copy (a draft written for him: "I'm building Lamina because farm teams track so much…", "During the pilot you talk to me, not a support queue")
- Showing WhatsApp +962 78 7016 351 publicly (approved)
- Pilot terms: "3 months free" (chosen by the owner); the "20-minute feedback call every two weeks" is to become a 2-minute feedback form, since there are no calls
- Privacy policy: controller "Mikdam Qandil, an individual based in Amman, Jordan"; requests kept up to 12 months after last contact; data requests handled within 30 days (worth a quick review by a lawyer before launch)
