# Launch prep

Everything to get ready before the accounts and settings (environment variables) go in. Tick items as they're done.

**Who:** **You** means Mikdam; **Claude** means I draft it and you approve; **Both** means we work on it together.

Live preview: https://canopy-app-sand.vercel.app (no settings yet: requests go to the Vercel log only).

---

## A. Decisions that unlock the accounts

Do these first. Most of the later steps need the domain.

- [x] **A1. Final name** (Both). **Chosen: Lamina (لامينا)** (9 Oct 2026). It's Latin for "layer", and in botany the lamina is the blade of a leaf: stacked growing layers, and the leaf itself.
  - Earlier picks: "Canopy" was dropped (Canopii and Canobi are near-identical agtech names, Canopy Tax owns the software trademark, and Arabic has no "p"). "Thamra" was dropped too: English speakers misspell it, and it's a common word that's hard to own.
  - Known overlaps to check: Lamina Co. (a Saudi packaging company) and Lamina (a US LED maker). Neither is in farm software, but the LED one is close to grow lights.
  - Before renaming:
    - run a WIPO trademark search for "Lamina" (branddb.wipo.int, classes 9 and 42), and in Saudi Arabia (SAIP) and the UAE;
    - check that @lamina or a close handle is free on Instagram and LinkedIn.
  - If the plain name is crowded, use a short qualifier consistently (e.g. "Lamina Farm" or "Lamina Twin"), with the logo still showing "Lamina / لامينا".
  - The site gets renamed (in `src/lib/site.ts`, page titles, share images, emails and docs) once the domain is secured.
- [x] **A2. Domain** (You). **Bought: `laminafarm.app`** (9 Oct 2026). `.app` domains only work over HTTPS, which Vercel handles automatically.
- [ ] **A3. Mailbox on the domain** (You). Create `hello@laminafarm.app` at Namecheap (Private Email or cPanel email). The site sends from it, and visitors' replies arrive in it.
- [x] **A4. Contact email shown on the site** (You). Decided: `hello@laminafarm.app` everywhere (the site already uses it as the default).

## B. Content only you can give

- [ ] **B1. Founder photo** (You). Square, at least 800 × 800 px, with a plain or soft background. A friendly, natural photo works better than a studio portrait.
- [ ] **B2. Founder text** (You). Edit the draft on the landing page, in both English and Arabic. Change anything that doesn't sound like you.
- [ ] **B3. Promises on the site** (You). Confirm each one, or tell me what to change:
  - [ ] "We reply within one business day";
  - [ ] "Your twin goes live in about two weeks";
  - [ ] "Free for three months" for pilot farms;
  - [ ] "Your data is never shared or sold";
  - [ ] in return: a 2-minute feedback form every two weeks, and permission to mention the farm (anonymously if they prefer).
- [ ] **B4. Privacy policy facts** (You, ideally with a lawyer for 30 minutes):
  - controller: "Mikdam Qandil, an individual based in Amman, Jordan";
  - requests kept for 12 months after last contact;
  - data requests answered within 30 days.

## C. Things the site already promises (they must exist on day one)

- [ ] **C1. Setup checklist** (Claude; draft ready in [`launch-kit/setup-checklist.md`](launch-kit/setup-checklist.md), for you to review). The thank-you screen promises "a setup checklist". It's a short EN/AR document you send to each farm: what we need from them (layout photos, floors and racks, crops, sensors if any), and what happens in the two weeks.
- [ ] **C2. Demo video routine** (Claude drafts, You record; routine and scripts in [`launch-kit/demo-video.md`](launch-kit/demo-video.md)). We promise "a short video of your farm's demo" within a business day. This needs:
  - a 60–90 second script (EN and AR);
  - the demo link with their farm name and type;
  - a screen recorder (Loom, or macOS screen recording);
  - where to send it (WhatsApp or email).
- [ ] **C3. Feedback form** (Claude drafts the questions, You create it in Google Forms or Tally; questions in [`launch-kit/feedback-form.md`](launch-kit/feedback-form.md)). It replaces the calls: 5 short questions every two weeks, in EN and AR, based on the call script's scorecard.
- [ ] **C4. WhatsApp Business** on +962 78 7016 351 (Claude drafts, You set it up; texts in [`launch-kit/whatsapp-business.md`](launch-kit/whatsapp-business.md)):
  - business profile (name, short description, website, email);
  - greeting message;
  - away message (outside working hours);
  - 4–5 quick replies: "send your layout", "your demo video", "how the pilot works", "pricing after the pilot", "thank you".
- [ ] **C5. Working hours** (You). "One business day": which days and hours? For example, Sunday to Thursday, 9:00–17:00 Amman time. This goes in the away message and the FAQ.
- [ ] **C6. Answer to "what does it cost after the pilot?"** (You). The FAQ already says "we'll agree on pricing together before the pilot ends, and you can stop at any time", and the WhatsApp `/price` reply uses the same words. Confirm it, or give a range.

## D. Outreach readiness

- [x] **D1. Check the target farms** (Both). Done from search results on 8 Oct: see the "Verification" section in `target-farms.md`. There were 5 corrections, KACST was replaced with Estidamah and 5 new farms were added (27 in the sheet). Still to do: re-check the "Unclear" ones, and find a contact for each. Confirm each is still active (website, recent posts) and find a contact name and channel (`docs/validation/target-farms.md`).
- [ ] **D2. Check each farm's type** in `docs/outreach-links.xlsx`, so its demo opens as the right kind of farm (my guesses are pre-filled).
- [ ] **D3. Your LinkedIn profile** (You). Prospects will look you up. Add a line about the project and a link to the site.

## E. Then: accounts and settings

Step-by-step guide, with every click and the exact values: [`accounts-setup.md`](accounts-setup.md).

Once A is done, in this order (details in `.env.example`):

1. [ ] Vercel: connect the domain (Project → Settings → Domains), then set `NEXT_PUBLIC_SITE_URL`.
2. [ ] Namecheap DNS: add the Vercel records, plus SPF, DKIM and DMARC for the mailbox (so emails don't land in spam).
3. [ ] Supabase: create the project, run `supabase/schema.sql`, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
4. [ ] SMTP: set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` and `REQUESTS_NOTIFY_EMAIL`.
5. [ ] Umami: add the website, then set `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.
6. [ ] Clarity: create the project, then set `NEXT_PUBLIC_CLARITY_ID`.
7. [ ] Redeploy, then run an end-to-end test (Claude):
   - send a test request in EN and AR;
   - check both emails and the Supabase row;
   - check the events in Umami, and that no farm names appear there.
