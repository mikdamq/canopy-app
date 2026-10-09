# Accounts and settings: step by step

Do these in order: each phase needs the one before it. Tick items as you go.

**Keep secrets safe.** Passwords and secret keys go straight into Vercel (and a password manager such as 1Password or Bitwarden). Never paste them into chat, email or WhatsApp. Only send me the non-secret values (marked *share* below).

Total time: about 2 hours, spread over a day (DNS changes can take up to a few hours to spread).

---

## Phase 1: domain and email (do first)

### 1. Buy the domain (Namecheap, 10 min)
- [x] Bought **laminafarm.app** (9 Oct 2026).
- [ ] In Namecheap, check that **Withheld for Privacy** (free WHOIS privacy) and **Auto-renew** are on.

### 2. Create the mailbox (Namecheap, 15 min)
Choose **one** of these:
- **Namecheap Private Email** (simplest; about $1–2 a month). Domain List → your domain → **Private Email** → Starter plan. It sets up the email DNS records for you.
- **cPanel email**, if you already have a Namecheap hosting plan: cPanel → Email Accounts → Create. Then add the domain's MX records as cPanel shows them.

Then:
- [ ] Create `hello@laminafarm.app`. This is the address the site sends from, and where replies arrive.
- [ ] This is also the public contact address shown on the site (decided).
- [ ] Note the email server settings (Private Email: `mail.privateemail.com`, port `465`; cPanel: `mail.laminafarm.app`, port `465`).
- [ ] Log in to webmail once and send yourself a test email.

### 3. Email trust records (Namecheap → Domain List → Manage → Advanced DNS, 15 min)
These stop your emails landing in spam.
- [ ] **SPF:** Private Email adds it automatically. Check that a TXT record on `@` contains `v=spf1 include:spf.privateemail.com ~all`. For cPanel, use the value cPanel → Email Deliverability shows.
- [ ] **DKIM:** Private Email → your mailbox dashboard → **DKIM** → copy the TXT record into Advanced DNS (host `default._domainkey`). For cPanel: Email Deliverability → DKIM → copy the record.
- [ ] **DMARC:** add a TXT record. Host: `_dmarc`. Value: `v=DMARC1; p=none; rua=mailto:hello@laminafarm.app`.
- [ ] Test: send an email from `hello@` to a Gmail address. In Gmail, open "Show original": SPF, DKIM and DMARC should all say **PASS**. (It can take 1–2 hours after adding the records.)

### 4. Connect the domain to Vercel (15 min)
- [ ] Vercel → project **canopy-app** → **Settings → Domains** → Add the domain (and `www.laminafarm.app`, set to redirect to the main one).
- [ ] Vercel shows the DNS records to add, usually an **A** record for `@` and a **CNAME** for `www`. Add them exactly as shown in Namecheap → Advanced DNS. Remove any old "parking page" or "URL redirect" records on `@` and `www`. Don't touch the email records.
- [ ] Wait until Vercel shows **Valid configuration** (a few minutes to a few hours). Then `https://laminafarm.app` opens the site, with the padlock.

---

## Phase 2: services (any order)

### 5. Supabase: stores the form requests (15 min)
- [ ] Sign up at supabase.com (free plan).
- [ ] **New project.** Name: `lamina`. Database password: generate one and save it in your password manager. Region: **Central EU (Frankfurt)**, the closest to Jordan and the Gulf.
- [ ] When it's ready: **SQL Editor → New query**. Paste the whole of `supabase/schema.sql` from the repo, then click **Run**. It should say "Success".
- [ ] **Project Settings → API Keys:**
  - copy the **Project URL** (looks like `https://abcd.supabase.co`). *Share* it if you like; it isn't secret;
  - copy the **service_role** key from the **"Legacy API keys"** tab (a long key starting with `eyJ`). **Secret:** it goes only into Vercel.
- [ ] Optionally, in Vercel → Settings → Functions → Region, choose **Frankfurt (fra1)**, so the site and the database sit close together.

### 6. Umami: visit counts and the funnel (10 min)
- [ ] Sign up at cloud.umami.is (the free Hobby plan is enough to start).
- [ ] **Settings → Websites → Add website.** Name: Lamina. Domain: `laminafarm.app` (without https).
- [ ] Open the website → **Edit → Tracking code**. Copy the **Website ID** (looks like `a1b2c3d4-…`). *Share:* it isn't secret.

### 7. Microsoft Clarity: heatmaps and recordings, only for visitors who click "Allow" (10 min)
- [ ] Sign in at clarity.microsoft.com (a Microsoft or Google account).
- [ ] **New project.** Name: Lamina. Website: `https://laminafarm.app`.
- [ ] When it offers to install, choose **"Install manually"**, then copy only the **Project ID** (about 10 characters; also under Settings → Overview). *Share:* it isn't secret. Don't paste Clarity's code anywhere: the site already loads it, and only after consent.
- [ ] Settings → **Masking: Strict** (hides form text in recordings).

### 8. WhatsApp Business (20 min, no Vercel setting)
- [ ] Install **WhatsApp Business** on the phone with +962 78 7016 351. Your chats move over.
- [ ] Set up the profile, greeting, away message, quick replies and labels from `docs/launch-kit/whatsapp-business.md` (needs your working hours, launch prep C5).

---

## Phase 3: settings in Vercel

Vercel → canopy-app → **Settings → Environment Variables**. Add each one with **Production** and **Preview** ticked:

| Name | Value | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://laminafarm.app` (no slash at the end) | no |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@laminafarm.app` (also the default, so this one is optional) | no |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | the Umami Website ID (step 6) | no |
| `NEXT_PUBLIC_CLARITY_ID` | the Clarity Project ID (step 7) | no |
| `SUPABASE_URL` | the Supabase Project URL (step 5) | no |
| `SUPABASE_SERVICE_ROLE_KEY` | the service_role key (step 5) | **yes** |
| `SMTP_HOST` | `mail.privateemail.com` (or `mail.laminafarm.app` for cPanel) | no |
| `SMTP_PORT` | `465` | no |
| `SMTP_USER` | `hello@laminafarm.app` | no |
| `SMTP_PASS` | the mailbox password | **yes** |
| `MAIL_FROM` | `Lamina <hello@laminafarm.app>` | no |
| `REQUESTS_NOTIFY_EMAIL` | where you want new requests: `hello@laminafarm.app` (the default), or your Gmail | no |

Leave out `NEXT_PUBLIC_WHATSAPP_NUMBER` (it already defaults to your number) and `NEXT_PUBLIC_BOOKING_URL` (no calls).

- [ ] Then **Deployments → the latest one → ⋯ → Redeploy**. Settings only take effect after a redeploy.

---

## Phase 4: tell me, and I'll finish

Send me the domain, the Umami ID and the Clarity ID, and say "settings are in". Then I'll:
1. Rename the site from Canopy to **Lamina**: logo text, titles, share images, emails and docs.
2. Run the end-to-end test:
   - a request in English and in Arabic, on desktop and phone;
   - check both emails arrive (not in spam), and that the row appears in Supabase;
   - check the events in Umami, and that **no farm names** show there;
   - check that Clarity loads only after "Allow".
3. Fix anything that comes up, and mark launch prep section E as done.
