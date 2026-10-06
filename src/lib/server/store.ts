import "server-only";
import type { PilotRequest } from "@/lib/request-schema";

export type ChannelResult = { status: "ok"; id?: string } | { status: "skipped" } | { status: "failed"; error: string };

/**
 * Save a pilot request in Supabase (table `pilot_requests`, see supabase/schema.sql).
 * Uses the REST API with the service role key, so no client library is needed.
 */
export async function saveRequest(r: PilotRequest, meta: { userAgent: string }): Promise<ChannelResult> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { status: "skipped" };

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/pilot_requests`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        locale: r.locale,
        source: r.source,
        name: r.name,
        email: r.email,
        phone: r.phone,
        role: r.role,
        country: r.country,
        farm_name: r.farmName,
        farm_type: r.farmType,
        area_m2: r.areaM2,
        levels: r.levels,
        crops: r.crops,
        crops_other: r.cropsOther,
        monitoring: r.monitoring,
        sensor_brand: r.sensorBrand,
        goals: r.goals,
        message: r.message,
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
