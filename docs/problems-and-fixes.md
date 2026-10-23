# Problems we hit, and how we fixed them

A running log, newest first. Each entry says what we saw, why it happened, how we fixed it, and how to check or avoid it next time. Add an entry whenever something goes wrong and gets solved.

---

## The live site kept showing the old design (10–23 Oct 2026)

- **What we saw:** after the redesign was merged (PR #17, 19 Oct) and the badge fix (PR #18, 21 Oct), laminafarm.app still showed the design from launch day. The Netlify previews showed the new design. Restarting, and even stopping and starting the app in cPanel, changed nothing, and `?v=2` at the end of the address didn't help either.
- **What we ruled out, step by step:**
  - The upload: GitHub's log showed every file uploaded, and `BUILD.txt` on the server showed the newest version.
  - The restart: `stderr.log` showed the app really restarting after each upload.
  - Netlify or Vercel serving the domain: the site went down when the app was stopped, and the domain's A record (66.29.146.183) is the cPanel server.
  - LiteSpeed's page cache: the page headers had no LiteSpeed cache line. Instead they had `X-Nextjs-Cache: HIT`, so the app itself was serving a stored page.
- **The cause:** Next.js 16 saves its own copy of each page in the hidden folder `.next/server/route-cache` the first time someone visits it, and from then on prefers that copy over the new build. Our uploads replace the build but never touched that folder, so the server kept serving its 10 Oct copies forever. We reproduced it on a local copy: old copy plus new upload plus restart gave the old page; deleting the folder gave the new one.
- **The fix (PR #19):**
  - The site no longer saves those copies to disk (`experimental.isrFlushToDisk: false` in `next.config.ts`).
  - Every upload deletes `.next/server/route-cache` before restarting (`deploy/cpanel/publish.sh`).
  - One-time manual fix on the server: File Manager → show hidden files → `lamina/.next/server` → delete `route-cache` → Restart.
- **How to check next time:** open **laminafarm.app/build.txt**. It shows the version (commit) and build time the live site is running; compare it with the latest merge. If the version is new but pages look old, look for `route-cache` again.
- **Lesson:** after a merge, check the live site itself (build.txt or a page) instead of trusting that a successful upload means it's live.

## Lime highlight covered part of the Arabic heading above it (21 Oct 2026)

- **What we saw:** in "من نموذج مدته دقيقة إلى مزرعة حيّة", the lime badge hid the bottom of the line above it.
- **Cause:** the badge was a background painted on inline text. Arabic letters reach much further above and below the line than Latin ones, so the colour spilled over the neighbouring line.
- **Fix (PR #18):** the badge became an inline block (lines make room for it), and Arabic headings got more line height.
- **Avoid:** check every highlighted or coloured text in Arabic on a phone, where headings wrap onto more lines.

## Netlify didn't build a preview for PR #18 (21 Oct 2026)

- **What we saw:** the preview link said "Page not found"; Netlify posted nothing on the PR.
- **Likely cause:** Netlify skipped or paused builds (possibly the free monthly build limit). It built PR #19 normally on 23 Oct.
- **Workaround:** the code was checked with our own build and screenshots, then merged. It doesn't affect the live site, which doesn't use Netlify.

## My workspace can't open the live site or the Netlify previews

- **Why:** the cloud environment's network settings block those addresses.
- **Workaround:** the owner checks with screenshots, the page source or the browser's Network tab, which is how we found the route-cache problem.
- **Better:** allow `laminafarm.app` and `netlify.app` in the environment's settings (Edit → Network access → Allowed domains), so I can check the live site myself after each merge.

## The request form couldn't send emails (10 Oct 2026)

- **What we saw:** `[pilot-request] email: queryA EBADNAME laminafarm.app` in `stderr.log`.
- **Cause:** the `SMTP_HOST` setting in cPanel wasn't a valid mail server name.
- **Fix:** corrected `SMTP_HOST` in the app's settings in cPanel, then Restart.
- **Check:** `stderr.log` prints a `[lamina] started … settings: …=yes/no` line at each start, so a missing setting is easy to spot.

## "Cannot find module 'next'" in stderr.log (10 Oct 2026, first setup)

- **Cause:** the app was started before cPanel had installed its packages. Our package doesn't include `node_modules`, because cPanel refuses an uploaded one.
- **Fix:** Setup Node.js App → **Run NPM Install** → Restart. It's needed again only when the site's core packages change (GitHub shows a yellow warning when they do).

## The app tried to listen on the wrong address on cPanel (first setup)

- **Cause:** shared hosting sets `HOSTNAME` to the server's own name, and Next's server tries to bind to it.
- **Fix:** the startup file `deploy/cpanel/app.js` sets `HOSTNAME=0.0.0.0` before starting the server.

## Errors like "The Server Reference ID did not match" in stderr.log

- **Cause:** bots probing the site with fake requests. They're harmless, and real visitors never trigger them.

## Guide tables made phone pages scroll sideways (16 Oct 2026)

- **Fix:** the reading column is a grid with `minmax(0,1fr)` and `min-w-0`, so wide tables scroll inside their own box instead of widening the page.

## Batch codes broke across lines in Arabic (16 Oct 2026)

- **Fix:** non-breaking hyphens in codes like F3‑B12, so they stay on one line.

## The featured guide card hid behind the green band (16 Oct 2026)

- **Fix:** gave the card its own layer (`relative z-10`) so it sits above the band it overlaps.

## Earlier lessons, kept in CLAUDE.md as rules

- **Arabic letter-by-letter animation breaks the joins between letters:** animate whole words.
- **Share images can't lay out Arabic by themselves:** the `Words` helper places each word right to left.
- **drei's `Html` labels broke under React 19:** labels are pinned to 3D points with `AnchorSink`.
- **The 3D canvas shrank under CSS transforms:** the Canvas uses `resize={{ offsetSize: true }}`.
- **The request form jumped while switching steps:** scroll anchoring is off on that page.
- **An element id matching a global (like `id="clarity"`) broke a script:** browsers expose ids as `window` properties, so never reuse a global's name.
