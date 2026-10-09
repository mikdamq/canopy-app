# UX review, round 2: navigation and flow

Walkthrough on 9 Oct 2026, as a first-time visitor:
- **Pages:** landing, then the demo (welcome card, then the twin), then the request form, sent through to the thank-you screen; also privacy and 404.
- **Screens and languages:** desktop (1440 × 900) and phone (390 × 844), in English and Arabic.
- **Build:** a production build of the renamed site (Lamina).

Round 1 (F1–F25, `docs/ux-review/index.html`) is fully done. This round starts from the owner's own review: **"when you scroll down, the header disappears… inside the experience there's nothing that brings you back to the landing page."**

Status: ☐ to do · ◐ in progress · ☑ done (with the commit or PR)

---

## Priority 1: navigation (what the owner reported)

### N1 ☑ The landing header disappears as soon as you scroll down
**What happens:**
- The header at the top scrolls away with the page.
- A slim bar comes back **only when you scroll up**, and only after the hero.
- Reading down the page (which is what everyone does), there's no header at all.
- The landing page is 8 screens tall on desktop and 9.5 on a phone, so for most of the visit there's no navigation and no "Request a pilot" button in view.
- Measured: at every scroll position going down, the header is off-screen and the slim bar is hidden (desktop and phone, English and Arabic).

**Fix:** one header that **stays visible all the time**.
- At the top: the full header, transparent.
- After about 40 px of scrolling: it shrinks to a compact bar with a frosted background and a hairline border, keeping the same links, "Request a pilot" and the language switch.
- On phones: the logo, "Request a pilot" (short label) and the menu button.
- No hide-on-scroll-down.
- Respect reduced motion: no slide, just a background fade.

### N2 ☑ The slim bar sometimes doesn't come back
On Arabic desktop, scrolling up 200 px left the bar still off-screen, while English showed it. This goes away with N1, since we replace the slide-in bar.

### N3 ☑ The demo has no clear way back to the site
**What happens:** the only link home is the small leaf icon in the demo's top bar. It has no label, so most people won't know it's clickable. There are no links to How it works, Pilot or FAQ, and no menu.

**Fix:**
- In the demo's top bar, make the logo **"Lamina" with the leaf**, linking home.
- Add a **menu button** (☰) that opens the same sheet as the landing page: Home, How it works, Pilot, FAQ, Request a pilot, WhatsApp, Privacy.
- On desktop, add a quiet "← Back to site" text link next to the logo.

### N4 ☑ On phones, the demo's top bar scrolls away
**What happens:** on a phone the demo is a tall stacked page (the 3D view, then the cards). The top bar (farm name, clock, language) sits on the 3D view and scrolls away with it. Below the 3D view, only the green "Get this for my farm" bar at the bottom stays.

**Fix:**
- Keep a compact top bar (logo, farm name, ☰) sticky on phones.
- Or add the ☰ menu to the fixed bottom bar, beside "Get this for my farm".

**Recommended:** the sticky compact top bar, so it matches the rest of the site.

### N5 ☑ The request, privacy and 404 pages have a bare header, and it scrolls away
**What happens:**
- These pages show only the logo and the language switch.
- They have no section links and no menu, and the header doesn't stay on screen.
- The privacy page is long (about 6 screens), so once you're in it, there's no way out except scrolling back up.

**Fix:** use the **same sticky header as N1** on every page, so navigation is identical everywhere.
- **Request page:** keep it calmer, with a logo and "Back to site" on the left, and the language switch and ☰ menu on the right. Drop "Request a pilot", since you're already there.

### N6 ☑ After sending the form, switching language shows an empty form
**What happens:** on the thank-you screen, the language switch links to `/ar/request`, which opens a blank step 1 in Arabic. The "you're in" moment is lost.

**Fix:** after sending, the language switch keeps the thank-you screen, or links to the other language's landing page.

---

## Priority 2: content appearing late

### M1 ☑ Sections can look empty for a moment when you arrive by a link
**What happens:** jumping to a section (e.g. the footer's "Pilot" link to `#pilot`) and looking about 1 second later, the pilot card title and its lists were still blank, and the founder text showed "– – …". The reveal-on-scroll animations start late and run long.

This was on a slow test browser, so **check it on a real phone**. Either way, it's worth tightening.

**Fix:**
- Start reveals earlier (when a section is about 20% from the bottom of the screen).
- Make them shorter (0.4–0.5 s, small stagger).
- When the page opens straight on a section from a link, show that section at once, with no animation.

---

## Priority 3: small things noticed

- **P1 ☑** The phone landing menu (☰) is only in the top header today. Once N1 is done it's always reachable. Check the sheet still traps focus and closes on Escape.
- **P2 ☐ (kept as is)** The 404 page has only a logo. It fits on one screen and already has "Open the demo" and "Back to homepage" buttons, so it doesn't need the full header. Revisit if wanted.
- **P3 ☑** Run the round-1 checks again after the header change (skip link, language switch keeping your section, phone menu) to make sure nothing breaks.

---

## Done (9 Oct 2026, PR #6)

- **One header everywhere** (`components/ui/site-header.tsx`).
  - It's fixed and always visible: clear at the top of the page, a compact frosted bar after 40 px.
  - Desktop shows the section links, the language switch and "Request a pilot". Phones show a short "Request" button and the ☰ menu.
  - The request page uses a calmer version: "Back to site", the language switch and ☰.
  - The old slide-in bar is gone.
- **Menu sheet** (`components/ui/site-menu.tsx`): Home, Live demo, every section, Request a pilot, WhatsApp, the language switch and Privacy. It's drawn at the page root, so the frosted bars can't clip it, and the demo uses it too.
- **Demo:**
  - the home link reads "Lamina", with a divider before the farm name;
  - there's a ☰ menu;
  - on phones the top bar stays on screen (fixed) while you scroll the panels.
- **Section links** land below the header (`scroll-padding-top: 80px`). The request form scrolls its card below the header, and the privacy contents list sits below it.
- **After sending the form,** the language switch opens the other language's homepage.
- **Fade-ins** start a little before a section enters the screen, and run in 0.5–0.6 s instead of 0.8–0.9 s.
- **Checked:**
  - the header is visible at 5 scroll positions on the landing, privacy and request pages (desktop and phone, English and Arabic);
  - `#pilot` lands below the header;
  - the menus open and close with Escape;
  - in the demo there's a home link, the menu works, and the top bar stays on phones;
  - after sending, the language switch goes home;
  - no sideways scroll at 360 px;
  - all round-1 checks still pass, with no page errors.

## Fix order (one PR)

1. **N1 + N2 + N5:** a single sticky `SiteHeader` used on every page (the landing variant has section links; the request variant is calmer). Remove the separate slide-in `StickyBar`.
2. **N3 + N4:** demo navigation: a "Lamina" home link, a ☰ menu (reusing the landing sheet) and a sticky compact top bar on phones.
3. **N6:** the thank-you screen keeps its state across a language switch.
4. **M1:** faster, earlier reveals, with no animation when arriving by a link.
5. **Check:** desktop and phone, English and Arabic, every page: header visible at every scroll position, a way home from every screen, no sideways scroll at 360 px, reduced motion respected. Then the round-1 regression checks and screenshots for the owner.
