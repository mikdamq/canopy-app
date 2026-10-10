import "server-only";
import nodemailer from "nodemailer";
import { ownerEmail, visitorEmail } from "@/lib/email/templates";
import { BRAND, baseUrl, CONTACT_EMAIL } from "@/lib/site";
import type { PilotDetails, PilotRequest, RequestBasics } from "@/lib/request-schema";
import { env } from "./env";
import type { ChannelResult } from "./store";

/** The Supabase table view for this project, when SUPABASE_URL is the usual https://<ref>.supabase.co. */
function supabaseTableUrl() {
  const ref = env("SUPABASE_URL")?.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
  return ref ? `https://supabase.com/dashboard/project/${ref}/editor` : undefined;
}

function mailer() {
  const host = env("SMTP_HOST");
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");
  if (!host || !user || !pass) return null;
  const port = Number(env("SMTP_PORT") || 465);
  return {
    from: env("MAIL_FROM") || `${BRAND} <${user}>`,
    notify: env("REQUESTS_NOTIFY_EMAIL") || CONTACT_EMAIL,
    transport: nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } }),
  };
}

/** Email the team a new request, and send the visitor a confirmation in their language. */
export async function sendRequestEmails(r: PilotRequest, id?: string): Promise<ChannelResult> {
  const m = mailer();
  if (!m) return { status: "skipped" };
  const { from, notify, transport } = m;
  const ctx = { base: baseUrl().origin, id, dbUrl: supabaseTableUrl(), receivedAt: new Date() };

  try {
    await transport.sendMail({ from, to: notify, replyTo: r.email, ...ownerEmail(r, ctx) });
    await transport.sendMail({ from, to: r.email, replyTo: notify, ...visitorEmail(r, ctx) });
    return { status: "ok" };
  } catch (e) {
    return { status: "failed", error: e instanceof Error ? e.message : String(e) };
  }
}

/** The optional "Tell us more" answers go to the team only; the visitor gets no email. */
export async function sendDetailsEmail(r: RequestBasics, details: PilotDetails, id?: string): Promise<ChannelResult> {
  const m = mailer();
  if (!m) return { status: "skipped" };
  const ctx = { base: baseUrl().origin, id, dbUrl: supabaseTableUrl(), receivedAt: new Date() };
  try {
    await m.transport.sendMail({ from: m.from, to: m.notify, replyTo: r.email, ...ownerEmail(r, ctx, details) });
    return { status: "ok" };
  } catch (e) {
    return { status: "failed", error: e instanceof Error ? e.message : String(e) };
  }
}
