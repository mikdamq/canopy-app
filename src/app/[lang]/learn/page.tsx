import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeaturedGuide, GuideCard } from "@/components/page/guide";
import { PageShell } from "@/components/page/page-shell";
import { hasLocale } from "@/i18n/config";
import { getDictionary, getGuides, getPages } from "@/i18n/dictionaries";
import { GUIDES, GUIDE_TOPIC, GUIDE_TOPICS, PAGE, guidePath, href, type Guide } from "@/lib/routes";
import { webPage } from "@/lib/schema";
import { contentMeta } from "@/lib/seo";
import { baseUrl } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/learn">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const [d, g] = await Promise.all([getDictionary(lang), getGuides(lang)]);
  return contentMeta(lang, PAGE.learn, g.index.meta, d.meta.ogAlt);
}

/** The Guides page: a green title band with topic links, the main guide featured, then the guides by topic. */
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
  const byTopic = (t: (typeof GUIDE_TOPICS)[number]) => GUIDES.filter((k): k is Exclude<Guide, "guide"> => k !== "guide" && GUIDE_TOPIC[k] === t);

  return (
    <PageShell
      lang={lang}
      d={d}
      p={p}
      path={PAGE.learn}
      crumbs={[{ name: d.nav.learn, path: href(lang, PAGE.learn) }]}
      ld={[webPage(lang, PAGE.learn, x.meta.title, x.meta.description, "CollectionPage"), list]}
    >
      <header className="band relative overflow-hidden bg-forest text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -end-40 top-10 size-[520px] rounded-full bg-[radial-gradient(circle,rgba(159,224,184,0.35),transparent_65%)]"
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-10 pb-32 sm:px-6 sm:pt-14 sm:pb-40">
          <p className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-semibold text-lime">
            <span className="size-1.5 rounded-full bg-current" aria-hidden />
            {x.eyebrow}
          </p>
          <h1 className="max-w-[18ch] font-display text-[40px] leading-[1.02] font-bold tracking-[-0.02em] text-balance sm:text-[60px]">{x.title}</h1>
          <p className="max-w-[60ch] text-[18px] leading-relaxed text-white/75">{x.lead}</p>
          <nav aria-label={x.topicsLabel} className="pt-2">
            <ul className="flex flex-wrap gap-2">
              {GUIDE_TOPICS.map((t) => (
                <li key={t}>
                  <a
                    href={`#${t}`}
                    className="inline-flex rounded-full border border-white/40 px-4 py-2 text-[14.5px] font-semibold transition-colors hover:border-lime hover:bg-lime hover:text-forest"
                  >
                    {x.topics[t].t}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="relative z-10 mx-auto -mt-24 w-full max-w-6xl px-4 sm:-mt-28 sm:px-6">
        <FeaturedGuide lang={lang} g={g.items.guide} badge={x.start} read={x.read} open={x.open} />
      </div>

      {GUIDE_TOPICS.map((t, i) => (
        <section
          key={t}
          id={t}
          aria-labelledby={`${t}-title`}
          className={i === 1 ? "mt-16 scroll-mt-24 bg-emerald text-white" : "scroll-mt-24"}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-14 sm:px-6 lg:py-20">
            <div className="flex max-w-[62ch] flex-col gap-2">
              <h2 id={`${t}-title`} className="font-display text-[28px] leading-tight font-bold sm:text-[36px]">
                {x.topics[t].t}
              </h2>
              <p className={i === 1 ? "text-[16.5px] leading-relaxed text-[#c9d1e0]" : "text-[16.5px] leading-relaxed text-muted"}>{x.topics[t].d}</p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {byTopic(t).map((k) => (
                <GuideCard key={k} lang={lang} g={g.items[k]} guide={k} read={x.read} open={x.open} dark={i === 1} />
              ))}
            </ul>
          </div>
        </section>
      ))}
    </PageShell>
  );
}
