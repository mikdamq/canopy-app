/**
 * Product-wide settings. The product name is a working name: change it here
 * and in the dictionaries when the final name is chosen.
 */
export const BRAND = "Canopy";

/** Shown in the footer and used as the reply-to on confirmation emails. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@mikdam.com";

/** WhatsApp number in international format, digits only. Empty = hide the WhatsApp buttons. */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "962787016351").replace(/\D/g, "");

export function whatsappUrl(text: string) {
  return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}` : "";
}

/** Cal.com or Calendly link shown after a request is sent. Empty = show the fallback text. */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "";

/** The live address, e.g. https://canopy.example.com. Set it once the domain is chosen. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");

/**
 * Base for absolute links (share images, canonical links, sitemap). Falls back to the
 * Vercel production address, then to localhost, so links still work before a domain is set.
 */
export function baseUrl() {
  if (SITE_URL) return new URL(SITE_URL);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL(`http://localhost:${process.env.PORT || 3000}`);
}

/** Longest farm name we accept in the personalised demo. */
export const MAX_FARM_NAME = 40;

export function cleanFarmName(raw: string | string[] | undefined | null) {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return (v ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_FARM_NAME);
}
