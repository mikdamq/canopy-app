# Canopy: project context

Read this first. It explains what we're building, what's decided, and what's next.

## The product

A live 3D "digital twin" for vertical and indoor farms (working name **Canopy**; the final name is not chosen yet). Farm owners see every floor, crop, light recipe and crate, from seed to delivery, in one view.

**Business model:** free pilot now, paid later. Sales are call-first: we don't sell self-serve yet.

**Visitor flow (built):**
1. Landing page (`/en`, `/ar`) with a live 3D farm and a "Your farm's name" field.
2. Personalised demo (`/[lang]/demo?farm=Name`): the full twin on sample data, carrying their farm name, with "Get this for my farm" calls to action everywhere.
3. Pilot request form (`/[lang]/request`): 3 steps, saved to Supabase, emailed to the owner and the visitor, then a Cal.com booking embed.
4. After the call, we set up a tenant for the farm by hand (no customer app yet).

**Target users:** farm owners, grow managers and operations teams. Start with Jordan and the Gulf; also container farms, hydroponic greenhouses and research labs, not only tower farms.

## Owner

Mikdam Qandil, Sr. UX/UI Designer. The site doubles as a showcase of design and UX craft, so polish and motion quality matter.

**Working preferences:** ask before proceeding on anything unclear or outward-facing, and keep a to-do list. Explain plainly; he's a designer, not an engineer.

## Decisions so far

- **Stack:** Next.js 16 (App Router), React 19, Tailwind 4, React Three Fiber, `motion/react`, Zod, Nodemailer. No GSAP in this repo.
- **Hosting:** Vercel for the app. The domain and mailbox stay at Namecheap/cPanel. Vercel Pro once commercial. The owner would eventually like to host the app on his own cPanel too; that's an open question to discuss with him (it needs "Setup Node.js App" and is usually slower). Until then, keep the code host-neutral: no Vercel-only APIs.
- **Data:** Supabase (`supabase/schema.sql`, table `pilot_requests`) via REST with the service role key, server only.
- **Email:** SMTP (works with the cPanel mailbox); Resend can replace it later via the same env vars.
- **Booking:** Cal.com or Calendly link in `NEXT_PUBLIC_BOOKING_URL`.
- **Analytics:** Umami (cookie-free, no banner) for visit counts and the funnel; Microsoft Clarity (heatmaps, recordings) loads only after the visitor clicks "Allow" in the consent prompt (`components/analytics.tsx`). Fire funnel events with `track()` from `lib/analytics.ts`: `demo_opened`, `demo_interaction`, `request_sent`. Any new tracking tool must be added to the privacy policy.
- **SEO:** `NEXT_PUBLIC_SITE_URL` is the live address (falls back to the Vercel URL). Every page sets its canonical link, language alternates and share image with `pageMeta()` from `lib/seo.ts`. The demo is `noindex`.
- **WhatsApp:** `WhatsAppLink` (`components/ui/whatsapp-link.tsx`) opens a chat with a ready message (farm name included when known) and fires `whatsapp_click`. Number in `NEXT_PUBLIC_WHATSAPP_NUMBER`, default +962 78 7016 351.
- **Outreach:** `docs/outreach-links.xlsx` builds personalised demo links with UTM tags. Umami strips `?farm=` but keeps `utm_*` (`stripFarm` in `lib/analytics.ts`).
- Everything degrades gracefully: with no env vars, form requests are logged to the server console.
- **Languages:** English and Arabic (RTL). All copy lives in `src/i18n/en.ts` and `src/i18n/ar.ts` (same shape, `{placeholder}` syntax, `fmt()` helper). `src/proxy.ts` (Next 16's renamed middleware) redirects `/` by browser language.
- **Brand name:** in `src/lib/site.ts` (`BRAND`) plus page titles in the dictionaries.

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
  - `scene.tsx` is R3F. Its Canvas uses `resize={{ offsetSize: true }}`, so CSS transforms never shrink it.
  - DOM labels are pinned to 3D points through `AnchorSink` (don't use drei `Html`; it broke under React 19).
- **Share images:** `app/api/og/route.tsx` (`next/og`). Its renderer, Satori, can't lay out Arabic by itself, so the `Words` helper places each word right to left at its measured width (`opentype.js`). Fonts are TTF files in `assets/fonts/`.
- **404 and error pages:** `[lang]/not-found.tsx` (reached through the `[lang]/[...missing]` catch-all) and `[lang]/error.tsx` share `components/ui/status-page.tsx`. They run in the browser, so their copy is in `src/i18n/status.ts`, not the main dictionaries. Next 16's error component gets `retry`, not `reset`.
- **Element ids:** don't give an element an id that matches a global the page uses (e.g. `id="clarity"`): browsers expose ids as `window` properties.
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
   - next: an end-to-end test once Vercel, Supabase, SMTP and Cal.com are connected.
2. **Validation (2–4 weeks):** the kit is in `docs/validation/`:
   - done: call script (`call-script.en.md`, `call-script.ar.md`, Modern Standard Arabic) with a scorecard;
   - done: 22 target farms in Jordan, the UAE and Saudi Arabia (`target-farms.md`, public sources; verify each is active), also prefilled in `docs/outreach-links.xlsx`;
   - done: WhatsApp, LinkedIn and email messages, EN/AR (`outreach-messages.md`);
   - pilot offer: setup in about two weeks, then 3 months free; in return a 20-minute feedback call every two weeks and permission to mention them (anonymously if they prefer);
   - Goal: about 10 calls, 5 who'd use it weekly (score 4–5 on the scorecard), 2 pilots.
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
- Contact email `info@mikdam.com`
- Founder section copy (a draft written for him: "I'm building Canopy because farm teams track so much…", "During the pilot you talk to me, not a support queue")
- Showing WhatsApp +962 78 7016 351 publicly (approved)
- Pilot terms in the call script and messages: "3 months free", "20-minute feedback call every two weeks" (chosen by the owner)
- Privacy policy: controller "Mikdam Qandil, an individual based in Amman, Jordan"; requests kept up to 12 months after last contact; data requests handled within 30 days (worth a quick review by a lawyer before launch)
