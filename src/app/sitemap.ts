import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { PAGE, SOLUTION_TYPES, solutionPath } from "@/lib/routes";
import { baseUrl } from "@/lib/site";

// The demo is left out on purpose: every farm name makes a new address.
const PAGES = [
  { path: PAGE.home, priority: 1 },
  { path: PAGE.product, priority: 0.9 },
  { path: PAGE.solutions, priority: 0.8 },
  ...SOLUTION_TYPES.map((t) => ({ path: solutionPath(t), priority: 0.8 })),
  { path: PAGE.pilot, priority: 0.8 },
  { path: PAGE.faq, priority: 0.7 },
  { path: PAGE.about, priority: 0.6 },
  { path: PAGE.request, priority: 0.7 },
  { path: PAGE.privacy, priority: 0.3 },
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
