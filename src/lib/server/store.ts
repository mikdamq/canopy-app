import "server-only";
import type { PilotDetails, PilotRequest, RequestBasics } from "@/lib/request-schema";
import { env } from "./env";

export type ChannelResult = { status: "ok"; id?: string } | { status: "skipped" } | { status: "failed"; error: string };

/**
 * Save a pilot request in Supabase (table `pilot_requests`, see supabase/schema.sql).
 * Uses the REST API with the service role key, so no client library is needed.
 * Works with either kind of server key: the legacy `service_role` key (a JWT, also sent
 * as a Bearer token) or a newer secret key (`sb_secret_…`, sent only as `apikey`).
 */
function supabase() {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  return {
    table: `${url.replace(/\/$/, "")}/rest/v1/pilot_requests`,
    headers: {
      apikey: key,
      ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  };
}

export async function saveRequest(r: PilotRequest, meta: { userAgent: string }): Promise<ChannelResult> {
  const db = supabase();
  if (!db) return { status: "skipped" };

  try {
    const res = await fetch(db.table, {
      method: "POST",
      headers: db.headers,
      body: JSON.stringify({
        locale: r.locale,
        source: r.source,
        name: r.name,
        email: r.email,
        phone: r.phone,
        country: r.country,
        farm_name: r.farmName,
        farm_type: r.farmType,
        user_agent: meta.userAgent.slice(0, 300),
      }),
      cache: "no-store",
    });
    if (!res.ok) return { status: "failed", error: `Supabase ${res.status}: ${(await res.text()).slice(0, 300)}` };
    const rows = (await res.json()) as { id?: string }[];
    return { status: "ok", id: rows[0]?.id };
  } catch (e) {
    return { status: "failed", error: e instanceof Error ? e.message : String(e) };
  }
}

/** Add the optional "Tell us more" answers to a saved request; returns the request's basics. */
export async function addDetails(id: string, d: PilotDetails): Promise<{ status: "ok"; basics: RequestBasics } | { status: "skipped" } | { status: "failed"; error: string }> {
  const db = supabase();
  if (!db) return { status: "skipped" };
  try {
    const res = await fetch(`${db.table}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: db.headers,
      body: JSON.stringify({
        role: d.role ?? null,
        area_m2: d.areaM2 ?? null,
        levels: d.levels ?? null,
        crops: d.crops,
        crops_other: d.cropsOther,
        monitoring: d.monitoring ?? null,
        sensor_brand: d.sensorBrand,
        goals: d.goals,
        message: d.message,
      }),
      cache: "no-store",
    });
    if (!res.ok) return { status: "failed", error: `Supabase ${res.status}: ${(await res.text()).slice(0, 300)}` };
    const row = ((await res.json()) as Record<string, string>[])[0];
    if (!row) return { status: "failed", error: "Supabase: request not found" };
    return {
      status: "ok",
      basics: {
        locale: row.locale as RequestBasics["locale"],
        source: row.source,
        name: row.name,
        email: row.email,
        phone: row.phone,
        country: row.country,
        farmName: row.farm_name,
        farmType: row.farm_type as RequestBasics["farmType"],
      },
    };
  } catch (e) {
    return { status: "failed", error: e instanceof Error ? e.message : String(e) };
  }
}
