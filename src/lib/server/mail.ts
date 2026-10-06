import "server-only";
import nodemailer from "nodemailer";
import { fmt } from "@/i18n/config";
import ar from "@/i18n/ar";
import en from "@/i18n/en";
import { BRAND, CONTACT_EMAIL } from "@/lib/site";
import { CROPS, GOALS, ROLES, type PilotRequest } from "@/lib/request-schema";
import type { ChannelResult } from "./store";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Human-readable rows for a request, in the given language. */
function rows(r: PilotRequest, d: typeof en): [string, string][] {
  const q = d.request;
  const label = <T extends readonly string[]>(ids: T, labels: readonly string[], id: T[number]) => labels[ids.indexOf(id)] ?? id;
  return [
    [q.fields.name, r.name],
    [q.fields.email, r.email],
    [q.fields.phone, r.phone],
    [q.fields.role, label(ROLES, q.roles, r.role)],
    [q.fields.country, r.country],
    [q.fields.farmName, r.farmName],
    [q.fields.farmType, q.farmTypes[r.farmType]],
    [q.fields.area, String(r.areaM2)],
    [q.fields.levels, String(r.levels)],
    [q.fields.crops, [...r.crops.map((c) => label(CROPS, q.crops, c)), r.cropsOther].filter(Boolean).join(", ") || "—"],
    [q.fields.monitoring, q.monitoring[r.monitoring]],
    [q.fields.sensorBrand, r.sensorBrand || "—"],
    [q.fields.goals, r.goals.map((g) => label(GOALS, q.goals, g)).join(", ")],
    [q.fields.message, r.message || "—"],
  ];
}

function table(list: [string, string][], rtl = false) {
  const cells = list
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5b677d;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;color:#141b2b">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  return `<table dir="${rtl ? "rtl" : "ltr"}" style="border-collapse:collapse;font:14px/1.5 -apple-system,Segoe UI,Arial,sans-serif">${cells}</table>`;
}

/** Email the team a new request, and send the visitor a confirmation in their language. */
export async function sendRequestEmails(r: PilotRequest, id?: string): Promise<ChannelResult> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return { status: "skipped" };

  const port = Number(process.env.SMTP_PORT || 465);
  const from = process.env.MAIL_FROM || `${BRAND} <${user}>`;
  const notify = process.env.REQUESTS_NOTIFY_EMAIL || CONTACT_EMAIL;
  const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });

  const d = r.locale === "ar" ? ar : en;

  try {
    await transport.sendMail({
      from,
      to: notify,
      replyTo: r.email,
      subject: fmt(en.email.ownerSubject, { farm: r.farmName, country: r.country }),
      html: `<p style="font:15px -apple-system,Segoe UI,Arial,sans-serif">New pilot request${id ? ` <span style="color:#5b677d">#${esc(id)}</span>` : ""} · ${r.locale.toUpperCase()} · from ${esc(r.source)}</p>${table(rows(r, en))}`,
      text: rows(r, en)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
    });
    const rtl = r.locale === "ar";
    await transport.sendMail({
      from,
      to: r.email,
      replyTo: notify,
      subject: fmt(d.email.userSubject, { name: r.name.split(" ")[0] }),
      html: `<div dir="${rtl ? "rtl" : "ltr"}" style="font:15px/1.6 -apple-system,Segoe UI,Arial,sans-serif;color:#141b2b;max-width:560px">
<p>${esc(fmt(d.email.userHello, { name: r.name.split(" ")[0] }))}</p>
<p>${esc(fmt(d.email.userBody, { farm: r.farmName }))}</p>
<p style="color:#5b677d">${esc(d.email.userSummary)}</p>${table(rows(r, d), rtl)}
<p>${esc(fmt(d.email.userSign, { brand: BRAND }))}</p></div>`,
    });
    return { status: "ok" };
  } catch (e) {
    return { status: "failed", error: e instanceof Error ? e.message : String(e) };
  }
}
