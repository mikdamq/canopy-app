/**
 * Product-wide settings. The brand is Lamina (لامينا); the logo and technical names
 * use the Latin spelling, and Arabic copy uses `brandName("ar")`.
 */
export const BRAND = "Lamina";
export const BRAND_AR = "لامينا";

/** The brand name as it reads in running text in each language. */
export const brandName = (lang: string) => (lang === "ar" ? BRAND_AR : BRAND);

/** Shown in the footer and used as the reply-to on confirmation emails. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@laminafarm.app";

/** WhatsApp number in international format, digits only. Unset or empty = the default number; "none" hides the WhatsApp buttons. */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "962787016351").replace(/\D/g, "");

export function whatsappUrl(text: string) {
  return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}` : "";
}

/** Cal.com or Calendly link shown after a request is sent. Empty = show the fallback text. */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "";

/** The live address, https://laminafarm.app once the domain is connected. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");

/**
 * Base for absolute links (share images, canonical links, sitemap). Falls back to the
 * site's main address on Netlify (`URL`, set by Netlify itself), then to localhost, so
 * links still work before a domain is set.
 */
export function baseUrl() {
  if (SITE_URL) return new URL(SITE_URL);
  const netlify = process.env.URL;
  if (netlify?.startsWith("http")) return new URL(netlify);
  return new URL(`http://localhost:${process.env.PORT || 3000}`);
}

/** Longest farm name we accept in the personalised demo. */
export const MAX_FARM_NAME = 40;

export function cleanFarmName(raw: string | string[] | undefined | null) {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return (v ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_FARM_NAME);
}
