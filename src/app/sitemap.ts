import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { baseUrl } from "@/lib/site";

// The demo is left out on purpose: every farm name makes a new address.
const PAGES = [
  { path: "", priority: 1 },
  { path: "/request", priority: 0.8 },
  { path: "/privacy", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => new URL(p, baseUrl()).href;
  return PAGES.flatMap(({ path, priority }) =>
    LOCALES.map((lang) => ({
      url: url(`/${lang}${path}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, url(`/${l}${path}`)])) },
    })),
  );
}
