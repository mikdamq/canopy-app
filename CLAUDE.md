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
- **Hosting:** Vercel for the app. The domain and mailbox stay at Namecheap/cPanel (don't recommend cPanel for hosting the app). Vercel Pro once commercial.
- **Data:** Supabase (`supabase/schema.sql`, table `pilot_requests`) via REST with the service role key, server only.
- **Email:** SMTP (works with the cPanel mailbox); Resend can replace it later via the same env vars.
- **Booking:** Cal.com or Calendly link in `NEXT_PUBLIC_BOOKING_URL`.
- Everything degrades gracefully: with no env vars, form requests are logged to the server console.
- **Languages:** English and Arabic (RTL). All copy lives in `src/i18n/en.ts` and `src/i18n/ar.ts` (same shape, `{placeholder}` syntax, `fmt()` helper). `src/proxy.ts` (Next 16's renamed middleware) redirects `/` by browser language.
- **Brand name:** in `src/lib/site.ts` (`BRAND`) plus page titles in the dictionaries.

## Design and code rules

- **This is Next.js 16:** APIs differ from older versions. Check `node_modules/next/dist/docs/` before using a Next API you're unsure of. `middleware` is now `proxy.ts`.
- **Palette:** tokens in `src/app/globals.css`: ink `#141b2b`, green `#2e9e5b`, LED pink `#ff4fd8`, cool off-white ground. Fonts: Bricolage Grotesque (display), IBM Plex Sans/Mono, IBM Plex Sans Arabic.
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
- **Before committing:** run `pnpm lint` and `pnpm build`, and check desktop and phone, in English and Arabic.

## Roadmap

1. **Launch essentials (next):**
   - privacy policy page (EN/AR), since we collect name, email and phone;
   - cookie-free analytics with funnel events (landing → demo opened → demo interaction → request sent);
   - Open Graph share image, favicon and SEO metadata;
   - an end-to-end test once Vercel, Supabase, SMTP and Cal.com are connected.
2. **Validation (2–4 weeks):**
   - call script (EN/AR);
   - a list of about 20 target farms;
   - LinkedIn and WhatsApp outreach messages with personalised demo links.
   - Goal: about 10 calls, 5 who'd use it weekly, 2 pilots.
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
