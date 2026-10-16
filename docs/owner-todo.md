# What I need from Mikdam

One list of everything that's waiting on you. I update it every time something changes. Tick items off, or just tell me in chat and I'll tick them.

Last updated: 16 Oct 2026 (LinkedIn company page: full page texts in `docs/marketing/profiles.md`).

**The site is live at laminafarm.app.** Sections 1–3 are what stands between it and your first outreach. Sections 4–6 can follow.

## 1. This week

- [ ] **Send me your LinkedIn profile address** (for the author line on the guides and the About page).
- [ ] **Read the 13 guides on the live site** when you have time (laminafarm.app/en/learn and /ar/learn) and tell me any facts that don't match your experience, plus topics for the next guides. Company names are left out for now, as you asked.
- [ ] **Try the live site on your phone** and tell me anything that feels off:
  - the demo's guided tour (it starts after the welcome card; the **Tour** button replays it) and the toolbar that opens one panel at a time;
  - the header and ☰ menu on every page;
  - open a page, tap a link, then press Back: it should come back instantly (L8).
- [ ] **Send yourself a test request in Arabic** on your phone. Check both emails arrive and aren't in **Spam**, then try "Tell us more" on the thank-you screen and check you get the "More details: …" email.
- [ ] **Email trust records**, so your emails don't land in Spam: **SPF and DKIM** via cPanel → Email Deliverability → Repair, and **DMARC** in cPanel → Zone Editor (guide: `docs/accounts-setup.md`, phase 1).
- [ ] **Google Search Console and Bing Webmaster Tools:** follow **`docs/search-console.md`** (about 15 minutes). It covers adding the site, the TXT record in cPanel, sending the sitemap, and copying it all to Bing.

## 2. Before your first post or outreach message

- [ ] **Confirm the site's promises:**
  - reply within one business day;
  - set up in about two weeks;
  - free for 3 months;
  - "your data is never shared or sold";
  - the 2-minute feedback form every two weeks.
- [ ] **Review the content pages' wording** (live): Product, Solutions (4 farm types), Pilot, About, FAQ, in English and Arabic. Tell me anything that isn't true or doesn't sound like you.
- [ ] **Founder text:** edit my draft on the landing page (EN and AR) so it sounds like you.
- [ ] **Founder photo:** square, at least 800 × 800 px, plain or soft background.
- [ ] **Feedback form:** create it in Google Forms or Tally from `docs/launch-kit/feedback-form.md`, and send me the link.
- [ ] **WhatsApp Business** on +962 78 7016 351, using the texts in `docs/launch-kit/whatsapp-business.md`.
- [ ] **Privacy policy facts:** you as data controller; requests kept for 12 months; data requests answered within 30 days. Ideally a lawyer reads it for 30 minutes.

## 3. Accounts and settings

- [ ] **Google Analytics 4** (decided 15 Oct; the site is ready for it, PR #15):
  1. **analytics.google.com** → Create property "Lamina" (time zone Amman, currency USD) → **Web** data stream `https://laminafarm.app`.
  2. Copy the **Measurement ID** (`G-…`, not secret) → GitHub → Settings → Secrets and variables → Actions → **Variables** → New: `NEXT_PUBLIC_GA_ID` → then Actions → cPanel package → Run workflow.
  3. In GA4 → Admin → **Custom definitions** → Create these event-scoped dimensions (name = parameter): `farm_type`, `country`, `lang`, `size_band`, `place`, `stage`.
  4. Admin → **Key events**: mark `generate_lead` (main), plus `whatsapp_click` and `demo_opened`.
  5. Admin → Data collection: keep **Google signals off**. Admin → Data retention: **14 months**.
  6. Admin → Product links → **Search Console** → link laminafarm.app (after the Search Console step above).
- [ ] **Umami:** add `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (and `NEXT_PUBLIC_UMAMI_SRC` if its script address isn't `https://cloud.umami.is/script.js`) under GitHub → Settings → Secrets and variables → Actions → **Variables**, then Actions → cPanel package → Run workflow. Then check Realtime shows you, Events shows `demo_opened`, and no farm names appear in page addresses.
- [ ] **Clarity:** Settings → Masking → **Strict** (hides all on-page text in recordings, so nobody's farm or contact details are ever recorded). The ID is already built in; don't paste Clarity's script anywhere.
- [ ] **Speed on a real phone:** open **https://pagespeed.web.dev**, test `laminafarm.app/en` and `laminafarm.app/en/demo`, and **send me the two result links**. My test machine can't measure real phone speed for the 3D pages.
- [ ] **Namecheap:** turn on **Withheld for Privacy** and **Auto-renew** for laminafarm.app.
- [ ] **Leave Vercel** (any time): delete the Vercel project (Settings → Advanced → Delete), remove the Vercel app from GitHub (GitHub → Settings → Applications → Vercel → Uninstall), then delete your Vercel account if you like. Its bot still comments on every PR until then.
- [ ] **Netlify stays staging only:** keep it for previews, and don't add the Supabase or email settings there, so test requests never reach your real inbox.

## 4. Marketing kit (guide: `docs/marketing/README.md`)

- [ ] **Look through the kit:** one-pager, banners, 5 posts and clips in `docs/marketing/`. Tell me what to change: wording, images, colours.
- [ ] Ask a native speaker to read the **Arabic** of posts 1 and 5 and the Arabic one-pager.
- [ ] **Your LinkedIn profile:** new banner, headline, a line about Lamina and the Featured link (texts in `docs/marketing/profiles.md`). Prospects will look you up.
- [ ] **Create the Lamina company page** on LinkedIn (walked through step by step in the marketing chat, 16 Oct):
  - [x] Step 1, basics: name **Lamina**, address `linkedin.com/company/laminafarm`, website with UTM, industry **Software Development**, size **2–10**, type **Self-employed**, location **Amman, Jordan** (done 16 Oct). Still to do: tell me the LinkedIn address you actually got
  - [ ] Step 2, logo `social/logo-400.png` and the cover `social/linkedin-company-cover-en.jpg` (re-made at LinkedIn's new **4200 × 700** on 16 Oct; the Arabic one is `-ar.jpg`, kept for later)
  - [ ] Step 3, the rest of **Edit page → Details**: About, year founded (2026), phone, then the **Arabic** name, tagline and About via **Manage languages** (all texts in `profiles.md`; a language can't be removed once added)
  - [ ] Step 4, custom button (Visit website), 16 specialties, community hashtags if offered (all in `profiles.md`)
  - [ ] Step 5, link your profile, invite people, first 3 posts, 2-week plan
- [ ] **Post 1** once the promises in section 2 are confirmed, then one post every 2–3 days (`posts.md`).
- [ ] **Social handles:** grab @lamina / @laminafarm (or close) on Instagram and LinkedIn. Instagram posts can come later, with the same images and bio.

## 5. Outreach

- [ ] Re-check the "Unclear" farms in `docs/validation/target-farms.md` (iPlant, Emirates Hydroponics, VeggiTech, Bather, Mojan, Desert Agriculture).
- [ ] Find a contact name and channel for each farm, and check each farm's type in `docs/outreach-links.xlsx`.
- [ ] Record the first demo videos with `docs/launch-kit/demo-video.md`.

## 6. Later, or when you're ready

- [ ] **Trademark check** for "Lamina": WIPO Brand Database, classes 9 and 42 (plus Saudi Arabia's SAIP and the UAE if you can).
- [ ] **Logo:** the Lamina wordmark (EN + Arabic). The site uses the leaf mark plus "Lamina" in the brand font until then.
- [ ] **(On hold since 10 Oct) Landing images** (AI, photo-real, warm light): make the 6 images in `docs/image-brief.md` with your own tool (check it isn't from an Israeli company), and send them in chat. Start with 1 and 2, the hero background.

## Optional: let me test the live site myself

My cloud workspace can't open `laminafarm.app` or `*.netlify.app` (blocked by its network settings). To let me test the live site directly, open this cloud environment's settings (the environment menu in the session's title bar → Edit → Network access), then either add `laminafarm.app` and `netlify.app` to the allowed domains, or choose a broader access level. Without this, I test a local copy of the site, which is identical to the code you deploy.

---

## Done ✓

- [x] Hosting: live site on **your Namecheap hosting** (cPanel Node.js); Netlify for staging only; no Vercel (9 Oct)
- [x] Domain **laminafarm.app** bought; mailbox **hello@laminafarm.app** created in cPanel (10 Oct)
- [x] **Site live** on 10 Oct 🎉: Node.js app, FTP account `deploy@laminafarm.app` and the 3 GitHub secrets (every merge now publishes itself), NPM install, AutoSSL padlock on both addresses
- [x] **Supabase** project (Frankfurt) with `supabase/schema.sql`; server settings in cPanel (the 2 secret ones never shared in chat)
- [x] **Clarity** project created (ID `yv5sglt7cp`, built in)
- [x] First end-to-end test: a request from the live site arrived (10 Oct); `SMTP_HOST` fixed on the way
- [x] Working hours: Sunday to Thursday, 9:00–23:00 Amman time (10 Oct)
- [x] Pricing answer: "Free during the pilot. Before it ends we agree a price together, based on your farm's size. No surprises, no lock-in." (10 Oct)
- [x] Email designs approved (10 Oct)
- [x] Merged: PR #6 (rename, navigation, marketing kit), PR #12 (emails, short form), PR #13 (content pages, header), PR #14 (demo tour and toolbar), PR #15 (13 guides, new guide layout, GA4 support, sitemap) (16 Oct)
- [x] Growth plan approved; guide layout approved (16 Oct)
