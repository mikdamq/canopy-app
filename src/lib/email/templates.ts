/**
 * The two emails sent for each pilot request: the visitor's confirmation (in their
 * language) and the owner's new-request notice (in English). Plain functions with no
 * server imports, so they can be rendered on their own for a preview.
 *
 * Email HTML is its own world: tables for layout, inline styles, no SVG, images by
 * absolute URL (and the email must still read well with images blocked).
 */
import { fmt } from "@/i18n/config";
import ar from "@/i18n/ar";
import en from "@/i18n/en";
import { countryByName } from "@/lib/countries";
import { CROPS, GOALS, ROLES, type PilotRequest } from "@/lib/request-schema";
import { BRAND, brandName, CONTACT_EMAIL, whatsappUrl } from "@/lib/site";

export type Email = { subject: string; html: string; text: string };

export type EmailContext = {
  /** The live site, e.g. https://laminafarm.app (images and links are absolute). */
  base: string;
  /** The saved row's id, when the database is connected. */
  id?: string;
  /** Opens the row in Supabase, when known. */
  dbUrl?: string;
  receivedAt?: Date;
};

const C = {
  bg: "#eef2f5",
  paper: "#ffffff",
  ink: "#141b2b",
  muted: "#5b677d",
  line: "#dce2ec",
  green: "#1f7a45",
  greenInk: "#086b4a",
  leaf: "#2e9e5b",
  tint: "#eaf5ee",
  night: "#0b1222",
};
const LATIN = "'IBM Plex Sans',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const DISPLAY = "'Bricolage Grotesque',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const ARABIC = "'IBM Plex Sans Arabic',Tahoma,'Segoe UI',Arial,sans-serif";
const FONTS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const nl2br = (s: string) => esc(s).replace(/\n/g, "<br>");
const firstName = (name: string) => name.trim().split(/\s+/)[0];

/** The demo shows four farm types; the request form has two more, shown as the tower. */
const DEMO_TYPES = ["tower", "container", "greenhouse", "lab"] as const;
const demoType = (t: PilotRequest["farmType"]) => (DEMO_TYPES as readonly string[]).includes(t) ? t : "tower";

function demoUrl(r: PilotRequest, base: string, utm: string) {
  const q = new URLSearchParams({ farm: r.farmName });
  if (demoType(r.farmType) !== "tower") q.set("type", r.farmType);
  q.set("utm_source", "email");
  q.set("utm_medium", "email");
  q.set("utm_campaign", utm);
  return `${base}/${r.locale}/demo?${q}`;
}

/** Human-readable rows for a request, in the given language. */
export function requestRows(r: PilotRequest, d: typeof en): [string, string][] {
  const q = d.request;
  const label = <T extends readonly string[]>(ids: T, labels: readonly string[], id: T[number]) =>
    labels[ids.indexOf(id)] ?? id;
  const code = countryByName(r.country)?.code;
  const list = (items: string[]) => items.join(d === ar ? "، " : ", ");
  return [
    [q.fields.name, r.name],
    [q.fields.email, r.email],
    [q.fields.phone, r.phone],
    [q.fields.role, label(ROLES, q.roles, r.role)],
    [q.fields.country, code ? q.countries[code] : r.country],
    [q.fields.farmName, r.farmName],
    [q.fields.farmType, q.farmTypes[r.farmType]],
    [q.fields.area, String(r.areaM2)],
    [q.fields.levels, String(r.levels)],
    [q.fields.crops, list([...r.crops.map((c) => label(CROPS, q.crops, c)), r.cropsOther].filter(Boolean)) || "—"],
    [q.fields.monitoring, q.monitoring[r.monitoring]],
    [q.fields.sensorBrand, r.sensorBrand || "—"],
    [q.fields.goals, list(r.goals.map((g) => label(GOALS, q.goals, g)))],
    [q.fields.message, r.message || "—"],
  ];
}

/* ---------- building blocks ---------- */

function page(o: { lang: string; title: string; preheader: string; body: string }) {
  const rtl = o.lang === "ar";
  const font = rtl ? ARABIC : LATIN;
  return `<!doctype html>
<html lang="${o.lang}" dir="${rtl ? "rtl" : "ltr"}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(o.title)}</title>
<link href="${FONTS}" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%}
  a{color:${C.green}}
  @media (max-width:620px){
    .wrap{padding:12px 8px !important}
    .pad{padding-left:22px !important;padding-right:22px !important}
    .h1{font-size:26px !important;line-height:32px !important}
    .stack{display:block !important;width:100% !important;padding:0 0 10px !important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(o.preheader)}${"&#847; &zwnj; &nbsp; ".repeat(30)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg}">
<tr><td class="wrap" align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" dir="${rtl ? "rtl" : "ltr"}" style="width:100%;max-width:600px;font-family:${font};color:${C.ink}">
${o.body}
</table>
</td></tr>
</table>
</body>
</html>`;
}

function logo(base: string, extra = "") {
  return `<tr><td style="padding:0 6px 18px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" dir="ltr"><tr>
<td style="padding-right:10px;vertical-align:middle"><img src="${base}/email/mark.png" width="32" height="32" alt="" style="display:block;border:0;border-radius:8px"></td>
<td style="vertical-align:middle;font:700 21px/1 ${DISPLAY};color:${C.ink};letter-spacing:-0.3px">${BRAND}</td>
${extra ? `<td style="vertical-align:middle;padding-left:12px;font:400 14px/1 ${LATIN};color:${C.muted}">${extra}</td>` : ""}
</tr></table>
</td></tr>`;
}

function button(href: string, label: string, kind: "solid" | "outline" = "solid") {
  const solid = kind === "solid";
  return `<a href="${esc(href)}" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:${solid ? "13px 24px" : "11.5px 20px"};border-radius:999px;background:${solid ? C.green : C.paper};${solid ? "" : `border:1.5px solid ${C.line};`}font-weight:600;font-size:15px;line-height:20px;color:${solid ? "#ffffff" : C.ink};text-decoration:none;white-space:nowrap">${esc(label)}</a>`;
}

/** Emails and phone numbers keep their left-to-right order inside Arabic text. */
const isLtrValue = (v: string) => /^[\w.+-]+@[\w.-]+$/.test(v) || /^\+?[\d\s\-().]+$/.test(v);

function detailTable(list: [string, string][], rtl: boolean) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="${rtl ? "rtl" : "ltr"}" style="font-size:14px;line-height:21px">
${list
  .map(
    ([k, v], i) => `<tr>
<td valign="top" style="padding:9px 0;${i ? `border-top:1px solid ${C.line};` : ""}color:${C.muted};width:38%;padding-${rtl ? "left" : "right"}:14px;text-align:${rtl ? "right" : "left"}">${esc(k)}</td>
<td valign="top" style="padding:9px 0;${i ? `border-top:1px solid ${C.line};` : ""}color:${C.ink};text-align:${rtl ? "right" : "left"}">${rtl && isLtrValue(v) ? `<span dir="ltr" style="unicode-bidi:embed">${esc(v)}</span>` : nl2br(v)}</td>
</tr>`,
  )
  .join("")}
</table>`;
}

/* ---------- the visitor's confirmation ---------- */

export function visitorEmail(r: PilotRequest, ctx: EmailContext): Email {
  const d = r.locale === "ar" ? ar : en;
  const e = d.email;
  const rtl = r.locale === "ar";
  const align = rtl ? "right" : "left";
  const name = firstName(r.name);
  const v = { name, farm: r.farmName, brand: brandName(r.locale), site: ctx.base.replace(/^https?:\/\//, "") };
  const display = rtl ? ARABIC : DISPLAY;
  const type = demoType(r.farmType);
  const photos = whatsappUrl(fmt(d.request.done.photosMessage, v));
  const demo = demoUrl(r, ctx.base, "confirmation");
  const steps = d.request.done.next;

  const body = `${logo(ctx.base)}
<tr><td style="background:${C.paper};border-radius:20px;overflow:hidden">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="background:#e6ebee;border-radius:20px 20px 0 0;overflow:hidden">
<a href="${esc(demo)}" target="_blank"><img src="${ctx.base}/email/${type}.jpg" width="600" alt="${esc(d.request.farmTypes[r.farmType])}" style="display:block;width:100%;height:auto;border:0;border-radius:20px 20px 0 0"></a>
</td></tr>
<tr><td class="pad" style="padding:34px 40px 8px;text-align:${align}">
<div style="width:40px;height:4px;background:${C.leaf};border-radius:4px;font-size:0;line-height:0">&nbsp;</div>
<h1 class="h1" style="margin:18px 0 8px;font:700 30px/36px ${display};color:${C.ink};letter-spacing:${rtl ? "0" : "-0.5px"}">${esc(fmt(e.heroTitle, v))}</h1>
<p style="margin:0;font-size:16px;line-height:25px;color:${C.muted}">${esc(fmt(e.heroSub, v))}</p>
</td></tr>
<tr><td class="pad" style="padding:26px 40px 6px;text-align:${align}">
<h2 style="margin:0 0 14px;font:700 18px/24px ${display};color:${C.ink}">${esc(e.nextTitle)}</h2>
${steps
  .map(
    (s, i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px"><tr>
<td valign="top" width="40" style="width:40px;padding-${rtl ? "left" : "right"}:12px">
<div style="width:28px;height:28px;border-radius:14px;background:${C.green};color:#ffffff;font:700 14px/28px ${LATIN};text-align:center">${i + 1}</div>
</td>
<td valign="top" style="text-align:${align}">
<div style="font-weight:600;font-size:15px;line-height:22px;color:${C.ink}">${esc(fmt(s.t, v))}</div>
<div style="font-size:14px;line-height:21px;color:${C.muted}">${esc(fmt(s.d, v))}</div>
</td></tr></table>`,
  )
  .join("")}
</td></tr>
${
  photos
    ? `<tr><td class="pad" style="padding:6px 40px 4px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.tint};border-radius:14px"><tr><td style="padding:20px 22px;text-align:${align}">
<p style="margin:0 0 14px;font-size:15px;line-height:22px;color:${C.greenInk};font-weight:600">${esc(fmt(e.photosHint, v))}</p>
${button(photos, d.request.done.photos)}
</td></tr></table>
</td></tr>`
    : ""
}
<tr><td class="pad" style="padding:18px 40px 4px;text-align:${align}">
<a href="${esc(demo)}" target="_blank" style="font-weight:600;font-size:15px;color:${C.green};text-decoration:none">${esc(fmt(e.demoLink, v))} ${rtl ? "&larr;" : "&rarr;"}</a>
</td></tr>
<tr><td class="pad" style="padding:28px 40px 6px;text-align:${align}">
<div style="border-top:1px solid ${C.line};font-size:0;line-height:0">&nbsp;</div>
<h2 style="margin:22px 0 4px;font:700 18px/24px ${display};color:${C.ink}">${esc(e.summaryTitle)}</h2>
${detailTable(requestRows(r, d), rtl)}
<p style="margin:12px 0 0;font-size:13px;line-height:19px;color:${C.muted}">${esc(e.summaryNote)}</p>
</td></tr>
<tr><td class="pad" style="padding:26px 40px 36px;text-align:${align}">
<p style="margin:0;font-size:15px;line-height:23px;color:${C.ink}">${esc(e.sign)}<br><strong>${esc(fmt(e.signName, v))}</strong></p>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:22px 16px 8px;text-align:center;font-size:12px;line-height:19px;color:${C.muted}">
${esc(e.hours)}<br>
<a href="mailto:${CONTACT_EMAIL}" style="color:${C.muted}">${CONTACT_EMAIL}</a> &nbsp;·&nbsp; <a href="${ctx.base}/${r.locale}/privacy" target="_blank" style="color:${C.muted}">${esc(d.request.privacyLink)}</a><br>
${esc(fmt(e.why, v))}
</td></tr>`;

  const text = [
    fmt(e.heroTitle, v),
    fmt(e.heroSub, v),
    "",
    `${e.nextTitle}:`,
    ...steps.map((s, i) => `${i + 1}. ${fmt(s.t, v)}: ${fmt(s.d, v)}`),
    "",
    ...(photos ? [fmt(e.photosHint, v), photos, ""] : []),
    `${fmt(e.demoLink, v)}: ${demo}`,
    "",
    `${e.summaryTitle}:`,
    ...requestRows(r, d).map(([k, val]) => `${k}: ${val}`),
    e.summaryNote,
    "",
    e.sign,
    fmt(e.signName, v),
    "",
    e.hours,
    CONTACT_EMAIL,
  ].join("\n");

  return {
    subject: fmt(e.userSubject, v),
    html: page({ lang: r.locale, title: fmt(e.userSubject, v), preheader: e.preheader, body }),
    text,
  };
}

/* ---------- the owner's new-request notice ---------- */

const AMMAN = "Asia/Amman";

/** Working days are Sunday to Thursday, 9:00–23:00 Amman time. */
function replyBy(received: Date) {
  const day = (d: Date) => new Intl.DateTimeFormat("en-US", { timeZone: AMMAN, weekday: "short" }).format(d);
  const d = new Date(received.getTime() + 24 * 3600 * 1000);
  while (day(d) === "Fri" || day(d) === "Sat") d.setTime(d.getTime() + 24 * 3600 * 1000);
  return new Intl.DateTimeFormat("en-GB", { timeZone: AMMAN, weekday: "short", day: "numeric", month: "short" }).format(d);
}
const stamp = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: AMMAN, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);

/** wa.me wants digits only, with the country code and no leading zeros. */
const waDigits = (phone: string) => phone.replace(/\D/g, "").replace(/^00/, "");

export function ownerEmail(r: PilotRequest, ctx: EmailContext): Email {
  const q = en.request;
  const received = ctx.receivedAt ?? new Date();
  const name = firstName(r.name);
  const visitorDict = r.locale === "ar" ? ar : en;
  const lang = r.locale === "ar" ? "Arabic" : "English";
  const country = r.country;
  const subject = fmt(en.email.ownerSubject, { farm: r.farmName, country });
  const rows = requestRows(r, en);
  const get = (field: string) => rows.find(([k]) => k === field)?.[1] ?? "";

  const wa = waDigits(r.phone);
  const waLink = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent(fmt(visitorDict.email.ownerWhatsApp, { name, farm: r.farmName }))}`
    : "";
  const mail = `mailto:${r.email}?subject=${encodeURIComponent(`Your ${BRAND} pilot: ${r.farmName}`)}`;
  const demo = demoUrl(r, ctx.base, "owner");

  const chip = (t: string, bg: string, fg: string) =>
    `<span style="display:inline-block;padding:4px 10px;margin:0 6px 6px 0;border-radius:999px;background:${bg};color:${fg};font-size:12px;line-height:16px;font-weight:600">${esc(t)}</span>`;

  const fact = (label: string, value: string) => `<td class="stack" valign="top" width="25%" style="padding:0 8px 0 0">
<div style="font-size:12px;line-height:16px;color:#9fb0c8">${esc(label)}</div>
<div style="font:700 17px/24px ${DISPLAY};color:#ffffff">${esc(value)}</div></td>`;

  const actions = [
    waLink && button(waLink, `WhatsApp ${name}`),
    button(mail, "Reply by email", "outline"),
    button(demo, "Open their demo", "outline"),
    ctx.dbUrl && button(ctx.dbUrl, "Open in Supabase", "outline"),
  ].filter(Boolean) as string[];

  const body = `${logo(ctx.base, "New pilot request")}
<tr><td style="background:${C.paper};border-radius:20px;overflow:hidden">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td class="pad" style="background:${C.night};border-radius:20px 20px 0 0;padding:30px 36px 28px">
<div>${chip(`#${ctx.id ? ctx.id.slice(0, 8) : "not saved"}`, "#1d2a44", "#c9d4e6")}${chip(lang, r.locale === "ar" ? "#3a1d3a" : "#1d2a44", r.locale === "ar" ? "#ffb3ee" : "#c9d4e6")}${chip(`from ${r.source}`, "#1d2a44", "#c9d4e6")}</div>
<h1 class="h1" style="margin:10px 0 4px;font:700 30px/36px ${DISPLAY};color:#ffffff;letter-spacing:-0.5px">${esc(r.farmName)}</h1>
<p style="margin:0 0 22px;font-size:15px;line-height:22px;color:#c9d4e6">${esc(r.name)} · ${esc(get(q.fields.role))} · ${esc(country)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
${fact("Farm type", q.farmTypes[r.farmType])}${fact("Area", `${r.areaM2.toLocaleString("en")} m²`)}${fact("Levels", String(r.levels))}${fact("Tracks with", q.monitoring[r.monitoring])}
</tr></table>
</td></tr>
<tr><td class="pad" style="padding:22px 36px 4px;background:${C.tint}">
<p style="margin:0;font-size:14px;line-height:21px;color:${C.greenInk}"><strong>Reply by ${esc(replyBy(received))}</strong> (one business day) · received ${esc(stamp(received))}, Amman time</p>
</td></tr>
<tr><td class="pad" style="padding:0 36px 20px;background:${C.tint}">
<div style="margin-top:14px">${actions.join(" ")}</div>
</td></tr>
${
  r.message
    ? `<tr><td class="pad" style="padding:26px 36px 0">
<div style="font-size:12px;line-height:16px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:0.6px">In their words</div>
<div dir="auto" style="margin-top:8px;padding:14px 18px;border-left:4px solid ${C.leaf};background:${C.bg};border-radius:0 12px 12px 0;font-size:15px;line-height:23px;color:${C.ink}">${nl2br(r.message)}</div>
</td></tr>`
    : ""
}
<tr><td class="pad" style="padding:26px 36px 0">
<div style="font-size:12px;line-height:16px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:0.6px">What they want</div>
<p style="margin:8px 0 0;font-size:15px;line-height:23px">${esc(get(q.fields.goals))}</p>
<p style="margin:6px 0 0;font-size:14px;line-height:21px;color:${C.muted}">Grows: ${esc(get(q.fields.crops))}${r.sensorBrand ? ` · Sensors: ${esc(r.sensorBrand)}` : ""}</p>
</td></tr>
<tr><td class="pad" style="padding:26px 36px 0">
<div style="font-size:12px;line-height:16px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:0.6px">Your next steps</div>
<ol style="margin:8px 0 0;padding:0 0 0 20px;font-size:14px;line-height:22px;color:${C.ink}">
<li>Say hello on WhatsApp${r.locale === "ar" ? " (in Arabic; the button writes it for you)" : ""} and ask for layout photos.</li>
<li>Record a short video of their demo (<span style="color:${C.muted}">docs/launch-kit/demo-video.md</span>).</li>
<li>Send the video and the setup checklist by ${esc(replyBy(received))}.</li>
</ol>
</td></tr>
<tr><td class="pad" style="padding:26px 36px 32px">
<div style="font-size:12px;line-height:16px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:0.6px">Everything they sent</div>
<div style="margin-top:4px">${detailTable(rows, false)}</div>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:20px 16px 8px;text-align:center;font-size:12px;line-height:19px;color:${C.muted}">
Hit Reply to answer ${esc(name)} at ${esc(r.email)}. They got a confirmation in ${lang}.<br>Sent by ${esc(ctx.base.replace(/^https?:\/\//, ""))}
</td></tr>`;

  const text = [
    `New pilot request${ctx.id ? ` #${ctx.id}` : ""} · ${lang} · from ${r.source}`,
    `Reply by ${replyBy(received)} (received ${stamp(received)}, Amman time)`,
    "",
    ...rows.map(([k, val]) => `${k}: ${val}`),
    "",
    ...(waLink ? [`WhatsApp: ${waLink}`] : []),
    `Demo: ${demo}`,
    ...(ctx.dbUrl ? [`Supabase: ${ctx.dbUrl}`] : []),
  ].join("\n");

  return { subject, html: page({ lang: "en", title: subject, preheader: `${r.name} · ${q.farmTypes[r.farmType]} · ${r.areaM2} m² · ${country}`, body }), text };
}
