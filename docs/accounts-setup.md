# Accounts and settings: step by step

Do these in order: each phase needs the one before it. Tick items as you go.

**Keep secrets safe.** Passwords and secret keys go straight into Netlify (and a password manager such as 1Password or Bitwarden). Never paste them into chat, email or WhatsApp. Only send me the non-secret values (marked *share* below).

Total time: about 2 hours, spread over a day (DNS changes can take up to a few hours to spread).

---

## Phase 1: domain and email (do first)

### 1. Buy the domain (Namecheap, 10 min)
- [x] Bought **laminafarm.app** (9 Oct 2026).
- [ ] In Namecheap, check that **Withheld for Privacy** (free WHOIS privacy) and **Auto-renew** are on.

Your setup (confirmed 9 Oct 2026): **Namecheap hosting with cPanel**, and the domain uses **Namecheap Web Hosting DNS**. So every DNS record is edited in **cPanel → Zone Editor**, not in Namecheap's "Advanced DNS" page. The website itself runs on Netlify; cPanel only keeps the email and the DNS.

### 2. Create the mailbox (cPanel, 10 min, included in your hosting)
- [ ] Namecheap → **Hosting List → Go to cPanel** → **Email Accounts → Create**.
- [ ] Address: `hello@laminafarm.app`. Generate a strong password and save it in your password manager. **Secret.**
- [ ] This is the address the site sends from, where replies arrive, and the public contact shown on the site (decided).
- [ ] Next to the new mailbox, click **Connect Devices**. Under **Secure SSL/TLS Settings**, note the **Outgoing Server** name and the **SMTP port** (usually `465`). The server is often your hosting server's name (like `server123.web-hosting.com`) rather than `mail.laminafarm.app`; use exactly what cPanel shows. You'll need it in phase 3.
- [ ] Open **Webmail** once and send yourself a test email.

### 3. Email trust records (cPanel, 10 min)
These stop your emails landing in spam.
- [ ] cPanel → **Email Deliverability** → find `laminafarm.app` → if it shows problems, click **Repair** (or **Manage**, then install the suggested **SPF** and **DKIM** records). Because your DNS is on the hosting, cPanel adds them for you.
- [ ] **DMARC:** cPanel → **Zone Editor** → `laminafarm.app` → **Manage → Add Record → TXT**. Name: `_dmarc.laminafarm.app.` Value: `v=DMARC1; p=none; rua=mailto:hello@laminafarm.app`.
- [ ] Test: send an email from `hello@` to a Gmail address. In Gmail, open **Show original**: SPF, DKIM and DMARC should all say **PASS** (it can take 1–2 hours after adding the records).

### 4. Put the site live on your hosting (30 min)
The live site runs on your **Namecheap hosting** (cPanel → Setup Node.js App). Netlify is only for staging and previews. The domain already points at your hosting, so **no DNS changes are needed**.
- [ ] Follow **[`hosting-cpanel.md`](hosting-cpanel.md), Part 1**: create the Node.js app, upload the package GitHub builds, then Run NPM Install and Restart.
- [ ] cPanel → **SSL/TLS Status** → **Run AutoSSL** for `laminafarm.app` and `www`. This is the padlock; `.app` domains only open over HTTPS.

---

## Phase 2: services (any order)

### 5. Supabase: stores the form requests (15 min)
- [ ] Sign up at supabase.com (free plan).
- [ ] **New project.** Name: `lamina`. Database password: generate one and save it in your password manager. Region: **Central EU (Frankfurt)**, the closest to Jordan and the Gulf.
- [ ] When it's ready: **SQL Editor → New query**. Paste the whole of `supabase/schema.sql` from the repo, then click **Run**. It should say "Success".
- [ ] **Project Settings → API Keys:**
  - copy the **Project URL** (looks like `https://abcd.supabase.co`). *Share* it if you like; it isn't secret;
  - copy a **server key**: either a **Secret key** (starts with `sb_secret_`) from the API Keys tab, or the **service_role** key from the "Legacy API keys" tab (a long key starting with `eyJ`). Both work. **Secret:** it goes only into Netlify.
- [ ] Optionally, if your Netlify plan offers it: **Site configuration → Build & deploy → Functions region**, choose **Frankfurt (eu-central-1)**, so the site's server code and the database sit close together.

### 6. Umami: visit counts and the funnel (10 min)
- [ ] Sign up at cloud.umami.is (the free Hobby plan is enough to start). When asked for a data region, choose **Europe (EU)**, the same region as Supabase.
- [ ] **Settings → Websites → Add website.** Name: Lamina. Domain: `laminafarm.app` (without https).
- [ ] Open the website → **Edit → Tracking code**. Copy the **Website ID** (looks like `a1b2c3d4-…`). *Share:* it isn't secret.

### 7. Microsoft Clarity: heatmaps and recordings, only for visitors who click "Allow" (10 min)
- [ ] Sign in at clarity.microsoft.com (a Microsoft or Google account).
- [ ] **New project.** Name: Lamina. Website: `https://laminafarm.app`.
- [ ] When it offers to install, choose **"Install manually"**, then copy only the **Project ID** (about 10 characters; also under Settings → Overview). *Share:* it isn't secret. Don't paste Clarity's code anywhere: the site already loads it, and only after consent.
- [ ] Settings → **Masking: Strict** (hides form text in recordings).

### 8. WhatsApp Business (20 min, no Netlify setting)
- [ ] Install **WhatsApp Business** on the phone with +962 78 7016 351. Your chats move over.
- [ ] Set up the profile, greeting, away message, quick replies and labels from `docs/launch-kit/whatsapp-business.md` (needs your working hours, launch prep C5).

---

## Phase 3: settings

Settings live in two places. The full table is in [`hosting-cpanel.md`](hosting-cpanel.md), Part 3.
- **Server settings, including the 2 secrets** (Supabase key, mailbox password): cPanel → **Setup Node.js App** → pencil → **Environment variables**. Then **Restart**.
  - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (step 5);
  - `SMTP_HOST`, `SMTP_PORT` (`465`), `SMTP_USER` (`hello@laminafarm.app`), `SMTP_PASS`, `MAIL_FROM` (`Lamina <hello@laminafarm.app>`) and `REQUESTS_NOTIFY_EMAIL` (step 2).
- **Public settings** (built into the pages): GitHub → repo **Settings → Secrets and variables → Actions → Variables**. Then rebuild (**Actions → cPanel package → Run workflow**) and publish.
  - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (step 6), plus `NEXT_PUBLIC_UMAMI_SRC` only if Umami's tracking code shows a different script address.
  - The Clarity ID (`yv5sglt7cp`) and the site address are already built in.
- **Netlify (staging):** leave out the Supabase and email settings, so test requests from previews never reach your real database or inbox.

Never paste the 2 secret values into chat, GitHub or WhatsApp.

---

## Phase 4: tell me, and I'll finish

Send me the Umami ID and the Clarity ID, and say "settings are in". (The rename to Lamina is already done.) Then I'll:
1. Run the end-to-end test:
   - a request in English and in Arabic, on desktop and phone;
   - check both emails arrive (not in spam), and that the row appears in Supabase;
   - check the events in Umami, and that **no farm names** show there;
   - check that Clarity loads only after "Allow".
2. Fix anything that comes up, and mark launch prep section E as done.
