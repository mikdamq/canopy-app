import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FarmImage, PageIntro } from "@/components/page/blocks";
import { PageShell } from "@/components/page/page-shell";
import { fmt, hasLocale } from "@/i18n/config";
import { getDictionary, getPages } from "@/i18n/dictionaries";
import { PAGE, SOLUTION_TYPES, href, solutionPath } from "@/lib/routes";
import { webPage } from "@/lib/schema";
import { contentMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/solutions">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  return contentMeta(lang, PAGE.solutions, p.solutions.meta, d.meta.ogAlt);
}

export default async function SolutionsPage({ params }: PageProps<"/[lang]/solutions">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  const x = p.solutions;

  return (
    <PageShell
      lang={lang}
      d={d}
      p={p}
      path={PAGE.solutions}
      crumbs={[{ name: d.nav.solutions, path: href(lang, PAGE.solutions) }]}
      ld={[webPage(lang, PAGE.solutions, x.meta.title, x.meta.description, "CollectionPage")]}
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6 sm:px-6 lg:pt-12">
        <PageIntro eyebrow={x.eyebrow} title={x.title} lead={x.lead} />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-16 sm:px-6 lg:pb-20">
        <ul className="grid gap-5 sm:grid-cols-2">
          {SOLUTION_TYPES.map((t, i) => {
            const s = x.items[t];
            return (
              <li key={t}>
                <Link
                  href={href(lang, solutionPath(t))}
                  className="group flex h-full flex-col gap-4 rounded-3xl border border-line bg-white p-4 transition-colors hover:border-green sm:p-5"
                >
                  <FarmImage name={t} alt={s.imageAlt} priority={i < 2} className="rounded-2xl" />
                  <div className="flex flex-col gap-2 px-1 pb-1">
                    <h2 className="font-display text-[22px] font-bold">{s.name}</h2>
                    <p className="text-[15px] leading-relaxed text-muted">{s.lead}</p>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-[15px] font-semibold text-green">
                      {fmt(x.see, { type: s.name.toLowerCase() })}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </PageShell>
  );
}
