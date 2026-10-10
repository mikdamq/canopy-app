import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { PAGE, SOLUTION_TYPES, href, solutionPath, type SolutionType } from "@/lib/routes";

/** The site's pages, in menu order. Solutions has its own sub-list. */
export const sitePages = (lang: Locale, nav: Dict["nav"]) =>
  [
    { key: "product", href: href(lang, PAGE.product), label: nav.product },
    { key: "solutions", href: href(lang, PAGE.solutions), label: nav.solutions },
    { key: "pilot", href: href(lang, PAGE.pilot), label: nav.pilot },
    { key: "about", href: href(lang, PAGE.about), label: nav.about },
    { key: "faq", href: href(lang, PAGE.faq), label: nav.faq },
  ] as const;

export const siteSolutions = (lang: Locale, nav: Dict["nav"]) =>
  SOLUTION_TYPES.map((t: SolutionType) => ({ type: t, href: href(lang, solutionPath(t)), label: nav.solutionNames[t], hint: nav.solutionHints[t] }));
