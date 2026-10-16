import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq, PageIntro, SecondaryLink, Section } from "@/components/page/blocks";
import { GuideCard } from "@/components/page/guide";
import { PageShell } from "@/components/page/page-shell";
import { WhatsAppIcon, WhatsAppLink } from "@/components/ui/whatsapp-link";
import { hasLocale } from "@/i18n/config";
import { getDictionary, getGuides, getPages } from "@/i18n/dictionaries";
import { PAGE, href, topicOf, type Guide } from "@/lib/routes";
import { faqPage, webPage } from "@/lib/schema";
import { contentMeta } from "@/lib/seo";

/** The guides shown under the questions; the rest are one click away on the Guides page. */
const FAQ_GUIDES: Guide[] = ["guide", "twin", "energy"];

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  return contentMeta(lang, PAGE.faq, p.faq.meta, d.meta.ogAlt);
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [d, p, g] = await Promise.all([getDictionary(lang), getPages(lang), getGuides(lang)]);
  const x = p.faq;

  return (
    <PageShell
      lang={lang}
      d={d}
      p={p}
      path={PAGE.faq}
      crumbs={[{ name: d.nav.faq, path: href(lang, PAGE.faq) }]}
      ld={[webPage(lang, PAGE.faq, x.meta.title, x.meta.description), faqPage(x.groups.flatMap((g) => g.items))]}
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-2 sm:px-6 lg:pt-12">
        <PageIntro eyebrow={x.eyebrow} title={x.title} lead={x.lead}>
          <WhatsAppLink
            d={d.whatsapp}
            place="faq"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-green px-5 py-2.5 text-[15px] font-semibold text-green transition-colors hover:bg-green hover:text-white"
          >
            <WhatsAppIcon className="size-4" />
            {d.whatsapp.label}
          </WhatsAppLink>
        </PageIntro>
      </div>
      {x.groups.map((g, i) => (
        <Section key={g.t} id={`group-${i + 1}`} title={g.t}>
          <Faq items={g.items} />
        </Section>
      ))}
      <Section id="guides" title={g.index.title} lead={g.index.lead} tone="white">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FAQ_GUIDES.map((k) => {
            const t = topicOf(k);
            return <GuideCard key={k} lang={lang} g={g.items[k]} guide={k} read={g.index.read} open={g.index.open} tag={t ? g.index.topics[t].t : g.index.start} />;
          })}
        </ul>
        <div>
          <SecondaryLink href={href(lang, PAGE.learn)}>{g.index.all}</SecondaryLink>
        </div>
      </Section>
    </PageShell>
  );
}
