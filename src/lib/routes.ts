import type { Locale } from "@/i18n/config";

/** The content pages, after the language: `/en/product`, `/ar/pilot`… */
export const PAGE = {
  home: "",
  product: "/product",
  solutions: "/solutions",
  pilot: "/pilot",
  about: "/about",
  faq: "/faq",
  learn: "/learn",
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

/** The guides (short articles under /learn). Addresses are the same in both languages. */
export const GUIDES = ["guide", "twin", "tracking", "energy", "cost", "lights", "water", "failures", "heat", "compare", "containers"] as const;
export type Guide = (typeof GUIDES)[number];

export const GUIDE_SLUG: Record<Guide, string> = {
  guide: "indoor-farm-guide",
  energy: "vertical-farm-energy-per-kg",
  failures: "why-vertical-farms-fail",
  cost: "cost-per-kg",
  lights: "light-recipes",
  water: "hydroponics-water-use",
  heat: "gulf-heat-indoor-farming",
  containers: "container-farm-software",
  twin: "what-is-a-farm-digital-twin",
  tracking: "seed-to-delivery-tracking",
  compare: "container-vs-vertical-farm",
};

export const guideBySlug = (slug: string) => GUIDES.find((g) => GUIDE_SLUG[g] === slug);
export const guidePath = (g: Guide) => `${PAGE.learn}/${GUIDE_SLUG[g]}`;

export const href = (lang: Locale, path: string) => `/${lang}${path}`;

/** The demo, opened on a farm type (the tower is its default). */
export const demoPath = (t: SolutionType) => (t === "tower" ? PAGE.demo : `${PAGE.demo}?type=${t}`);
