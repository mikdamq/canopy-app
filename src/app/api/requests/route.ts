import { requestSchema } from "@/lib/request-schema";
import { sendRequestEmails } from "@/lib/server/mail";
import { saveRequest } from "@/lib/server/store";

/** Simple per-instance limit: 5 requests per IP per 10 minutes. */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  // Honeypot: real people never fill the hidden "website" field.
  if (typeof body.website === "string" && body.website.length > 0) return Response.json({ ok: true, emailed: false });

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  }
  const data = parsed.data;

  const stored = await saveRequest(data, { userAgent: req.headers.get("user-agent") ?? "" });
  const mailed = await sendRequestEmails(data, stored.status === "ok" ? stored.id : undefined);

  if (stored.status === "failed") console.error("[pilot-request] database:", stored.error);
  if (mailed.status === "failed") console.error("[pilot-request] email:", mailed.error);
  if (stored.status === "skipped" && mailed.status === "skipped") {
    // Nothing configured yet (local development): keep the request in the server log.
    console.info("[pilot-request] no database or SMTP configured; request:", JSON.stringify(data));
  }

  const anyOk = stored.status === "ok" || mailed.status === "ok";
  const noneConfigured = stored.status === "skipped" && mailed.status === "skipped";
  if (!anyOk && !noneConfigured) return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });

  // `emailed` tells the thank-you screen whether a confirmation email really went out.
  return Response.json({ ok: true, id: stored.status === "ok" ? stored.id : undefined, emailed: mailed.status === "ok" });
}
