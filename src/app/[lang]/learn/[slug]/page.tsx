import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FarmImage, Faq, PrimaryLink, SecondaryLink, Ticks } from "@/components/page/blocks";
import { GuideBlock, GuideCard, otherGuides, readMinutes } from "@/components/page/guide";
import { ReadingProgress, TocButton } from "@/components/page/guide-client";
import { PageShell } from "@/components/page/page-shell";
import { LOCALES, fmt, hasLocale } from "@/i18n/config";
import { getDictionary, getGuides, getPages } from "@/i18n/dictionaries";
import { GUIDES, GUIDE_SLUG, PAGE, demoPath, guideBySlug, guidePath, href, solutionPath, topicOf } from "@/lib/routes";
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

/**
 * A guide, laid out like a magazine article: a green title band, the image overlapping it,
 * one narrow reading column with numbered sections, then the terms on an ink band and the
 * questions on a light green band. A progress bar and an "On this page" button help long reads.
 */
export default async function GuidePage({ params }: PageProps<"/[lang]/learn/[slug]">) {
  const { lang, slug } = await params;
  const k = guideBySlug(slug);
  if (!hasLocale(lang) || !k) notFound();
  const [d, p, g] = await Promise.all([getDictionary(lang), getPages(lang), getGuides(lang)]);
  const x = g.items[k];
  const ix = g.index;
  const path = guidePath(k);
  const topic = topicOf(k);
  const toc = [...x.sections.map((s) => ({ id: s.id, h: s.h })), { id: "faq", h: p.common.faqTitle }];

  return (
    <PageShell
      lang={lang}
      d={d}
      p={p}
      path={path}
      band
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
      <ReadingProgress target="article" />
      <article id="article">
        <header className="bg-green text-white">
          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-5 px-4 pt-10 pb-28 sm:px-6 sm:pt-14 sm:pb-40">
            <p className="flex flex-wrap items-center gap-2 text-[13px]">
              <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">{topic ? ix.topics[topic].t : ix.start}</span>
              <span className="text-[#d6efe0]">{fmt(ix.read, { n: String(readMinutes(x)) })}</span>
            </p>
            <h1 className="font-display text-[36px] leading-[1.05] font-bold tracking-[-0.02em] text-balance sm:text-[52px]">{x.title}</h1>
            <p className="text-[18px] leading-relaxed text-[#e3f4ea] sm:text-[19px]">{x.lead}</p>
            <div className="flex items-center gap-3 pt-2 text-[14px]">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white font-display text-[14px] font-bold text-green-ink" aria-hidden>
                MQ
              </span>
              <span className="flex flex-col">
                <span className="font-semibold">{ix.by}</span>
                <time dateTime={x.date} className="text-[#d6efe0]">
                  {fmt(ix.updated, { date: x.dateText })}
                </time>
              </span>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto -mt-20 w-full max-w-5xl px-4 sm:-mt-28 sm:px-6">
          <FarmImage name={x.image} alt={x.imageAlt} priority className="rounded-[28px] shadow-[0_40px_90px_-45px_rgba(20,27,43,0.6)]" />
        </div>

        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-14 px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:pb-24">
          <aside aria-labelledby="short-title" className="flex flex-col gap-4 rounded-3xl border-s-4 border-green bg-[#eaf5ee] p-6 sm:p-8">
            <h2 id="short-title" className="font-display text-[21px] font-bold text-green-ink">
              {ix.shortAnswer}
            </h2>
            <Ticks items={x.summary} />
          </aside>

          {x.sections.map((s, i) => (
            <GuideBlock key={s.id} lang={lang} s={s} n={i + 1} />
          ))}

          <div className="flex flex-wrap gap-3">
            <PrimaryLink href={href(lang, demoPath(x.demo))}>{fmt(p.common.tryType, { type: d.nav.solutionNames[x.demo].toLowerCase() })}</PrimaryLink>
            <SecondaryLink href={href(lang, PAGE.request)}>{p.common.ctaRequest}</SecondaryLink>
          </div>

          {x.sources && (
            <section aria-labelledby="sources-title" className="flex flex-col gap-3 border-t border-line pt-8">
              <h2 id="sources-title" className="text-[13px] font-semibold tracking-wide text-muted uppercase rtl:tracking-normal">
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
        </div>
      </article>

      {x.terms && (
        <section aria-labelledby="terms-title" className="bg-ink text-white">
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 py-14 sm:px-6 lg:py-20">
            <h2 id="terms-title" className="font-display text-[26px] font-bold sm:text-[30px]">
              {ix.terms}
            </h2>
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {x.terms.map((t) => (
                <div key={t.t} className="flex flex-col gap-1 border-t border-white/15 pt-4">
                  <dt className="font-display text-[17px] font-bold text-[#9fe0b8]">{t.t}</dt>
                  <dd className="text-[15px] leading-relaxed text-[#c9d1e0]">{t.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 bg-[#eaf5ee]">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 py-14 sm:px-6 lg:py-20">
          <h2 id="faq-title" className="font-display text-[26px] font-bold text-green-ink sm:text-[30px]">
            {p.common.faqTitle}
          </h2>
          <Faq items={x.faq} />
        </div>
      </section>

      <section aria-labelledby="more-title" className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 lg:py-20">
        <h2 id="more-title" className="font-display text-[26px] font-bold sm:text-[30px]">
          {ix.more}
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {otherGuides(k, topicOf).map((o) => {
            const t = topicOf(o);
            return <GuideCard key={o} lang={lang} g={g.items[o]} guide={o} read={ix.read} open={ix.open} tag={t ? ix.topics[t].t : ix.start} />;
          })}
        </ul>
        <div className="flex flex-col gap-3 pt-2">
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
      </section>

      <TocButton label={ix.onThisPage} closeLabel={ix.close} items={toc} />
    </PageShell>
  );
}
