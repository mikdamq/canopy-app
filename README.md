# Canopy (working name)

A live 3D twin of a vertical farm, built to test the product with real farm owners.

**Visitor flow**

1. **Landing page** (`/en`, `/ar`): explains the product, runs the 3D farm live, and asks for the visitor's farm name.
2. **Personalised demo** (`/en/demo?farm=Green%20Valley`): the full interactive twin, carrying their farm name, on sample data. A "Get this for my farm" button is always visible.
3. **Pilot request** (`/en/request`): a 3-step form (about you, your farm, your goals). Each request is **saved to the database** and **emailed** to you, the visitor gets a confirmation email in their language, and then they can **book a call** in your calendar.

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
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the footer and error messages. |
| `NEXT_PUBLIC_BOOKING_URL` | Your Cal.com or Calendly link. Shown as an embedded calendar after the form. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Where requests are saved. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Email sending. Your cPanel mailbox works. |
| `REQUESTS_NOTIFY_EMAIL` | Who receives new requests (defaults to the contact email). |

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

### 3. Booking calls

Create a 30-minute event in [Cal.com](https://cal.com) or [Calendly](https://calendly.com) and put the link in `NEXT_PUBLIC_BOOKING_URL`. The visitor's name and email are passed along so they don't type them twice.

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
  app/api/requests/route.ts    Saves and emails requests
  components/twin/             3D farm: sim.ts (model), scene.tsx (3D), twin-app.tsx (dashboard)
  components/landing/          Hero 3D and the farm-name field
  components/request/          The form
  i18n/en.ts, i18n/ar.ts       All copy, in English and Arabic
  lib/request-schema.ts        Form fields and validation (shared by browser and server)
  lib/site.ts                  Product name and site settings
supabase/schema.sql            Database table for requests
```

## Renaming the product

The name lives in `src/lib/site.ts` (`BRAND`) and in the page titles in `src/i18n/en.ts` and `src/i18n/ar.ts`.
