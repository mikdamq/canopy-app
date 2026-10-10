import { Database, Lightbulb, Layers, Route, Sun, Users } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cards, FarmImage, Faq, PageIntro, PrimaryLink, SecondaryLink, Section, Steps, Ticks } from "@/components/page/blocks";
import { PageShell } from "@/components/page/page-shell";
import { hasLocale } from "@/i18n/config";
import { getDictionary, getPages } from "@/i18n/dictionaries";
import { PAGE, href } from "@/lib/routes";
import { faqPage, software, webPage } from "@/lib/schema";
import { contentMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/product">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  return contentMeta(lang, PAGE.product, p.product.meta, d.meta.ogAlt);
}

export default async function ProductPage({ params }: PageProps<"/[lang]/product">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  const x = p.product;
  const icon = "size-5";

  return (
    <PageShell
      lang={lang}
      d={d}
      p={p}
      path={PAGE.product}
      crumbs={[{ name: d.nav.product, path: href(lang, PAGE.product) }]}
      ld={[webPage(lang, PAGE.product, x.meta.title, x.meta.description), software(lang, x.meta.description), faqPage(x.faq)]}
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6 sm:px-6 lg:pt-12">
        <PageIntro
          eyebrow={x.eyebrow}
          title={x.title}
          lead={x.lead}
          aside={<FarmImage name="tower-night" alt={d.meta.ogAlt} priority />}
        >
          <PrimaryLink href={href(lang, PAGE.demo)}>{p.common.ctaDemo}</PrimaryLink>
          <SecondaryLink href={href(lang, PAGE.request)}>{p.common.ctaRequest}</SecondaryLink>
        </PageIntro>
      </div>

      <Section id="what" title={x.whatTitle}>
        <div className="grid max-w-[70ch] gap-4 text-[16.5px] leading-relaxed">
          {x.what.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </Section>

      <Section id="views" title={x.viewsTitle} tone="white">
        <Cards items={x.views} cols={4} icons={[<Layers key="a" className={icon} />, <Lightbulb key="b" className={icon} />, <Route key="c" className={icon} />, <Sun key="d" className={icon} />]} />
      </Section>

      <Section id="data" title={x.dataTitle} lead={x.dataLead}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
            <h3 className="flex items-center gap-2 font-display text-[18px] font-bold">
              <Database className="size-5 text-green" aria-hidden />
              {x.nowTitle}
            </h3>
            <Ticks items={d.pilot.free} />
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-line p-6">
            <h3 className="font-display text-[18px] font-bold">{x.laterTitle}</h3>
            <ul className="flex flex-col gap-2.5 text-[15.5px] text-muted">
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

      <Section id="setup" title={x.setupTitle} tone="white">
        <Steps items={x.setup} />
      </Section>

      <Section id="roles" title={x.rolesTitle}>
        <Cards items={d.who.items} icons={[<Users key="a" className={icon} />, <Lightbulb key="b" className={icon} />, <Route key="c" className={icon} />]} />
      </Section>

      <Section id="faq" title={p.common.faqTitle}>
        <Faq items={x.faq} />
      </Section>
    </PageShell>
  );
}
