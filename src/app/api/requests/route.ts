import { requestSchema } from "@/lib/request-schema";
import { sendRequestEmails } from "@/lib/server/mail";
import { issueDetailsToken } from "@/lib/server/details-token";
import { saveRequest } from "@/lib/server/store";
import { limited } from "./limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(`send:${ip}`)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

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
    // console.warn, not info: some hosts (LiteSpeed on cPanel) only keep stderr in the log.
    console.warn("[pilot-request] no database or SMTP configured; request:", JSON.stringify(data));
  }

  const anyOk = stored.status === "ok" || mailed.status === "ok";
  const noneConfigured = stored.status === "skipped" && mailed.status === "skipped";
  if (!anyOk && !noneConfigured) return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });

  // `emailed` tells the thank-you screen whether a confirmation email really went out;
  // `details` lets the visitor add the optional answers to this request (and only this one).
  const pass = issueDetailsToken(stored.status === "ok" ? stored.id : undefined);
  return Response.json({ ok: true, emailed: mailed.status === "ok", details: pass.token });
}
