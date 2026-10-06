/**
 * Product-wide settings. The product name is a working name: change it here
 * and in the dictionaries when the final name is chosen.
 */
export const BRAND = "Canopy";

/** Shown in the footer and used as the reply-to on confirmation emails. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@mikdam.com";

/** Cal.com or Calendly link shown after a request is sent. Empty = show the fallback text. */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "";

/** Longest farm name we accept in the personalised demo. */
export const MAX_FARM_NAME = 40;

export function cleanFarmName(raw: string | string[] | undefined | null) {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return (v ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_FARM_NAME);
}
