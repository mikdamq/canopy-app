import { z } from "zod";
import { detailsSchema, hasDetails, requestSchema } from "@/lib/request-schema";
import { readDetailsToken } from "@/lib/server/details-token";
import { sendDetailsEmail } from "@/lib/server/mail";
import { addDetails } from "@/lib/server/store";
import { limited } from "../limit";

/**
 * The optional "Tell us more" answers, sent after the request. The pass from the first
 * response ties them to that one request. They reach the team only: the database row is
 * updated and the team gets an email; the visitor gets none.
 */
// Without a database, the email is built from what the browser sends back about the request.
const basicsSchema = requestSchema.omit({ consent: true });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(`details:${ip}`)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  const pass = readDetailsToken(body.token);
  if (!pass) return Response.json({ ok: false, error: "expired" }, { status: 403 });

  const parsed = z.object({ details: detailsSchema, request: basicsSchema }).safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  }
  const { details, request } = parsed.data;
  if (!hasDetails(details)) return Response.json({ ok: true });

  // With a saved request, the database's own copy of it is used for the email.
  const stored = pass.saved ? await addDetails(pass.ref, details) : ({ status: "skipped" } as const);
  const basics = stored.status === "ok" ? stored.basics : request;
  const mailed = await sendDetailsEmail(basics, details, pass.saved ? pass.ref : undefined);

  if (stored.status === "failed") console.error("[pilot-details] database:", stored.error);
  if (mailed.status === "failed") console.error("[pilot-details] email:", mailed.error);
  if (stored.status === "skipped" && mailed.status === "skipped") {
    console.warn("[pilot-details] no database or SMTP configured; details:", JSON.stringify({ ref: pass.ref, details }));
  }
  const anyOk = stored.status === "ok" || mailed.status === "ok";
  const noneConfigured = stored.status === "skipped" && mailed.status === "skipped";
  if (!anyOk && !noneConfigured) return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  return Response.json({ ok: true });
}
