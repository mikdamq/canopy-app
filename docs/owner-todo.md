# What I need from Mikdam

One list of everything that's waiting on you. I update it every time something changes. Tick items off, or just tell me in chat and I'll tick them.

Last updated: 9 Oct 2026 (PR #6 merged; email and DNS steps set for your cPanel hosting).

**The minimum for a safe launch is sections 1–4.** Sections 5–7 can follow.

## 1. Right now

- [x] **Merge PR #6** (Lamina rename, navigation, marketing kit, Netlify switch): merged 9 Oct 2026.
- [x] Review the navigation fix plan: approved ("go"), and built in PR #6.
- [ ] **Try the new navigation on your phone** (the Netlify "Deploy Preview" link on PR #6): the header stays while you scroll, and the demo has a "Lamina" home link and a ☰ menu. Tell me anything that feels off.
- [x] Hosting decision: **Netlify**, no Vercel (9 Oct 2026)
- [ ] **Netlify:** check that the site deploys from `main` (Site configuration → Build & deploy → Branches: production branch `main`). It picks up `netlify.toml` from the repo
- [ ] **Leave Vercel** once Netlify is live with your domain: delete the Vercel project (Settings → Advanced → Delete), remove the Vercel app from GitHub (GitHub → Settings → Applications → Vercel → Uninstall), then delete your Vercel account if you like

## 2. Domain and email (guide: `docs/accounts-setup.md`, phase 1)

- [x] Buy the domain: **laminafarm.app**
- [ ] Turn on **Withheld for Privacy** and **Auto-renew** for laminafarm.app in Namecheap
- [ ] Create the mailbox **hello@laminafarm.app** in **cPanel → Email Accounts** (included in your hosting), and note the outgoing server from **Connect Devices**
- [ ] Add the email trust records: **SPF and DKIM** via cPanel → Email Deliverability → Repair, and **DMARC** in cPanel → Zone Editor
- [ ] **On hold:** pointing laminafarm.app to the live host. Netlify is staging only, so **don't point the domain to Netlify**. Waiting on the production hosting decision (see section 4)

## 3. Accounts (guide: `docs/accounts-setup.md`, phase 2)

- [ ] **Supabase:** create the project (Frankfurt) and run `supabase/schema.sql`
- [ ] **Umami:** sign up and choose the **Europe (EU)** region (same region as Supabase), add the website. *Send me the Website ID*
- [x] **Clarity:** project created, Project ID `yv5sglt7cp` (not secret). Still to do: set **Masking: Strict** in Clarity, and add `NEXT_PUBLIC_CLARITY_ID` = `yv5sglt7cp` in Netlify. Don't paste Clarity's script anywhere: the site already has it, behind the "Allow" prompt
- [ ] **WhatsApp Business** on +962 78 7016 351, using the texts in `docs/launch-kit/whatsapp-business.md`
- [ ] **Netlify settings:** add the 12 values in phase 3 of the guide (Site configuration → Environment variables), then **Trigger deploy**. Never paste the 2 secret ones into chat.
- [ ] Then tell me **"settings are in"**, and I'll run the end-to-end test
- [ ] Once laminafarm.app is live, open **https://pagespeed.web.dev**, test `laminafarm.app/en` and `laminafarm.app/en/demo`, and **send me the two result links**. My test machine can't measure real phone speed for the 3D pages

## 4. Decisions and answers

- [ ] **Production hosting:** where the live site runs (Netlify is staging only). Likely your Namecheap hosting; Claude needs your plan name and whether cPanel shows **Setup Node.js App**

- [ ] **Working hours** for "one business day" (e.g. Sun–Thu, 9:00–17:00 Amman). Used in the WhatsApp away message and the FAQ
- [ ] **Pricing answer:** is "we'll agree on pricing together before the pilot ends" right? Or give a range
- [ ] **Confirm the site's promises:**
  - reply within one business day;
  - set up in about two weeks;
  - free for 3 months;
  - "your data is never shared or sold";
  - the 2-minute feedback form every two weeks.
- [ ] **Privacy policy facts:** you as data controller; requests kept for 12 months; data requests answered within 30 days. Ideally a lawyer reads it for 30 minutes
- [ ] **Trademark check** for "Lamina": WIPO Brand Database, classes 9 and 42 (plus Saudi Arabia's SAIP and the UAE if you can)
- [ ] **Social handles:** grab @lamina / @laminafarm (or close) on Instagram and LinkedIn

## 5. Content only you can give

- [ ] **Founder photo:** square, at least 800 × 800 px, plain or soft background
- [ ] **Founder text:** edit my draft on the landing page (EN and AR) so it sounds like you
- [ ] **Logo:** the Lamina wordmark (EN + Arabic), when you're ready. The site uses the leaf mark plus "Lamina" in the brand font until then
- [ ] **Feedback form:** create it in Google Forms or Tally from `docs/launch-kit/feedback-form.md`, and send me the link
- [ ] **LinkedIn profile:** add a line about Lamina and the site link (prospects will look you up)

## 6. Marketing kit (guide: `docs/marketing/README.md`)

- [ ] **Look through the kit:** one-pager, banners, 5 posts and clips in `docs/marketing/`. Tell me what to change: wording, images, colours
- [ ] Ask a native speaker to read the **Arabic** of posts 1 and 5 and the Arabic one-pager
- [ ] **Your LinkedIn profile:** new banner, headline and Featured link (texts in `docs/marketing/profiles.md`)
- [ ] **Create the Lamina company page** on LinkedIn: logo, cover, tagline and About (all in `profiles.md`)
- [ ] **Post 1** once laminafarm.app is live and the promises are confirmed, then one post every 2–3 days (`posts.md`)
- [ ] Instagram @laminafarm later, with the same images and bio

## 7. Outreach (when the site is live)

- [ ] Re-check the "Unclear" farms in `docs/validation/target-farms.md` (iPlant, Emirates Hydroponics, VeggiTech, Bather, Mojan, Desert Agriculture)
- [ ] Find a contact name and channel for each farm, and check each farm's type in `docs/outreach-links.xlsx`
- [ ] Record the first demo videos with `docs/launch-kit/demo-video.md`

## Optional: let me test the live site myself

My cloud workspace can't open `laminafarm.app` or `*.netlify.app` (blocked by its network settings). To let me test the live site directly, open this cloud environment's settings (the environment menu in the session's title bar → Edit → Network access), then either add `laminafarm.app` and `netlify.app` to the allowed domains, or choose a broader access level. Without this, I test a local copy of the site, which is identical to the code you deploy.
