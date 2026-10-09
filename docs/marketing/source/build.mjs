// Renders the Lamina marketing kit (banners, posts, one-pager) with the site's own fonts.
// Usage: node build.mjs <outDir> [only]
import { chromium } from "playwright";
import QRCode from "qrcode";
import fs from "fs";

const OUT = process.argv[2];
const ONLY = process.argv[3];
const IMG = "http://localhost:3100/__stills/";
const STILLS = process.env.STILLS || new URL("../mk/stills/", import.meta.url).pathname; // folder made by stills.mjs
const SITE = "http://localhost:3100";
const NIGHT = "#070c18";

const MARK = (s, bg = "#2e9e5b") => `<svg width="${s}" height="${s}" viewBox="0 0 32 32" style="flex:none;display:block"><rect width="32" height="32" rx="8" fill="${bg}"/><g transform="translate(5.5 5.5) scale(0.875)" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></g></svg>`;
const LOGO = (s, color = "#141b2b") =>
  `<div style="display:flex;align-items:center;gap:${s * 0.32}px;direction:ltr"><span>${MARK(s)}</span><span style="font-family:var(--cf-latin-display);font-weight:700;font-size:${s * 0.68}px;color:${color};letter-spacing:-0.01em">Lamina</span></div>`;

const T = {
  en: {
    eyebrow: "For vertical & indoor farms",
    head: "Your farm,<br>alive in 3D.",
    sub: "Every floor, crop and crate, from seed to delivery, in one live view.",
    bannerSub: "A live 3D twin for vertical & indoor farms. Free pilot for farms in Jordan & the Gulf.",
    try: "Try it with your farm's name",
    types: ["Vertical tower", "Container farm", "Hydroponic greenhouse", "Research lab"],
    p2: "One view for every kind of indoor farm.",
    p2sub: "Pick your farm type in the demo. Your twin is built around your real layout.",
    p3: "Red + blue.<br>Fastest growth per kWh.",
    p3sub: "Compare light recipes floor by floor. See growth speed and energy per kilo before you change a thing.",
    recipes: [["Red + blue", "660 + 450 nm"], ["Full white", "400–700 nm"], ["Blue heavy", "450 nm"]],
    p4: "Seed → harvest → pack → deliver.",
    p4sub: "Every crate, every floor, every van run. One picture your whole team shares.",
    p5k: "Pilot program · Jordan & the Gulf",
    p5: "3 months<br>free.",
    p5sub: "We're building Lamina with a few farms first. Yours could be one of them.",
    p5list: ["Your farm in 3D in about two weeks", "Floors, crops, light recipes, seed to plate", "A direct line to the founder on WhatsApp", "In return: a 2-minute feedback form every two weeks"],
    p5cta: "Request a pilot",
    // one-pager
    opWhat: "What you get",
    opFeat: [
      ["Floor by floor", "Click any floor to zoom in. Air, CO₂, water and lights sit right where the sensors are."],
      ["Light recipes", "Compare spectrums and hours per floor, and see the effect on growth speed and energy per kilo."],
      ["Seed to plate", "Follow every batch through harvest, packing and delivery, with a live log of what happened."],
    ],
    opBuilt: "Built for",
    opPilot: "The pilot",
    opPilotT: "3 months free, built with you",
    opSteps: [
      ["Tell us about your farm", "A 2-minute form, or layout photos on WhatsApp. A spreadsheet is enough."],
      ["We build your twin", "Your rooms, floors, racks, lights and sensors, in about two weeks."],
      ["Use it free for 3 months", "Share a 2-minute feedback form every two weeks. That's it."],
    ],
    opCtaT: "See it with your farm's name",
    opCtaS: "Scan to open the live demo. Type your farm's name and explore.",
    opContact: "Or message us",
  },
  ar: {
    eyebrow: "للمزارع العمودية والداخلية",
    head: "مزرعتك،<br>حيّة بالأبعاد الثلاثية.",
    sub: "كل طابق وكل محصول وكل صندوق، من البذرة حتى التوصيل، في عرض حيّ واحد.",
    bannerSub: "نسخة رقمية حيّة ثلاثية الأبعاد للمزارع العمودية والداخلية. تجربة مجانية لمزارع الأردن والخليج.",
    try: "جرّبه باسم مزرعتك",
    types: ["مزرعة عمودية", "مزرعة حاويات", "بيت محمي مائي", "مختبر أبحاث"],
    p2: "عرض واحد لكل أنواع المزارع الداخلية.",
    p2sub: "اختر نوع مزرعتك في العرض. نسختك الرقمية تُبنى على مخطط مزرعتك الحقيقي.",
    p3: "أحمر + أزرق.<br>أسرع نمو لكل كيلوواط.",
    p3sub: "قارن وصفات الإضاءة طابقًا طابقًا. شاهد سرعة النمو والطاقة لكل كيلوغرام قبل أن تغيّر شيئًا.",
    recipes: [["أحمر + أزرق", "660 + 450 nm"], ["أبيض كامل", "400–700 nm"], ["أزرق غالب", "450 nm"]],
    p4: "بذرة ← حصاد ← تعبئة ← توصيل.",
    p4sub: "كل صندوق وكل طابق وكل رحلة توصيل. صورة واحدة يتشاركها فريقك كله.",
    p5k: "برنامج التجربة · الأردن والخليج",
    p5: "3 أشهر<br>مجانًا.",
    p5sub: "نبني لامينا أولًا مع عدد قليل من المزارع. قد تكون مزرعتك واحدة منها.",
    p5list: ["مزرعتك بالأبعاد الثلاثية خلال أسبوعين تقريبًا", "الطوابق والمحاصيل ووصفات الإضاءة، من البذرة إلى المائدة", "تواصل مباشر مع المؤسس عبر واتساب", "في المقابل: نموذج ملاحظات مدته دقيقتان كل أسبوعين"],
    p5cta: "اطلب التجربة",
    opWhat: "ما الذي تحصل عليه",
    opFeat: [
      ["طابقًا طابقًا", "اضغط على أي طابق للتكبير. الحرارة وثاني أكسيد الكربون والمياه والإضاءة في مكان الحساسات نفسه."],
      ["وصفات الإضاءة", "قارن الأطياف وساعات التشغيل لكل طابق، وشاهد أثرها على سرعة النمو والطاقة لكل كيلوغرام."],
      ["من البذرة إلى المائدة", "تابع كل دفعة خلال الحصاد والتعبئة والتوصيل، مع سجل حيّ لما حدث."],
    ],
    opBuilt: "مصمّم لـ",
    opPilot: "التجربة",
    opPilotT: "3 أشهر مجانًا، نبنيها معك",
    opSteps: [
      ["حدّثنا عن مزرعتك", "نموذج مدته دقيقتان، أو صور المخطط عبر واتساب. يكفي جدول بيانات."],
      ["نبني نسختك الرقمية", "غرفك وطوابقك ورفوفك وإضاءتك وحساساتك، خلال أسبوعين تقريبًا."],
      ["استخدمها مجانًا 3 أشهر", "شاركنا نموذج ملاحظات مدته دقيقتان كل أسبوعين. هذا كل شيء."],
    ],
    opCtaT: "شاهدها باسم مزرعتك",
    opCtaS: "امسح الرمز لفتح العرض الحي. اكتب اسم مزرعتك واستكشف.",
    opContact: "أو راسلنا",
  },
};

const BASE = (lang) => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
.r{position:relative;overflow:hidden;font-family:var(--cf-sans);color:#141b2b;-webkit-font-smoothing:antialiased}
.d{font-family:var(--cf-display);font-weight:800;line-height:1.02;letter-spacing:${lang === "ar" ? "0" : "-0.035em"}}
.m{font-family:var(--cf-mono);font-weight:500;letter-spacing:${lang === "ar" ? "0" : "0.08em"};text-transform:uppercase}
.img{position:absolute;background-repeat:no-repeat}
.chip{display:inline-flex;align-items:center;gap:10px;border-radius:999px;font-weight:600}
`;
const arrow = (lang) => (lang === "ar" ? "←" : "→");
const WA = "+962 78 7016 351";
const qr = (url, dark = "#141b2b", light = "#ffffff") => QRCode.toString(url, { type: "svg", margin: 0, color: { dark, light }, errorCorrectionLevel: "M" });
const utm = (lang, src, med) => `https://laminafarm.app/${lang}/demo?utm_source=${src}&utm_medium=${med}&utm_campaign=pilot`;

/* ------------------------------ templates ------------------------------ */

// LinkedIn profile banner 1584x396. The profile photo covers the bottom-left, so the copy sits right.
const banner = (lang, w = 1584, h = 396) => {
  const t = T[lang];
  const k = h / 396;
  return `<div class="r" dir="${lang === "ar" ? "rtl" : "ltr"}" style="width:${w}px;height:${h}px;background:${NIGHT}">
  <div class="img" style="left:${-40 * k}px;top:${-150 * k}px;width:${1150 * k}px;height:${719 * k}px;background-image:url(${IMG}tower-en-night-clean.jpg);background-size:cover;-webkit-mask-image:radial-gradient(closest-side at 44% 50%,#000 62%,transparent 100%)"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,transparent 30%,${NIGHT} 47%)"></div>
  <div style="position:absolute;top:0;bottom:0;right:${64 * k}px;width:${(w > 1200 ? 760 : 560) * k}px;display:flex;flex-direction:column;justify-content:center;gap:${16 * k}px;">
    <div class="m" style="color:#ff4fd8;font-size:${15 * k}px">${t.eyebrow}</div>
    <div class="d" style="color:#fff;font-size:${(lang === "ar" ? 54 : 66) * k}px">${t.head.replace("<br>", " ")}</div>
    <div style="color:#b8c2d6;font-size:${19 * k}px;line-height:1.45;max-width:${640 * k}px">${t.bannerSub}</div>
    <div style="display:flex;align-items:center;gap:${18 * k}px;margin-top:${6 * k}px">${LOGO(30 * k, "#fff")}<span class="m" style="color:#7ee2a4;font-size:${15 * k}px;text-transform:none;letter-spacing:0">laminafarm.app</span></div>
  </div></div>`;
};

// LinkedIn company page cover 1128x191.
const cover = (lang) => {
  const t = T[lang];
  const rtl = lang === "ar";
  return `<div class="r" dir="${rtl ? "rtl" : "ltr"}" style="width:1128px;height:191px;background:${NIGHT}">
  <div class="img" style="${rtl ? "left" : "right"}:-60px;top:-90px;width:620px;height:388px;background-image:url(${IMG}tower-en-night-clean.jpg);background-size:cover;-webkit-mask-image:radial-gradient(closest-side at 44% 50%,#000 60%,transparent 100%)"></div>
  <div style="position:absolute;top:0;bottom:0;${rtl ? "right" : "left"}:250px;display:flex;flex-direction:column;justify-content:center;gap:8px">
    <div class="m" style="color:#ff4fd8;font-size:12px">${t.eyebrow}</div>
    <div class="d" style="color:#fff;font-size:40px">${t.head.replace("<br>", " ")}</div>
    <div class="m" style="color:#7ee2a4;font-size:13px;text-transform:none;letter-spacing:0">laminafarm.app</div>
  </div></div>`;
};

const avatar = (s) => `<div class="r" style="width:${s}px;height:${s}px;background:#2e9e5b;display:grid;place-items:center">${MARK(s * 0.86, "#2e9e5b")}</div>`;

// Post frame 1080x1350 (4:5 works on LinkedIn and Instagram).
const PW = 1080, PH = 1350;
const foot = (lang, dark) => `<div style="position:absolute;left:72px;right:72px;bottom:56px;display:flex;align-items:center;justify-content:space-between">
  ${LOGO(44, dark ? "#fff" : "#141b2b")}<span class="m" style="font-size:22px;text-transform:none;letter-spacing:0;color:${dark ? "#7ee2a4" : "#1f7a45"}">laminafarm.app</span></div>`;

const post1 = (lang) => {
  const t = T[lang];
  return `<div class="r" dir="${lang === "ar" ? "rtl" : "ltr"}" style="width:${PW}px;height:${PH}px;background:${NIGHT}">
  <div class="img" style="left:-560px;top:120px;width:2080px;height:1300px;background-image:url(${IMG}tower-en-night-clean.jpg);background-size:cover;-webkit-mask-image:radial-gradient(closest-side at 50% 52%,#000 70%,transparent 100%)"></div>
  <div style="position:absolute;left:72px;right:72px;top:80px">
    <div class="m" style="color:#ff4fd8;font-size:24px">${t.eyebrow}</div>
    <div class="d" style="color:#fff;font-size:${lang === "ar" ? 96 : 118}px;margin-top:24px">${t.head}</div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:520px;background:linear-gradient(transparent,${NIGHT} 55%)"></div>
  <div style="position:absolute;left:72px;right:72px;bottom:150px;display:flex;flex-direction:column;gap:22px">
    <div style="color:#c9d1e0;font-size:32px;line-height:1.4;max-width:820px">${t.sub}</div>
    <div class="chip" style="align-self:flex-start;background:#1f7a45;color:#fff;font-size:28px;padding:18px 30px">${t.try} <span style="display:inline-block">${arrow(lang)}</span></div>
  </div>
  ${foot(lang, true)}</div>`;
};

const post2 = (lang) => {
  const t = T[lang];
  const tiles = [
    ["tower-en-day-clean", "-38% -6%"],
    ["container-en-day-clean", "-10% -14%"],
    ["greenhouse-en-day-clean", "-18% -12%"],
    ["lab-en-day-clean", "-14% -16%"],
  ];
  return `<div class="r" dir="${lang === "ar" ? "rtl" : "ltr"}" style="width:${PW}px;height:${PH}px;background:#eef2f5">
  <div style="position:absolute;left:72px;right:72px;top:80px">
    <div class="d" style="font-size:${lang === "ar" ? 70 : 78}px">${t.p2}</div>
    <div style="color:#5b677d;font-size:28px;line-height:1.4;margin-top:20px;max-width:880px">${t.p2sub}</div>
  </div>
  <div style="position:absolute;left:72px;right:72px;top:380px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
    ${tiles
      .map(
        ([f], i) => `<div style="position:relative;height:340px;border-radius:28px;overflow:hidden;background:#e5e9ed;border:1px solid #dce2ec">
      <div class="img" style="inset:0;background-image:url(${IMG}${f}.jpg);background-size:${i === 0 ? "190%" : "150%"};background-position:${["30% 55%", "30% 30%", "35% 40%", "40% 50%"][i]}"></div>
      <div class="chip" style="position:absolute;${lang === "ar" ? "right" : "left"}:18px;bottom:18px;background:#fff;font-size:24px;padding:10px 18px;box-shadow:0 6px 18px -10px rgba(20,27,43,.4)"><span style="width:10px;height:10px;border-radius:50%;background:#2e9e5b"></span>${t.types[i]}</div></div>`,
      )
      .join("")}
  </div>
  ${foot(lang, false)}</div>`;
};

const post3 = (lang) => {
  const t = T[lang];
  return `<div class="r" dir="${lang === "ar" ? "rtl" : "ltr"}" style="width:${PW}px;height:${PH}px;background:#141b2b">
  <div class="img" style="left:0;top:0;width:${PW}px;height:700px;background-image:url(${IMG}tower-en-day-zoom-clean.jpg);background-size:175%;background-position:35% 20%"></div>
  <div style="position:absolute;left:0;right:0;top:520px;height:180px;background:linear-gradient(transparent,#141b2b)"></div>
  <div style="position:absolute;left:72px;right:72px;top:640px">
    <div class="d" style="color:#fff;font-size:${lang === "ar" ? 74 : 84}px">${t.p3}</div>
    <div style="color:#b8c2d6;font-size:28px;line-height:1.4;margin-top:22px;max-width:900px">${t.p3sub}</div>
    <div style="display:flex;gap:14px;margin-top:34px">
      ${t.recipes
        .map(
          ([n, nm], i) => `<div style="flex:1;border-radius:20px;padding:18px 20px;background:${i === 0 ? "#fff" : "rgba(255,255,255,.08)"};border:1px solid ${i === 0 ? "#fff" : "rgba(255,255,255,.18)"}">
        <div style="height:8px;border-radius:9px;background:${["linear-gradient(90deg,#ff4fd8,#ff4fd8 55%,#4f7bff 55%)", "#ffe9b8", "#4f7bff"][i]}"></div>
        <div style="font-weight:600;font-size:24px;margin-top:12px;color:${i === 0 ? "#141b2b" : "#fff"}">${n}</div>
        <div class="m" style="font-size:17px;margin-top:4px;text-transform:none;letter-spacing:0;direction:ltr;text-align:${lang === "ar" ? "right" : "left"};color:${i === 0 ? "#5b677d" : "#9aa6ba"}">${nm}</div></div>`,
        )
        .join("")}
    </div>
  </div>
  ${foot(lang, true)}</div>`;
};

const post4 = (lang) => {
  const t = T[lang];
  const shot = lang === "ar" ? "tower-ar-day-ui" : "tower-en-day-ui";
  return `<div class="r" dir="${lang === "ar" ? "rtl" : "ltr"}" style="width:${PW}px;height:${PH}px;background:#1f7a45">
  <div style="position:absolute;left:72px;right:72px;top:80px">
    <div class="d" style="color:#fff;font-size:${lang === "ar" ? 70 : 80}px">${t.p4}</div>
    <div style="color:#d6f0df;font-size:28px;line-height:1.4;margin-top:20px;max-width:880px">${t.p4sub}</div>
  </div>
  <div style="position:absolute;${lang === "ar" ? "right" : "left"}:72px;top:430px;width:1300px;height:812px;border-radius:26px;overflow:hidden;box-shadow:0 40px 80px -30px rgba(0,0,0,.55);border:6px solid rgba(255,255,255,.25)">
    <img src="${IMG}${shot}.jpg" style="width:100%;height:100%;display:block">
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(transparent,#1f7a45 70%)"></div>
  ${foot(lang, true)}</div>`;
};

const post5 = (lang) => {
  const t = T[lang];
  return `<div class="r" dir="${lang === "ar" ? "rtl" : "ltr"}" style="width:${PW}px;height:${PH}px;background:#eef2f5">
  <div style="position:absolute;${lang === "ar" ? "left" : "right"}:-220px;top:-200px;width:760px;height:760px;border-radius:50%;background:radial-gradient(#ff4fd8 0%,rgba(255,79,216,.25) 40%,transparent 70%);opacity:.55"></div>
  <div style="position:absolute;left:72px;right:72px;top:80px">
    <div class="m" style="color:#1f7a45;font-size:24px">${t.p5k}</div>
    <div class="d" style="font-size:${lang === "ar" ? 170 : 200}px;margin-top:26px;line-height:${lang === "ar" ? 1.2 : 0.95}">${t.p5}</div>
    <div style="font-size:32px;line-height:1.4;margin-top:34px;max-width:860px;color:#3a4459">${t.p5sub}</div>
    <div style="display:flex;flex-direction:column;gap:16px;margin-top:40px">
      ${t.p5list.map((x, i) => `<div style="display:flex;gap:16px;align-items:center;font-size:27px;${i === 3 ? "color:#5b677d" : ""}"><span style="flex:none;width:34px;height:34px;border-radius:50%;background:${i === 3 ? "#dce2ec" : "#2e9e5b"};display:grid;place-items:center;color:#fff;font-size:19px;font-weight:700">${i === 3 ? "↺" : "✓"}</span>${x}</div>`).join("")}
    </div>
    <div class="chip" style="margin-top:46px;background:#141b2b;color:#fff;font-size:30px;padding:22px 36px">${t.p5cta} <span>${arrow(lang)}</span></div>
  </div>
  ${foot(lang, false)}</div>`;
};

// A4 one-pager (794x1123 CSS px).
const onePager = async (lang) => {
  const t = T[lang];
  const rtl = lang === "ar";
  const code = await qr(utm(lang, "onepager", "pdf"));
  const thumbs = ["tower-en-day-clean", "container-en-day-clean", "greenhouse-en-day-clean", "lab-en-day-clean"];
  const pos = ["30% 55%", "30% 30%", "35% 40%", "40% 50%"];
  return `<div class="r" dir="${rtl ? "rtl" : "ltr"}" style="width:794px;height:1123px;background:#fff">
  <div style="position:relative;height:350px;background:${NIGHT};overflow:hidden">
    <div class="img" style="${rtl ? "left:-300px" : "right:-300px"};top:-30px;width:860px;height:538px;background-image:url(${IMG}tower-en-night-clean.jpg);background-size:cover;${rtl ? "transform:scaleX(-1);" : ""}-webkit-mask-image:radial-gradient(closest-side at 44% 50%,#000 60%,transparent 100%)"></div>
    <div style="position:absolute;inset:40px 48px auto 48px;display:flex;justify-content:space-between;align-items:center">${LOGO(30, "#fff")}<span class="m" style="color:#7ee2a4;font-size:13px;text-transform:none;letter-spacing:0">laminafarm.app</span></div>
    <div style="position:absolute;${rtl ? "right" : "left"}:48px;top:104px;width:430px">
      <div class="m" style="color:#ff4fd8;font-size:12px">${t.eyebrow}</div>
      <div class="d" style="color:#fff;font-size:${rtl ? 46 : 58}px;margin-top:14px">${t.head}</div>
      <div style="color:#c9d1e0;font-size:15px;line-height:1.5;margin-top:16px">${t.sub}</div>
    </div>
  </div>
  <div style="padding:24px 48px 0">
    <div class="m" style="font-size:11px;color:#1f7a45">${t.opWhat}</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:12px">
      ${t.opFeat.map(([h, d], i) => `<div style="border:1px solid #dce2ec;border-radius:16px;padding:14px 16px;background:#f7f9fb"><div style="display:flex;gap:8px;align-items:center"><span style="width:8px;height:8px;border-radius:50%;background:${["#2e9e5b", "#ff4fd8", "#141b2b"][i]}"></span><span style="font-weight:600;font-size:15px">${h}</span></div><div style="font-size:12.5px;line-height:1.5;color:#5b677d;margin-top:6px">${d}</div></div>`).join("")}
    </div>
    <div class="m" style="font-size:11px;color:#1f7a45;margin-top:20px">${t.opBuilt}</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:10px">
      ${thumbs.map((f, i) => `<div><div style="height:92px;border-radius:12px;border:1px solid #dce2ec;background:#e5e9ed url(${IMG}${f}.jpg) no-repeat;background-size:${i === 0 ? "190%" : "150%"};background-position:${pos[i]}"></div><div style="font-size:12.5px;font-weight:600;margin-top:6px">${t.types[i]}</div></div>`).join("")}
    </div>
    <div style="margin-top:20px;border-radius:20px;background:#e9f5ee;border:1px solid #cfe8d9;padding:20px 22px">
      <div class="m" style="font-size:11px;color:#1f7a45">${t.opPilot}</div>
      <div class="d" style="font-size:${rtl ? 25 : 28}px;margin-top:6px">${t.opPilotT}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:14px">
        ${t.opSteps.map(([h, d], i) => `<div><div style="width:26px;height:26px;border-radius:50%;background:#1f7a45;color:#fff;display:grid;place-items:center;font-weight:700;font-size:13px">${i + 1}</div><div style="font-weight:600;font-size:14px;margin-top:8px">${h}</div><div style="font-size:12px;line-height:1.5;color:#3a4459;margin-top:4px">${d}</div></div>`).join("")}
      </div>
    </div>
  <div style="margin-top:18px;border-radius:20px;background:#141b2b;color:#fff;padding:20px 22px;display:flex;gap:22px;align-items:center">
    <div style="flex:none;width:112px;height:112px;background:#fff;border-radius:12px;padding:9px">${code.replace("<svg", '<svg width="94" height="94"')}</div>
    <div style="flex:1">
      <div class="d" style="font-size:${rtl ? 22 : 25}px">${t.opCtaT}</div>
      <div style="font-size:13px;color:#b8c2d6;margin-top:6px;line-height:1.5">${t.opCtaS}</div>
      <div style="display:flex;gap:18px;margin-top:10px;font-size:13px;color:#7ee2a4;flex-wrap:wrap"><span>${t.opContact}:</span><span dir="ltr">WhatsApp ${WA}</span><span dir="ltr">hello@laminafarm.app</span></div>
    </div>
  </div></div></div>`;
};

/* ------------------------------- render -------------------------------- */

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
// Borrow the site's stylesheets and font classes, then serve each template as its own
// same-origin page (so the web fonts load and React never touches it).
const head = {};
for (const lang of ["en", "ar"]) {
  const p = await b.newPage();
  await p.goto(`${SITE}/${lang}/privacy`);
  head[lang] = await p.evaluate(() => ({
    cls: document.documentElement.className,
    css: [...document.querySelectorAll("link[rel=stylesheet]")].map((l) => l.href),
  }));
  await p.close();
}
const doc = (lang, html) => `<!doctype html><html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}" class="${head[lang].cls}"><head><meta charset="utf-8">${head[lang].css.map((h) => `<link rel="stylesheet" href="${h}">`).join("")}<style>${BASE(lang)} body{margin:0;background:transparent}</style></head><body>${html}</body></html>`;
async function render(lang, html, file, w, h, { pdf = false, scale = 1 } = {}) {
  if (ONLY && !file.includes(ONLY)) return;
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  await p.route(`${SITE}/__mk`, (r) => r.fulfill({ contentType: "text/html", body: doc(lang, html) }));
  await p.route(`${SITE}/__stills/*`, (r) => r.fulfill({ contentType: "image/jpeg", body: fs.readFileSync(STILLS + r.request().url().split("/").pop()) }));
  await p.goto(`${SITE}/__mk`);
  await p.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => console.log("  (network not idle)"));
  await p.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))]));
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/${file}.png`, clip: { x: 0, y: 0, width: w, height: h } });
  if (pdf) await p.pdf({ path: `${OUT}/${file}.pdf`, width: `${w}px`, height: `${h}px`, printBackground: true, pageRanges: "1" });
  await p.close();
  console.log("wrote", file);
}

for (const lang of ["en", "ar"]) {
  await render(lang, banner(lang), `social/linkedin-banner-${lang}`, 1584, 396, { scale: 2 });
  await render(lang, cover(lang), `social/linkedin-company-cover-${lang}`, 1128, 191, { scale: 2 });
  await render(lang, post1(lang), `posts/post-1-launch-${lang}`, PW, PH);
  await render(lang, post2(lang), `posts/post-2-farm-types-${lang}`, PW, PH);
  await render(lang, post3(lang), `posts/post-3-light-recipes-${lang}`, PW, PH);
  await render(lang, post4(lang), `posts/post-4-seed-to-plate-${lang}`, PW, PH);
  await render(lang, post5(lang), `posts/post-5-pilot-${lang}`, PW, PH);
  await render(lang, await onePager(lang), `one-pager/lamina-one-pager-${lang}`, 794, 1123, { pdf: true, scale: 2 });
}
await render("en", avatar(400), "social/logo-400", 400, 400);
await render("en", avatar(1080), "social/avatar-1080", 1080, 1080);
await b.close();
