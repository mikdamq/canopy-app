import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import type { Locale } from "@/i18n/config";
import type { Dict, PagesDict } from "@/i18n/dictionaries";
import { PAGE, href } from "@/lib/routes";
import { breadcrumbs as breadcrumbLd, graph } from "@/lib/schema";
import { PrimaryLink, SecondaryLink } from "./blocks";
import { JsonLd } from "./json-ld";

export type Crumb = { name: string; path: string };

/**
 * The frame every content page shares: the site header, a breadcrumb trail, the page,
 * a closing call to action, the footer, and the page's structured data. `path` is the
 * page's address after the language; `crumbs` lists the pages above it (Home is added).
 */
export function PageShell({
  lang,
  d,
  p,
  path,
  crumbs,
  ld,
  children,
}: {
  lang: Locale;
  d: Dict;
  p: PagesDict;
  path: string;
  crumbs: Crumb[];
  ld: Record<string, unknown>[];
  children: ReactNode;
}) {
  const other = lang === "en" ? "ar" : "en";
  const trail: Crumb[] = [{ name: p.common.home, path: href(lang, PAGE.home) }, ...crumbs];
  return (
    <div className="flex min-h-svh flex-col bg-bg">
      <SiteHeader lang={lang} nav={d.nav} wa={d.whatsapp} langHref={`/${other}${path}`} />
      <main id="main" className="flex-1">
        <nav aria-label={p.common.breadcrumb} className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
            {trail.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden />}
                {i < trail.length - 1 ? (
                  <Link href={c.path} className="underline-offset-4 hover:text-ink hover:underline">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-ink">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {children}
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
          <div className="flex flex-col items-start gap-5 rounded-3xl bg-green px-6 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-[52ch] flex-col gap-2">
              <h2 className="font-display text-[26px] leading-tight font-bold text-balance sm:text-[30px]">{p.common.ctaTitle}</h2>
              <p className="text-[15.5px] leading-relaxed text-[#e3f4ea]">{p.common.ctaSub}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={href(lang, PAGE.request)}
                className="rounded-xl bg-white px-5 py-3 text-[15px] font-semibold text-green-ink transition-colors hover:bg-[#eaf5ee]"
              >
                {p.common.ctaRequest}
              </Link>
              <Link
                href={href(lang, PAGE.demo)}
                className="rounded-xl border-2 border-white/70 px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                {p.common.ctaDemo}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} d={d.footer} nav={d.nav} wa={d.whatsapp} />
      <JsonLd data={graph(...ld, breadcrumbLd(trail))} />
    </div>
  );
}

export { PrimaryLink, SecondaryLink };
