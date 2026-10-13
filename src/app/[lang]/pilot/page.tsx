import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq, PageIntro, PrimaryLink, SecondaryLink, Section, Steps, Ticks } from "@/components/page/blocks";
import { PageShell } from "@/components/page/page-shell";
import { hasLocale } from "@/i18n/config";
import { getDictionary, getPages } from "@/i18n/dictionaries";
import { PAGE, href } from "@/lib/routes";
import { faqPage, service, webPage } from "@/lib/schema";
import { contentMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/pilot">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  return contentMeta(lang, PAGE.pilot, p.pilot.meta, d.meta.ogAlt);
}

export default async function PilotPage({ params }: PageProps<"/[lang]/pilot">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  const x = p.pilot;
  const faq = [{ q: x.priceTitle, a: x.price }, ...x.faq];

  return (
    <PageShell
      lang={lang}
      d={d}
      p={p}
      path={PAGE.pilot}
      crumbs={[{ name: d.nav.pilot, path: href(lang, PAGE.pilot) }]}
      ld={[webPage(lang, PAGE.pilot, x.meta.title, x.meta.description), service(lang, x.title, x.meta.description, PAGE.pilot), faqPage(faq)]}
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6 sm:px-6 lg:pt-12">
        <PageIntro eyebrow={x.eyebrow} title={x.title} lead={x.lead}>
          <PrimaryLink href={href(lang, PAGE.request)}>{p.common.ctaRequest}</PrimaryLink>
          <SecondaryLink href={href(lang, PAGE.demo)}>{p.common.ctaDemo}</SecondaryLink>
        </PageIntro>
        <dl className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {x.facts.map((f) => (
            <div key={f.k} className="flex flex-col gap-1 rounded-2xl bg-green p-5 text-white">
              <dt className="text-[13px] text-[#e3f4ea]">{f.k}</dt>
              <dd className="font-display text-[20px] leading-tight font-bold">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Section id="included" title={d.pilot.freeTitle} tone="white">
        <div className="grid gap-8 lg:grid-cols-2">
          <Ticks items={d.pilot.free} />
          <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-line p-6">
            <h3 className="font-display text-[18px] font-bold">{d.pilot.laterTitle}</h3>
            <ul className="flex flex-col gap-2 text-[15.5px] text-muted">
              {d.pilot.later.map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-[#8c97ab]" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="ask" title={x.askTitle}>
        <Ticks items={x.ask} />
      </Section>

      <Section id="timeline" title={x.timelineTitle} tone="white">
        <Steps items={x.timeline} />
      </Section>

      <Section id="price" title={x.priceTitle}>
        <p className="max-w-[65ch] text-[17px] leading-relaxed">{x.price}</p>
      </Section>

      <Section id="who" title={x.whoTitle} tone="white">
        <p className="max-w-[65ch] text-[17px] leading-relaxed">{x.who}</p>
      </Section>

      <Section id="faq" title={p.common.faqTitle}>
        <Faq items={x.faq} />
      </Section>
    </PageShell>
  );
}
