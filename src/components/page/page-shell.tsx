import { ArrowRight, ChevronRight } from "lucide-react";
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
 * The frame every content page shares: a forest band with the site header, a breadcrumb
 * trail and the page's opening (`intro`), then the page, a closing call to action, the
 * footer, and the page's structured data. `path` is the page's address after the language;
 * `crumbs` lists the pages above it (Home is added). Pages with their own forest header
 * (the guides) leave `intro` out and start their children with it.
 */
export function PageShell({
  lang,
  d,
  p,
  path,
  crumbs,
  ld,
  intro,
  children,
}: {
  lang: Locale;
  d: Dict;
  p: PagesDict;
  path: string;
  crumbs: Crumb[];
  ld: Record<string, unknown>[];
  intro?: ReactNode;
  children: ReactNode;
}) {
  const other = lang === "en" ? "ar" : "en";
  const trail: Crumb[] = [{ name: p.common.home, path: href(lang, PAGE.home) }, ...crumbs];
  return (
    <div className="flex min-h-svh flex-col bg-bg">
      <div className="band relative overflow-hidden bg-forest text-white">
        {intro && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_90%_0%,rgba(198,240,77,0.13),transparent_60%)]"
          />
        )}
        <div className="relative">
          <SiteHeader lang={lang} nav={d.nav} wa={d.whatsapp} langHref={`/${other}${path}`} />
          <nav aria-label={p.common.breadcrumb} className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-white/60">
              {trail.map((c, i) => (
                <li key={c.path} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden />}
                  {i < trail.length - 1 ? (
                    <Link href={c.path} className="underline-offset-4 hover:text-white hover:underline">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="line-clamp-1 font-semibold text-white">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {intro && <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6 lg:pt-12 lg:pb-24">{intro}</div>}
        </div>
      </div>
      <main id="main" className="flex-1">
        {children}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col items-start gap-6 rounded-[32px] bg-lime px-6 py-10 text-forest sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-[52ch] flex-col gap-2">
              <h2 className="text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance sm:text-[36px]">{p.common.ctaTitle}</h2>
              <p className="text-[15.5px] leading-relaxed text-forest/75">{p.common.ctaSub}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={href(lang, PAGE.request)}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-emerald"
              >
                {p.common.ctaRequest}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
              <Link
                href={href(lang, PAGE.demo)}
                className="rounded-full border-2 border-forest/30 px-5 py-2.5 text-[15px] font-bold transition-colors hover:border-forest"
              >
                {p.common.ctaDemo}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} d={d} />
      <JsonLd data={graph(...ld, breadcrumbLd(trail))} />
    </div>
  );
}

export { PrimaryLink, SecondaryLink };
