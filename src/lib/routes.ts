import type { Locale } from "@/i18n/config";

/** The content pages, after the language: `/en/product`, `/ar/pilot`… */
export const PAGE = {
  home: "",
  product: "/product",
  solutions: "/solutions",
  pilot: "/pilot",
  about: "/about",
  faq: "/faq",
  demo: "/demo",
  request: "/request",
  privacy: "/privacy",
} as const;

/** The four farm types with their own Solutions page. Addresses are the same in both languages. */
export const SOLUTION_TYPES = ["tower", "container", "greenhouse", "lab"] as const;
export type SolutionType = (typeof SOLUTION_TYPES)[number];

export const SOLUTION_SLUG: Record<SolutionType, string> = {
  tower: "vertical-farms",
  container: "container-farms",
  greenhouse: "greenhouses",
  lab: "research-labs",
};

export const solutionBySlug = (slug: string) => SOLUTION_TYPES.find((t) => SOLUTION_SLUG[t] === slug);
export const solutionPath = (t: SolutionType) => `${PAGE.solutions}/${SOLUTION_SLUG[t]}`;

export const href = (lang: Locale, path: string) => `/${lang}${path}`;

/** The demo, opened on a farm type (the tower is its default). */
export const demoPath = (t: SolutionType) => (t === "tower" ? PAGE.demo : `${PAGE.demo}?type=${t}`);
