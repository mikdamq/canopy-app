import "server-only";
import type { Locale } from "./config";
import type { Dict } from "./en";

const dictionaries: Record<Locale, () => Promise<Dict>> = {
  en: () => import("./en").then((m) => m.default),
  ar: () => import("./ar").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
export type { Dict };
