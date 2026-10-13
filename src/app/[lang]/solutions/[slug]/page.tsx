import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cards, FarmImage, Faq, PageIntro, PrimaryLink, SecondaryLink, Section } from "@/components/page/blocks";
import { PageShell } from "@/components/page/page-shell";
import { LOCALES, fmt, hasLocale } from "@/i18n/config";
import { getDictionary, getPages } from "@/i18n/dictionaries";
import { PAGE, SOLUTION_SLUG, SOLUTION_TYPES, demoPath, href, solutionBySlug, solutionPath } from "@/lib/routes";
import { faqPage, service, webPage } from "@/lib/schema";
import { contentMeta } from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => SOLUTION_TYPES.map((t) => ({ lang, slug: SOLUTION_SLUG[t] })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/solutions/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = solutionBySlug(slug);
  if (!hasLocale(lang) || !t) return {};
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  return contentMeta(lang, solutionPath(t), p.solutions.items[t].meta, d.meta.ogAlt);
}

export default async function SolutionPage({ params }: PageProps<"/[lang]/solutions/[slug]">) {
  const { lang, slug } = await params;
  const t = solutionBySlug(slug);
  if (!hasLocale(lang) || !t) notFound();
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  const s = p.solutions.items[t];
  const path = solutionPath(t);
  const others = SOLUTION_TYPES.filter((o) => o !== t);

  return (
    <PageShell
      lang={lang}
      d={d}
      p={p}
      path={path}
      crumbs={[
        { name: d.nav.solutions, path: href(lang, PAGE.solutions) },
        { name: s.name, path: href(lang, path) },
      ]}
      ld={[webPage(lang, path, s.meta.title, s.meta.description), service(lang, s.title, s.meta.description, path), faqPage(s.faq)]}
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6 sm:px-6 lg:pt-12">
        <PageIntro eyebrow={s.eyebrow} title={s.title} lead={s.lead} aside={<FarmImage name={t} alt={s.imageAlt} priority />}>
          <PrimaryLink href={href(lang, demoPath(t))}>{fmt(p.common.tryType, { type: d.nav.solutionNames[t].toLowerCase() })}</PrimaryLink>
          <SecondaryLink href={href(lang, PAGE.request)}>{p.common.ctaRequest}</SecondaryLink>
        </PageIntro>
      </div>

      <Section id="challenges" title={s.challengesTitle}>
        <Cards items={s.challenges} />
      </Section>

      <Section id="helps" title={s.helpsTitle} tone="white">
        <Cards items={s.helps} />
      </Section>

      <Section id="twin" title={s.twinTitle}>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <ul className="flex flex-col gap-3">
            {s.twin.map((line) => (
              <li key={line} className="flex items-start gap-3 text-[16px] leading-relaxed">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-green text-white">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                {line}
              </li>
            ))}
          </ul>
          <FarmImage name={`${t}-zoom`} alt={s.zoomAlt} />
        </div>
      </Section>

      <Section id="faq" title={p.common.faqTitle} tone="white">
        <Faq items={s.faq} />
      </Section>

      <Section id="more" title={p.common.related}>
        <ul className="grid gap-3 sm:grid-cols-3">
          {others.map((o) => (
            <li key={o}>
              <Link
                href={href(lang, solutionPath(o))}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-5 py-4 font-semibold transition-colors hover:border-green"
              >
                {d.nav.solutionNames[o]}
                <ArrowRight className="size-4 text-green rtl:rotate-180" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
