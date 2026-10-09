# Lamina marketing kit

Made 9 Oct 2026. LinkedIn first, bold tone, English and Arabic. Everything uses the site's own fonts, colours and 3D farm, so it matches the website.

## What's here

| Folder / file | What it is | Use it for |
|---|---|---|
| `one-pager/lamina-one-pager-en.pdf` / `-ar.pdf` | A4 one-page summary with a QR code to the live demo | Attach to WhatsApp and email outreach; print for visits and events |
| `one-pager/*.jpg` | The same page as an image | Send in WhatsApp, where people won't open a PDF |
| `social/` | LinkedIn banner, company cover, logo, Instagram avatar | Set up the profiles (see `profiles.md`) |
| `profiles.md` | Headline, tagline, About text and bios (EN/AR) | Copy and paste into LinkedIn and Instagram |
| `posts/` + `posts.md` | 5 launch posts: images and captions, EN/AR, each with its own tracked link | Post one every 2–3 days |
| `clips/` | 15-second square demo videos: one per farm type (EN) plus the tower in Arabic | Posts, WhatsApp status, and replies to "what does it look like?" |
| `source/` | The scripts that made all of this | Re-making the kit after design changes (see below) |

### The 5 posts
1. **Launch:** "Your farm, alive in 3D." on the night-time tower.
2. **Every kind of farm:** the four farm types side by side.
3. **Light recipes:** "Red + blue. Fastest growth per kWh."
4. **Seed to plate:** the real product screen.
5. **The pilot offer:** "3 months free."

### The clips
Each one is a 15-second, silent take on the sample farm "Green Valley":
- the overview at 5 pm, with the clock running into the evening;
- zooming into a floor;
- switching the light recipe to blue-heavy;
- zooming back out as the LEDs take over from the sun.

They have no sound and no captions, so they work muted in a feed. Add your own voice-over if you like (script ideas are in `docs/launch-kit/demo-video.md`).

## Before posting anything
- **The domain has to be live.** Every link and the QR codes point to `laminafarm.app`.
- **Confirm the promises** (owner to-do, section 4): "3 months free", "about two weeks" to set up, and the 2-minute feedback form every two weeks. The posts and the one-pager repeat them.
- **Check the Arabic.** It's Modern Standard Arabic, written to read naturally. Have a native speaker read posts 1 and 5 once.

## Tracking
Every link carries `utm_source` / `utm_medium` / `utm_campaign`:
- posts: `post1`–`post5`;
- one-pager: `onepager`;
- profiles: `featured`, `page`, `bio`.

In Umami, open the site → **UTM** to see which piece brought visitors and requests.

## Re-making the kit
The scripts in `source/` need the site running locally (`pnpm build && pnpm start -p 3100`) and Playwright with Chromium:
1. `stills.mjs <dir>`: captures the 3D farm images (every farm type, day and night, overview and zoomed).
2. `STILLS=<dir>/ build.mjs <outDir>`: renders the banners, posts and one-pager from those stills. Edit the texts at the top (`T.en`, `T.ar`).
3. `clip.mjs <outDir> <en|ar> <tower|container|greenhouse|lab> 1200 1200 15`: records a clip frame by frame, so it stays smooth on any machine.
