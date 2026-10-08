# Canopy (working name)

A live 3D twin of a vertical farm, built to test the product with real farm owners.

**Visitor flow**

1. **Landing page** (`/en`, `/ar`): explains the product, runs the 3D farm live, and asks for the visitor's farm name.
2. **Personalised demo** (`/en/demo?farm=Green%20Valley`): the full interactive twin, carrying their farm name, on sample data. A "Get this for my farm" button is always visible.
3. **Pilot request** (`/en/request`): a 3-step form (about you, your farm, your goals). Each request is **saved to the database** and **emailed** to you, the visitor gets a confirmation email in their language, and then a **What's next** screen asks for layout photos on WhatsApp. There are no calls.

English and Arabic (right-to-left) are both supported. Visitors to `/` are sent to the language their browser prefers.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · React Three Fiber · Motion · Zod · Nodemailer.

## Run it locally

```bash
pnpm install
cp .env.example .env.local   # optional, see below
pnpm dev                     # http://localhost:3000
pnpm lint
pnpm build
```

Without any environment variables everything still works: form submissions are printed in the terminal.

## Configuration

All settings are environment variables (see `.env.example`).

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The live address. Used for share previews, canonical links and the sitemap. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the footer and error messages. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Number for the WhatsApp buttons (defaults to +962 78 7016 351; empty hides them). |
| `NEXT_PUBLIC_BOOKING_URL` | Optional Cal.com or Calendly link. If set, the thank-you screen shows a small "Prefer to talk? Pick a time" link. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Where requests are saved. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Email sending. Your cPanel mailbox works. |
| `REQUESTS_NOTIFY_EMAIL` | Who receives new requests (defaults to the contact email). |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SRC` | Cookie-free visit counts and funnel events. |
| `NEXT_PUBLIC_CLARITY_ID` | Heatmaps and session recordings, only after the visitor allows it. |

### 1. Database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste `supabase/schema.sql`, and click **Run**.
3. In **Project Settings → API**, copy the **Project URL** into `SUPABASE_URL` and the **service_role** key into `SUPABASE_SERVICE_ROLE_KEY`. Keep the service key secret: it only lives on the server.
4. New requests appear in **Table Editor → pilot_requests**. Use the `status` column to track them (`new`, `contacted`, `call_booked`, `pilot`, `declined`).

### 2. Email (your cPanel mailbox)

1. In cPanel, open **Email Accounts** and create a mailbox, e.g. `hello@yourdomain.com`.
2. Click **Connect Devices** next to it to see the SMTP server (usually `mail.yourdomain.com`, port `465`).
3. Fill in `SMTP_HOST`, `SMTP_PORT=465`, `SMTP_USER` (the full address), `SMTP_PASS`, and `MAIL_FROM`.

You can switch to a service like Resend later by changing these values (Resend also offers SMTP).

### 3. Booking (optional)

There are no calls in the flow. If you ever want to offer one, put a Cal.com or Calendly link in `NEXT_PUBLIC_BOOKING_URL`: the thank-you screen then shows a small "Prefer to talk? Pick a time" link. Leave it empty otherwise.

### 4. Analytics

**Umami** counts visits without cookies, so it needs no consent banner.

1. Create a free account at [cloud.umami.is](https://cloud.umami.is) and add your website (your domain).
2. Copy the **Website ID** into `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.
3. The funnel is tracked for you. Page views on `/en` or `/ar` are the landing step, then these events:
   - `demo_opened`: the demo loaded (`named` says whether a farm name was given);
   - `demo_interaction`: the first click, tap or key press inside the demo after the welcome card;
   - `request_step` (`step` 2 or 3) and `request_error` (`step`, `field`): progress and problems in the request form;
   - `request_sent`: a pilot request went through (`source` is `landing` or `demo`);
   - `whatsapp_click`: someone opened WhatsApp (`place` says which button: `landing`, `founder`, `footer`, `request` or `demo`).
4. In Umami, open **Reports → Funnel** and add the steps: page `/en` (or `/ar`), then `demo_opened`, `demo_interaction`, `request_sent`.

The farm name in `?farm=` is removed before anything is sent to Umami (`stripFarm` in `src/lib/analytics.ts`), while campaign tags (`utm_source`, `utm_campaign`, `utm_content`) are kept. After connecting Umami, open one demo link and check in Umami that no farm name appears.

**Validation kit:** `docs/validation/` has the call script (English and Arabic), outreach messages for WhatsApp, LinkedIn and email, and a researched list of 22 target farms.

**Outreach links:** `docs/outreach-links.xlsx` builds a personalised demo link, a ready message (EN/AR) and a one-tap WhatsApp link for each farm you contact. Import it into Google Sheets (File → Import → Upload). Each link carries `utm_source` (channel), `utm_campaign` (round) and `utm_content` (row number, never the farm name).

**Microsoft Clarity** (heatmaps and recordings) sets cookies, so it only loads after the visitor clicks **Allow** in a small prompt. Visitors can change their choice from **Cookie settings** in the footer.

1. Create a project at [clarity.microsoft.com](https://clarity.microsoft.com) and copy the **Project ID** into `NEXT_PUBLIC_CLARITY_ID`.
2. In Clarity, open **Settings → Masking** and keep it on **Balanced** or **Strict**. The request form is also marked so Clarity never records what people type.

If you add or swap an analytics tool, update the privacy policy (`privacy` in `src/i18n/en.ts` and `ar.ts`).

## Share previews and SEO

- Links to `/en` and `/ar` show a branded preview image. Personalised demo links (`/en/demo?farm=Green%20Valley`) show the farm's own name, which helps outreach messages stand out. The images are drawn by `src/app/api/og/route.tsx`.
- Favicon: `src/app/icon.svg` and `src/app/apple-icon.png`.
- `robots.txt` and `sitemap.xml` are generated. The demo is left out of search results, since every farm name makes a new address.
- Set `NEXT_PUBLIC_SITE_URL` once you have the domain, so previews and links point to it.
- To check a preview before sharing, paste a link into [opengraph.xyz](https://www.opengraph.xyz) or LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/).

## Deploy (Vercel + Namecheap domain)

cPanel shared hosting is built for PHP sites and can't run this app reliably. Keep the domain and mailbox at Namecheap and host the app on Vercel:

1. Push this repo to GitHub, then on [vercel.com](https://vercel.com) choose **Add New → Project** and import it. The defaults are correct.
2. Add the environment variables from `.env.example` under **Settings → Environment Variables**, then redeploy.
3. In Vercel, open **Settings → Domains** and add `yourdomain.com` and `www.yourdomain.com`. Vercel shows the DNS records to create.
4. In Namecheap, open **Domain List → Manage → Advanced DNS** and add those records (usually an **A record** for `@` pointing to Vercel's IP and a **CNAME** for `www` pointing to `cname.vercel-dns.com`). **Don't touch the MX records**, so your cPanel email keeps working.
5. Wait for DNS to update (minutes to a few hours). Vercel issues the HTTPS certificate automatically.

Note: Vercel's free Hobby plan is for non-commercial use. Once this is a business, use the Pro plan.

## Project structure

```
src/
  proxy.ts                     Sends / to /en or /ar
  app/[lang]/page.tsx          Landing page
  app/[lang]/demo/page.tsx     Personalised demo
  app/[lang]/request/page.tsx  Pilot request form
  app/[lang]/privacy/page.tsx  Privacy policy
  app/[lang]/not-found.tsx     Branded 404 (error.tsx: the "something went wrong" page)
  app/api/requests/route.ts    Saves and emails requests
  app/api/og/route.tsx         Share preview images
  app/robots.ts, sitemap.ts    For search engines
  components/analytics.tsx     Umami, Clarity and the consent prompt
  lib/analytics.ts             track() for funnel events
  lib/seo.ts                   Canonical links, language alternates and share tags
  components/twin/             3D farm: sim.ts (model), scene.tsx (3D), twin-app.tsx (dashboard)
  components/landing/          Hero 3D and the farm-name field
  components/request/          The form
  i18n/en.ts, i18n/ar.ts       All copy, in English and Arabic
  lib/request-schema.ts        Form fields and validation (shared by browser and server)
  lib/site.ts                  Product name and site settings
supabase/schema.sql            Database table for requests
assets/fonts/                  Fonts for the share images (SIL Open Font License)
```

## Renaming the product

The name lives in `src/lib/site.ts` (`BRAND`) and in the page titles and share image text (`meta`) in `src/i18n/en.ts` and `src/i18n/ar.ts`. The privacy policy uses `BRAND` automatically.
