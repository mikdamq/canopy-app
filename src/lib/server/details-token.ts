import "server-only";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { env } from "./env";

/**
 * A pass that lets the visitor add optional details to the request they just sent, and
 * nothing else: it names that one request and expires after two days. It's signed with a
 * server secret, so it can't be forged or pointed at another request.
 */
const TTL_MS = 48 * 3600 * 1000;

// Any server secret works; with none set (local development) a per-process one does.
const fallback = randomBytes(32).toString("hex");
const secret = () => env("REQUEST_TOKEN_SECRET") || env("SUPABASE_SERVICE_ROLE_KEY") || env("SMTP_PASS") || fallback;

const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");

export type DetailsPass = { ref: string; saved: boolean };

/** `id` is the saved row's id; without one (no database), a random reference stands in. */
export function issueDetailsToken(id?: string) {
  const ref = id ?? randomUUID();
  const body = `${ref}.${id ? 1 : 0}.${Date.now() + TTL_MS}`;
  return { ref, token: `${body}.${sign(body)}` };
}

export function readDetailsToken(token: unknown): DetailsPass | null {
  if (typeof token !== "string" || token.length > 300) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [ref, saved, exp, sig] = parts;
  const body = `${ref}.${saved}.${exp}`;
  const want = Buffer.from(sign(body));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  if (!(Number(exp) > Date.now())) return null;
  return { ref, saved: saved === "1" };
}
