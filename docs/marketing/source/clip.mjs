// Records a smooth demo clip frame by frame: the page's clock only moves when we step it,
// so the slow software renderer here doesn't make the motion choppy.
// Usage: node clip.mjs <outDir> <lang> <type> [w] [h] [seconds]
import { chromium } from "playwright";
import { execFileSync } from "child_process";
import fs from "fs";

const [OUT, LANG, TYPE, W = "1200", H = "1200", SECS = "15"] = process.argv.slice(2);
const FPS = 30;
const frames = `${OUT}/frames-${LANG}-${TYPE}-${W}x${H}`;
fs.rmSync(frames, { recursive: true, force: true });
fs.mkdirSync(frames, { recursive: true });

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: +W, height: +H } });
await p.addInitScript(() => {
  const realRaf = window.requestAnimationFrame.bind(window);
  const realNow = performance.now.bind(performance);
  const realDate = Date.now;
  let manual = false, vt = 0, d0 = 0, q = [];
  performance.now = () => (manual ? vt : realNow());
  Date.now = () => (manual ? d0 + vt : realDate());
  window.requestAnimationFrame = (cb) => {
    if (manual) { q.push(cb); return q.length; }
    return realRaf((t) => cb(manual ? vt : t));
  };
  window.cancelAnimationFrame = () => {};
  window.__manual = () => { vt = realNow(); d0 = realDate() - vt; manual = true; };
  window.__step = (ms) => { vt += ms; const cbs = q; q = []; for (const cb of cbs) { try { cb(vt); } catch (e) { console.error(e); } } };
});
const farm = LANG === "ar" ? "مزرعة الوادي" : "Green Valley";
await p.goto(`http://localhost:3100/${LANG}/demo?farm=${encodeURIComponent(farm)}&type=${TYPE}&w=0&t=17.2`);
await p.waitForTimeout(14000);
await p.evaluate(() => window.__manual());

const total = +SECS * FPS;
// Beats: overview, then zoom into the selected unit, then switch the light recipe.
const zoomAt = Math.round(total * 0.3), recipeAt = Math.round(total * 0.62), outAt = Math.round(total * 0.86);
const zoomBtn = LANG === "ar" ? /تكبير|قرّب|كبّر/ : /zoom in/i;
for (let i = 0; i < total; i++) {
  if (i === zoomAt) await p.getByRole("button", { name: zoomBtn }).first().click({ timeout: 5000 }).catch((e) => console.log("zoom click failed", e.message));
  if (i === recipeAt) {
    const btns = p.locator("button", { hasText: LANG === "ar" ? /أزرق غالب|أزرق/ : /Blue heavy/ });
    await btns.first().click({ timeout: 5000 }).catch((e) => console.log("recipe click failed", e.message));
  }
  if (i === outAt)
    await p.getByRole("button", { name: LANG === "ar" ? /^العودة إلى (البرج|كل الحاويات|البيت المحمي|المختبر)/ : /^Back to (tower|all containers|greenhouse|the lab|lab)/i }).first().click({ timeout: 5000 }).catch((e) => console.log("back click failed", e.message));
  await p.evaluate(() => window.__step(1000 / 30));
  await p.screenshot({ path: `${frames}/${String(i).padStart(4, "0")}.png` });
  if (i % 60 === 0) console.log(LANG, TYPE, i, "/", total);
}
await b.close();
const out = `${OUT}/lamina-demo-${TYPE}-${LANG}-${W}x${H}.mp4`;
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", `${frames}/%04d.png`, "-vf", `scale=${W === H ? "1080:1080" : "1080:-2"}:flags=lanczos,format=yuv420p`, "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-movflags", "+faststart", out]);
fs.rmSync(frames, { recursive: true, force: true });
console.log("wrote", out);
