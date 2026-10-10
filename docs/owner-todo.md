# What I need from Mikdam

One list of everything that's waiting on you. I update it every time something changes. Tick items off, or just tell me in chat and I'll tick them.

Last updated: 10 Oct 2026 (AutoSSL done; working hours and pricing answer decided).

**The minimum for a safe launch is sections 1–4.** Sections 5–7 can follow.

## 1. Right now

- [x] **Merge PR #6** (Lamina rename, navigation, marketing kit, Netlify switch): merged 9 Oct 2026.
- [x] Review the navigation fix plan: approved ("go"), and built in PR #6.
- [ ] **Try the new navigation on your phone** (the Netlify "Deploy Preview" link on PR #6): the header stays while you scroll, and the demo has a "Lamina" home link and a ☰ menu. Tell me anything that feels off.
- [x] Hosting decision: live site on **your Namecheap hosting** (cPanel Node.js); **Netlify** for staging only; no Vercel (9 Oct 2026)
- [ ] **Netlify (staging only):** keep it for previews. Don't add the Supabase or email settings there, so test requests never reach your real inbox
- [x] **Review the new email designs**: approved 10 Oct 2026 (green success header, signed "The Lamina team")
- [ ] **Merge the emails PR**, then send yourself one test request (English and Arabic) from laminafarm.app and check both emails, including on your phone
- [ ] **Leave Vercel** (any time now): delete the Vercel project (Settings → Advanced → Delete), remove the Vercel app from GitHub (GitHub → Settings → Applications → Vercel → Uninstall), then delete your Vercel account if you like

## 2. Domain and email (guide: `docs/accounts-setup.md`, phase 1)

- [x] Buy the domain: **laminafarm.app**
- [ ] Turn on **Withheld for Privacy** and **Auto-renew** for laminafarm.app in Namecheap
- [x] Create the mailbox **hello@laminafarm.app** in **cPanel → Email Accounts** (included in your hosting), and note the outgoing server from **Connect Devices** (created 10 Oct 2026)
- [ ] Add the email trust records: **SPF and DKIM** via cPanel → Email Deliverability → Repair, and **DMARC** in cPanel → Zone Editor
- [x] **Put the site live on your hosting:** live on 10 Oct 2026 🎉 follow `docs/hosting-cpanel.md` Part 1. No DNS changes needed; Netlify stays staging only
  - [x] Create the Node.js app (steps 1–2)
  - [x] Create the FTP account `deploy@laminafarm.app`, limited to the `lamina` folder, and add the 3 GitHub secrets (`FTP_SERVER` = `premium239.web-hosting.com`, the name on the server's certificate). Every merge now publishes itself
  - [x] Run the workflow once, then **Run NPM Install** → **Restart** (steps 3c and 5)
  - [x] **Run AutoSSL** (step 6), and check the padlock on https://laminafarm.app and https://www.laminafarm.app

## 3. Accounts (guide: `docs/accounts-setup.md`, phase 2)

- [x] **Supabase:** create the project (Frankfurt) and run `supabase/schema.sql`
- [ ] **Umami:** account made (EU). Add `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (and `NEXT_PUBLIC_UMAMI_SRC` if its script address isn't `https://cloud.umami.is/script.js`) under GitHub → Settings → Secrets and variables → Actions → **Variables**, then Actions → cPanel package → Run workflow. Then check Realtime shows you, Events shows `demo_opened`, and no farm names appear in page addresses
- [x] **Clarity:** project created, Project ID `yv5sglt7cp` (not secret). Still to do: Clarity → Settings → Masking → **Strict** (hides all on-page text in recordings, so nobody's farm or contact details are ever recorded); (the ID is already built into the site, nothing to add). Don't paste Clarity's script anywhere: the site already has it, behind the "Allow" prompt
- [ ] **WhatsApp Business** on +962 78 7016 351, using the texts in `docs/launch-kit/whatsapp-business.md`
- [x] **Settings:** the server ones (Supabase, email; 2 are secret) go in **cPanel → Setup Node.js App → Environment variables**, then Restart. The Umami ID goes in **GitHub → Settings → Secrets and variables → Actions → Variables**, then rebuild. Full table: `docs/hosting-cpanel.md` Part 3. Never paste the 2 secret ones into chat
- [x] End-to-end test (10 Oct 2026): a request from the live site arrived. On the way we fixed `SMTP_HOST` (it had a trailing space; now `premium239.web-hosting.com`, and the site ignores stray spaces since PR #11)
  - [ ] Still to try: one request in **Arabic** on your phone, and check the emails don't land in **Spam**
- [ ] Once laminafarm.app is live, open **https://pagespeed.web.dev**, test `laminafarm.app/en` and `laminafarm.app/en/demo`, and **send me the two result links**. My test machine can't measure real phone speed for the 3D pages

## 4. Decisions and answers

- [x] **Production hosting:** your Namecheap hosting, via cPanel → Setup Node.js App (decided 9 Oct 2026; it's available on your plan). Netlify is staging only

- [x] **Working hours:** Sunday to Thursday, 9:00–23:00 Amman time (10 Oct 2026). Filled into `docs/launch-kit/whatsapp-business.md`
- [x] **Pricing answer:** decide together (10 Oct 2026): "Free during the pilot. Before it ends we agree a price together, based on your farm's size. No surprises, no lock-in." Now in the FAQ and the WhatsApp `/price` reply
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

- [ ] **Landing images (AI, photo-real, warm light):** make the 6 images in `docs/image-brief.md` with your own tool (check it isn't from an Israeli company), and send them in chat. Start with 1 and 2, the hero background

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
