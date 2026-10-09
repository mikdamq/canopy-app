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

### 4. Point the domain to Netlify (cPanel Zone Editor, 15 min)
We host on **Netlify** (decided 9 Oct 2026; no Vercel).
- [ ] Netlify → your site → **Domain management → Add a domain** → `laminafarm.app` → **Verify → Add domain**. When it offers **Netlify DNS**, don't use it: keep DNS where it is, so email keeps working. Netlify then shows "Awaiting External DNS" and the records it wants.
- [ ] cPanel → **Zone Editor** → `laminafarm.app` → **Manage**. Change only these two records:
  - the **A** record named `laminafarm.app.` → **Edit** → set it to Netlify's load balancer, `75.2.60.5` (use the address Netlify shows, if it differs);
  - the **www** record (`www.laminafarm.app.`) → make it a **CNAME** pointing to your Netlify address (`your-site-name.netlify.app`, shown in Netlify). If `www` is an A record now, delete it and add the CNAME.
- [ ] **Don't touch** the email records: `MX`, `mail`, `webmail`, `autodiscover`, `_dmarc`, `default._domainkey`, and the SPF TXT record. They keep pointing at your hosting, so email keeps working.
- [ ] Back in Netlify, wait until the domain shows as verified, then under **HTTPS** click **Verify DNS configuration / Provision certificate** if it hasn't started by itself (free, Let's Encrypt). `.app` domains only open over HTTPS, so the site appears once the certificate is issued (a few minutes to a few hours).
- [ ] Check: `https://laminafarm.app` opens Lamina with the padlock, and `https://www.laminafarm.app` jumps to it.

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
- [ ] Sign up at cloud.umami.is (the free Hobby plan is enough to start).
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

## Phase 3: settings in Netlify

Netlify → your site → **Site configuration → Environment variables → Add a variable**. For each one, keep **All scopes** and the **same value for all deploy contexts**. For the two secret ones, tick **Contains secret values** if Netlify offers it:

| Name | Value | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://laminafarm.app` (no slash at the end) | no |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@laminafarm.app` (also the default, so this one is optional) | no |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | the Umami Website ID (step 6) | no |
| `NEXT_PUBLIC_CLARITY_ID` | the Clarity Project ID (step 7) | no |
| `SUPABASE_URL` | the Supabase Project URL (step 5) | no |
| `SUPABASE_SERVICE_ROLE_KEY` | the service_role key (step 5) | **yes** |
| `SMTP_HOST` | the **Outgoing Server** from cPanel → Email Accounts → Connect Devices (step 2) | no |
| `SMTP_PORT` | `465` | no |
| `SMTP_USER` | `hello@laminafarm.app` | no |
| `SMTP_PASS` | the mailbox password | **yes** |
| `MAIL_FROM` | `Lamina <hello@laminafarm.app>` | no |
| `REQUESTS_NOTIFY_EMAIL` | where you want new requests: `hello@laminafarm.app` (the default), or your Gmail | no |

Leave out `NEXT_PUBLIC_WHATSAPP_NUMBER` (it already defaults to your number) and `NEXT_PUBLIC_BOOKING_URL` (no calls).

- [ ] Then **Deploys → Trigger deploy → Deploy site**. Settings only take effect after a new deploy.

---

## Phase 4: tell me, and I'll finish

Send me the Umami ID and the Clarity ID, and say "settings are in". (The rename to Lamina is already done.) Then I'll:
1. Run the end-to-end test:
   - a request in English and in Arabic, on desktop and phone;
   - check both emails arrive (not in spam), and that the row appears in Supabase;
   - check the events in Umami, and that **no farm names** show there;
   - check that Clarity loads only after "Allow".
2. Fix anything that comes up, and mark launch prep section E as done.
