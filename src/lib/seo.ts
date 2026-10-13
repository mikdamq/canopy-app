import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/i18n/config";
import { BRAND } from "./site";

const OG_LOCALE: Record<Locale, string> = { en: "en_US", ar: "ar_JO" };

/**
 * Canonical link, language alternates, and the Open Graph / Twitter tags for one page.
 * `path` is the part after the language, e.g. "" or "/privacy". `query` is kept on the
 * alternates and share image (used for the personalised demo link).
 */
export function pageMeta({
  lang,
  path,
  title,
  description,
  imageAlt,
  farm,
  canonical = true,
}: {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  imageAlt: string;
  farm?: string;
  canonical?: boolean;
}): Metadata {
  const q = farm ? `?farm=${encodeURIComponent(farm)}` : "";
  const url = `/${lang}${path}${q}`;
  const languages = Object.fromEntries([
    ...LOCALES.map((l) => [l, `/${l}${path}${q}`]),
    ["x-default", `/en${path}${q}`],
  ]);
  const image = {
    url: `/api/og?lang=${lang}${farm ? `&farm=${encodeURIComponent(farm)}` : ""}`,
    width: 1200,
    height: 630,
    alt: imageAlt,
  };
  return {
    description,
    alternates: { ...(canonical ? { canonical: url } : {}), languages },
    openGraph: {
      type: "website",
      siteName: BRAND,
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      url,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** Metadata for a content page: its own title (the layout adds " · Lamina"), description and links. */
export function contentMeta(lang: Locale, path: string, meta: { title: string; description: string }, imageAlt: string): Metadata {
  return {
    title: meta.title,
    ...pageMeta({ lang, path, title: `${meta.title} · ${lang === "ar" ? "لامينا" : BRAND}`, description: meta.description, imageAlt }),
  };
}
