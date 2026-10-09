# Lamina: project context

Read this first. It explains what we're building, what's decided, and what's next.

## The product

A live 3D "digital twin" for vertical and indoor farms, called **Lamina (لامينا)**: Latin for "layer", and the blade of a leaf. It was chosen on 9 Oct 2026, replacing the working name "Canopy". The domain is **laminafarm.app** and the mailbox is **hello@laminafarm.app**. Repo and internal keys still say `canopy`. Farm owners see every floor, crop, light recipe and crate, from seed to delivery, in one view.

**Business model:** free pilot now, paid later. No calls: the site, WhatsApp and short screen-recorded videos do the selling; we don't sell self-serve yet.

**Visitor flow (built):**
1. Landing page (`/en`, `/ar`) with a live 3D farm and a "Your farm's name" field.
2. Personalised demo (`/[lang]/demo?farm=Name&type=container`): the full twin on sample data, carrying their farm name and farm type (vertical tower, container farm, hydroponic greenhouse or research lab, picked in the welcome card), with "Get this for my farm" calls to action everywhere.
3. Pilot request form (`/[lang]/request`): 3 steps, saved to Supabase, emailed to the owner and the visitor, then a "What's next" screen (send layout photos on WhatsApp; reply within one business day with a short video of their demo). No calls. Back/Forward move between steps, and a draft is kept in sessionStorage.
4. After the request (and layout photos on WhatsApp), we set up a tenant for the farm by hand (no customer app yet).

**Target users:** farm owners, grow managers and operations teams. Start with Jordan and the Gulf; also container farms, hydroponic greenhouses and research labs, not only tower farms.

## Owner

Mikdam Qandil, Sr. UX/UI Designer. The site doubles as a showcase of design and UX craft, so polish and motion quality matter.

**Working preferences:** ask before proceeding on anything unclear or outward-facing, and keep a to-do list. Explain plainly; he's a designer, not an engineer.

**Always keep these two files current (owner's request, 9 Oct 2026):**
- `docs/owner-todo.md`: **everything needed from the owner**, in one list. Add items the moment a need comes up, tick them when done, and point him to it at the end of each piece of work.
- `docs/ux-review-2.md`: the current UX fix plan (round 2: navigation). Work through it step by step, and mark each item ◐ in progress or ☑ done (with the PR) as it lands. Round 1 (F1–F25) is in `docs/ux-review/index.html`, all done.

## Decisions so far

- **Stack:** Next.js 16 (App Router), React 19, Tailwind 4, React Three Fiber, `motion/react`, Zod, Nodemailer. No GSAP in this repo.
- **Hosting:** **Netlify is for staging and quick previews only, not production** (owner, 9 Oct 2026). **No Vercel, and no products from Israeli companies**; check any new tool or service against this before suggesting it. The production host is still to be decided (most likely the owner's Namecheap hosting); until then, don't point the domain at Netlify. `netlify.toml` pins the build; security headers live in `next.config.ts`. The domain and mailbox stay at Namecheap: the owner has Namecheap hosting with cPanel, and the domain uses Namecheap Web Hosting DNS, so DNS records are edited in **cPanel → Zone Editor** (not Namecheap's Advanced DNS); the mailbox is a cPanel email account. The owner would eventually like to host the app on his own cPanel too; that's an open question (it needs "Setup Node.js App" and is usually slower). Keep the code host-neutral: no host-only APIs.
- **Data:** Supabase (`supabase/schema.sql`, table `pilot_requests`) via REST with the service role key, server only.
- **Email:** SMTP (works with the cPanel mailbox); Resend can replace it later via the same env vars.
- **Booking:** optional. If `NEXT_PUBLIC_BOOKING_URL` is set, the thank-you screen shows a small "Prefer to talk? Pick a time" link; there is no booking embed, since there are no calls.
- **Analytics:** Umami (cookie-free, no banner) for visit counts and the funnel; Microsoft Clarity (heatmaps, recordings) loads only after the visitor clicks "Allow" in the consent prompt (`components/analytics.tsx`). Fire funnel events with `track()` from `lib/analytics.ts`: `demo_opened`, `demo_interaction`, `request_step`, `request_error`, `request_sent`, `whatsapp_click`. Any new tracking tool must be added to the privacy policy.
- **SEO:** `NEXT_PUBLIC_SITE_URL` is the live address (falls back to Netlify's `URL`, the site's main address). Every page sets its canonical link, language alternates and share image with `pageMeta()` from `lib/seo.ts`. The demo is `noindex`.
- **WhatsApp:** `WhatsAppLink` (`components/ui/whatsapp-link.tsx`) opens a chat with a ready message (farm name included when known) and fires `whatsapp_click`. Number in `NEXT_PUBLIC_WHATSAPP_NUMBER`, default +962 78 7016 351.
- **Outreach:** `docs/outreach-links.xlsx` builds personalised demo links with UTM tags; its "Farm type" column adds `&type=` so each farm sees its own kind of farm. Umami strips `?farm=` but keeps `utm_*` (`stripFarm` in `lib/analytics.ts`).
- Everything degrades gracefully: with no env vars, form requests are logged to the server console.
- **Languages:** English and Arabic (RTL). All copy lives in `src/i18n/en.ts` and `src/i18n/ar.ts` (same shape, `{placeholder}` syntax, `fmt()` helper). `src/proxy.ts` (Next 16's renamed middleware) redirects `/` by browser language.
- **Brand name:** `BRAND` ("Lamina") and `BRAND_AR` ("لامينا") in `src/lib/site.ts`. Use `brandName(lang)` in running text and titles; the logo, share images and email sender use the Latin `BRAND`. The meta titles and WhatsApp messages in the dictionaries spell it out directly.

## Design and code rules

- **This is Next.js 16:** APIs differ from older versions. Check `node_modules/next/dist/docs/` before using a Next API you're unsure of. `middleware` is now `proxy.ts`.
- **Palette:** tokens in `src/app/globals.css`: ink `#141b2b`, green `#1f7a45` (buttons and green text; 5.4:1 with white), leaf `#2e9e5b` (the lighter brand green, for shapes only: logo mark, progress bars, dots, glows), LED pink `#ff4fd8`, cool off-white ground. Don't put white or small text on leaf: it fails contrast. Fonts: Bricolage Grotesque (display), IBM Plex Sans/Mono, IBM Plex Sans Arabic.
- **Motion kit:** `src/components/motion/kit.tsx` (Reveal, WordReveal, Typewriter, CountUp, Magnetic, Spotlight, ScrollProgress). Custom cursor in `motion/cursor.tsx`, **landing page only** (the demo and form need precise clicking).
- **Reduced motion:** always respect it (the landing is wrapped in `MotionRoot`; the cursor is off; the marquee stops).
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
    - It renders its own spacer (`HEADER_H`). `html` has `scroll-padding-top: 80px`, so section links land below it.
    - `variant="request"` drops the section links and the call to action.
  - `components/ui/site-menu.tsx` is the ☰ sheet (focus trap, Escape). It's portalled to `<body>`, so the frosted bars don't clip it. The demo's top bar uses it too (`always`).
  - The language switch (`components/ui/lang-switch.tsx`) keeps the visitor's section; in the demo it carries floor, time and "welcome seen" (`f`, `t`, `w`, removed from the address once used).
- **Hero still:** `public/hero/farm-wide.webp` and `farm-compact.webp` show before the 3D loads (re-capture them if the hero scene or camera changes). The scene calls `onReady` after its first frame.
- **Demo checklist:** `FarmSim.tried` records zoom, light recipe and clock; the "Try this" card reads it.
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
   - next: an end-to-end test once Netlify, Supabase and SMTP are connected (Cal.com is optional now);
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
