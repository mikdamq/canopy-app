import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FarmImage, Faq, PrimaryLink, SecondaryLink, Section, Ticks } from "@/components/page/blocks";
import { GuideBlock, GuideCard, otherGuides, readMinutes } from "@/components/page/guide";
import { PageShell } from "@/components/page/page-shell";
import { LOCALES, fmt, hasLocale } from "@/i18n/config";
import { getDictionary, getGuides, getPages } from "@/i18n/dictionaries";
import { GUIDES, GUIDE_SLUG, PAGE, demoPath, guideBySlug, guidePath, href, solutionPath } from "@/lib/routes";
import { article, faqPage, webPage } from "@/lib/schema";
import { contentMeta } from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => GUIDES.map((g) => ({ lang, slug: GUIDE_SLUG[g] })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/learn/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const k = guideBySlug(slug);
  if (!hasLocale(lang) || !k) return {};
  const [d, g] = await Promise.all([getDictionary(lang), getGuides(lang)]);
  const meta = contentMeta(lang, guidePath(k), g.items[k].meta, d.meta.ogAlt);
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: g.items[k].date } };
}

export default async function GuidePage({ params }: PageProps<"/[lang]/learn/[slug]">) {
  const { lang, slug } = await params;
  const k = guideBySlug(slug);
  if (!hasLocale(lang) || !k) notFound();
  const [d, p, g] = await Promise.all([getDictionary(lang), getPages(lang), getGuides(lang)]);
  const x = g.items[k];
  const ix = g.index;
  const path = guidePath(k);

  return (
    <PageShell
      lang={lang}
      d={d}
      p={p}
      path={path}
      crumbs={[
        { name: d.nav.learn, path: href(lang, PAGE.learn) },
        { name: x.title, path: href(lang, path) },
      ]}
      ld={[
        webPage(lang, path, x.meta.title, x.meta.description),
        article(lang, path, {
          title: x.title,
          description: x.meta.description,
          date: x.date,
          image: x.image,
          section: d.nav.learn,
          tech: x.kind === "tech",
          sources: x.sources,
          about: x.about,
        }),
        faqPage(x.faq),
      ]}
    >
      <article>
        <header className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-8 sm:px-6 lg:pt-12">
          <p className="font-mono text-[12px] tracking-[0.12em] text-green uppercase">{x.eyebrow}</p>
          <h1 className="max-w-[24ch] font-display text-[34px] leading-[1.06] font-bold tracking-[-0.02em] text-balance sm:text-[46px]">{x.title}</h1>
          <p className="max-w-[64ch] text-[17px] leading-relaxed text-muted sm:text-[18px]">{x.lead}</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-[13.5px] text-muted">
            <span>{ix.by}</span>
            <span aria-hidden>·</span>
            <time dateTime={x.date}>{fmt(ix.updated, { date: x.dateText })}</time>
            <span aria-hidden>·</span>
            <span>{fmt(ix.read, { n: String(readMinutes(x)) })}</span>
          </p>
        </header>

        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
          <aside aria-labelledby="short-title" className="flex flex-col gap-4 rounded-3xl border border-[#cfe6d8] bg-[#eaf5ee] p-6 sm:p-7">
            <h2 id="short-title" className="font-display text-[20px] font-bold text-green-ink">
              {ix.shortAnswer}
            </h2>
            <Ticks items={x.summary} />
          </aside>
          <FarmImage name={x.image} alt={x.imageAlt} priority />
        </div>

        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16 lg:py-20">
          <nav aria-labelledby="toc-title" className="lg:sticky lg:top-28 lg:self-start">
            <p id="toc-title" className="mb-3 text-[13px] font-semibold tracking-wide text-muted uppercase rtl:tracking-normal">
              {ix.contents}
            </p>
            <ol className="flex flex-col gap-2 border-s-2 border-line ps-4 text-[14.5px]">
              {x.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted underline-offset-4 hover:text-ink hover:underline">
                    {s.h}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="text-muted underline-offset-4 hover:text-ink hover:underline">
                  {p.common.faqTitle}
                </a>
              </li>
            </ol>
          </nav>
          <div className="flex min-w-0 max-w-[70ch] flex-col gap-12">
            {x.sections.map((s) => (
              <GuideBlock key={s.id} lang={lang} s={s} />
            ))}
            {x.terms && (
              <aside aria-labelledby="terms-title" className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 sm:p-6">
                <h2 id="terms-title" className="font-display text-[18px] font-bold">
                  {ix.terms}
                </h2>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {x.terms.map((t) => (
                    <div key={t.t} className="flex flex-col gap-0.5">
                      <dt className="text-[14.5px] font-semibold text-green-ink">{t.t}</dt>
                      <dd className="text-[14.5px] leading-relaxed text-muted">{t.d}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            )}
            {x.sources && (
              <section aria-labelledby="sources-title" className="flex flex-col gap-3">
                <h2 id="sources-title" className="font-display text-[18px] font-bold">
                  {ix.sources}
                </h2>
                <ol className="flex list-decimal flex-col gap-2 ps-5 text-[14px] leading-relaxed text-muted marker:text-muted" dir="ltr">
                  {x.sources.map((src) => (
                    <li key={src.url}>
                      <a href={src.url} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-ink">
                        {src.t}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <div className="flex flex-wrap gap-3">
              <PrimaryLink href={href(lang, demoPath(x.demo))}>{fmt(p.common.tryType, { type: d.nav.solutionNames[x.demo].toLowerCase() })}</PrimaryLink>
              <SecondaryLink href={href(lang, PAGE.request)}>{p.common.ctaRequest}</SecondaryLink>
            </div>
          </div>
        </div>
      </article>

      <Section id="faq" title={p.common.faqTitle} tone="white">
        <Faq items={x.faq} />
      </Section>

      <Section id="more" title={ix.more}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {otherGuides(k).map((o) => (
            <GuideCard key={o} lang={lang} g={g.items[o]} guide={o} read={ix.read} open={ix.open} />
          ))}
        </ul>
        <div className="flex flex-col gap-3 pt-4">
          <p className="text-[13px] font-semibold tracking-wide text-muted uppercase rtl:tracking-normal">{ix.farmTypes}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {x.solutions.map((t) => (
              <li key={t}>
                <Link
                  href={href(lang, solutionPath(t))}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-5 py-4 font-semibold transition-colors hover:border-green"
                >
                  {d.nav.solutionNames[t]}
                  <ArrowRight className="size-4 text-green rtl:rotate-180" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </PageShell>
  );
}
