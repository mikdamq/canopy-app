# What I need from Mikdam

One list of everything that's waiting on you. I update it every time something changes. Tick items off, or just tell me in chat and I'll tick them.

Last updated: 9 Oct 2026.

## 1. Right now

- [ ] **Merge PR #6** (Lamina rename + launch docs): https://github.com/mikdamq/canopy-app/pull/6. Then Lamina goes live on your Vercel address.
- [x] Review the navigation fix plan: approved ("go"), and built in PR #6.
- [ ] **Try the new navigation on your phone** (Vercel preview of PR #6): the header stays while you scroll, and the demo has a "Lamina" home link and a ☰ menu. Tell me anything that feels off.

## 2. Domain and email (guide: `docs/accounts-setup.md`, phase 1)

- [x] Buy the domain: **laminafarm.app**
- [ ] Turn on **Withheld for Privacy** and **Auto-renew** for laminafarm.app in Namecheap
- [ ] Create the mailbox **hello@laminafarm.app** (Namecheap Private Email or cPanel)
- [ ] Add the email trust records: **SPF, DKIM, DMARC** (Namecheap → Advanced DNS)
- [ ] Connect **laminafarm.app to Vercel** (Settings → Domains), then copy its records into Namecheap

## 3. Accounts (guide: `docs/accounts-setup.md`, phase 2)

- [ ] **Supabase:** create the project (Frankfurt) and run `supabase/schema.sql`
- [ ] **Umami:** add the website. *Send me the Website ID*
- [ ] **Clarity:** create the project and set masking to Strict. *Send me the Project ID*
- [ ] **WhatsApp Business** on +962 78 7016 351, using the texts in `docs/launch-kit/whatsapp-business.md`
- [ ] **Vercel settings:** add the 12 values in phase 3 of the guide, then **Redeploy**. Never paste the 2 secret ones into chat.
- [ ] Then tell me **"settings are in"**, and I'll run the end-to-end test
- [ ] Once laminafarm.app is live, open **https://pagespeed.web.dev**, test `laminafarm.app/en` and `laminafarm.app/en/demo`, and **send me the two result links**. My test machine can't measure real phone speed for the 3D pages

## 4. Decisions and answers

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

## 6. Outreach (when the site is live)

- [ ] Re-check the "Unclear" farms in `docs/validation/target-farms.md` (iPlant, Emirates Hydroponics, VeggiTech, Bather, Mojan, Desert Agriculture)
- [ ] Find a contact name and channel for each farm, and check each farm's type in `docs/outreach-links.xlsx`
- [ ] Record the first demo videos with `docs/launch-kit/demo-video.md`

## Optional: let me test the live site myself

My cloud workspace can't open `laminafarm.app` or `*.vercel.app` (blocked by its network settings). To let me test the live site directly, open this cloud environment's settings (the environment menu in the session's title bar → Edit → Network access), then either add `laminafarm.app` and `vercel.app` to the allowed domains, or choose a broader access level. Without this, I test a local copy of the site, which is identical to the code you deploy.
