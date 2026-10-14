import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page/blocks";
import { GuideCard } from "@/components/page/guide";
import { PageShell } from "@/components/page/page-shell";
import { hasLocale } from "@/i18n/config";
import { getDictionary, getGuides, getPages } from "@/i18n/dictionaries";
import { GUIDES, PAGE, guidePath, href } from "@/lib/routes";
import { webPage } from "@/lib/schema";
import { contentMeta } from "@/lib/seo";
import { baseUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/learn">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const [d, g] = await Promise.all([getDictionary(lang), getGuides(lang)]);
  return contentMeta(lang, PAGE.learn, g.index.meta, d.meta.ogAlt);
}

export default async function LearnPage({ params }: PageProps<"/[lang]/learn">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [d, p, g] = await Promise.all([getDictionary(lang), getPages(lang), getGuides(lang)]);
  const x = g.index;
  const list = {
    "@type": "ItemList",
    itemListElement: GUIDES.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.items[k].title,
      url: new URL(href(lang, guidePath(k)), baseUrl()).href,
    })),
  };

  return (
    <PageShell
      lang={lang}
      d={d}
      p={p}
      path={PAGE.learn}
      crumbs={[{ name: d.nav.learn, path: href(lang, PAGE.learn) }]}
      ld={[webPage(lang, PAGE.learn, x.meta.title, x.meta.description, "CollectionPage"), list]}
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-2 sm:px-6 lg:pt-12">
        <PageIntro eyebrow={x.eyebrow} title={x.title} lead={x.lead} />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((k) => (
            <GuideCard key={k} lang={lang} g={g.items[k]} guide={k} read={x.read} open={x.open} />
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
