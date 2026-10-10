import "server-only";
import type { Locale } from "./config";
import type { Dict } from "./en";
import type { PagesDict } from "./pages-en";

const dictionaries: Record<Locale, () => Promise<Dict>> = {
  en: () => import("./en").then((m) => m.default),
  ar: () => import("./ar").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
export type { Dict };

const pages: Record<Locale, () => Promise<PagesDict>> = {
  en: () => import("./pages-en").then((m) => m.default),
  ar: () => import("./pages-ar").then((m) => m.default),
};

/** Copy for the content pages (Product, Solutions, Pilot, About, FAQ). */
export const getPages = (locale: Locale) => pages[locale]();
export type { PagesDict };
