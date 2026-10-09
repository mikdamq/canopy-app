import { chromium } from "playwright";
const out = process.argv[2];
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const CLEAN = "body *{visibility:hidden!important} canvas{visibility:visible!important}";
for (const lang of ["en", "ar"]) for (const type of ["tower", "container", "greenhouse", "lab"]) {
  if (lang === "ar" && type !== "tower") continue;
  for (const [tag, t] of [["day", 10.5], ["night", 21.5]]) {
    if (tag === "night" && (type !== "tower" || lang === "ar")) continue;
    const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const farm = lang === "ar" ? "مزرعة الوادي" : "Green Valley";
    await p.goto(`http://localhost:3100/${lang}/demo?farm=${encodeURIComponent(farm)}&type=${type}&w=0&t=${t}`);
    await p.waitForTimeout(14000);
    const name = `${type}-${lang}-${tag}`;
    await p.screenshot({ path: `${out}/${name}-ui.png` });
    if (lang === "en") {
      const st = await p.addStyleTag({ content: CLEAN });
      await p.waitForTimeout(500);
      await p.screenshot({ path: `${out}/${name}-clean.png` });
      await st.evaluate((n) => n.remove());
      if (tag === "day") {
        await p.getByRole("button", { name: /zoom in/i }).first().click();
        await p.waitForTimeout(12000);
        await p.screenshot({ path: `${out}/${name}-zoom-ui.png` });
        await p.addStyleTag({ content: CLEAN });
        await p.waitForTimeout(500);
        await p.screenshot({ path: `${out}/${name}-zoom-clean.png` });
      }
    }
    console.log("done", name);
    await p.close();
  }
}
await b.close();
