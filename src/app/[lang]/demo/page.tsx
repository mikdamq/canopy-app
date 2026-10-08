import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isFarmType } from "@/components/twin/layouts";
import TwinApp from "@/components/twin/twin-app";
import { fmt, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import { cleanFarmName } from "@/lib/site";

export async function generateMetadata({ params, searchParams }: PageProps<"/[lang]/demo">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  const named = cleanFarmName((await searchParams).farm);
  const farm = named || d.demo.fallbackName;
  const title = fmt(d.meta.demoTitle, { farm });
  // Not indexed (every farm name makes a new address), but shared links get a preview
  // with the farm's own name on it.
  return {
    title: { absolute: title },
    robots: { index: false },
    ...pageMeta({
      lang,
      path: "/demo",
      title,
      description: d.meta.description,
      imageAlt: named ? fmt(d.meta.ogDemoAlt, { farm: named }) : d.meta.ogAlt,
      farm: named,
      canonical: false,
    }),
  };
}

export default async function DemoPage({ params, searchParams }: PageProps<"/[lang]/demo">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  const sp = await searchParams;
  const farm = cleanFarmName(sp.farm);
  // Set by the language switch so the demo picks up where the visitor was.
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const floor = Number(one(sp.f));
  const hour = Number(one(sp.t));
  const type = one(sp.type);
  const resume = {
    floor: Number.isInteger(floor) && floor >= 0 && floor < 4 ? floor : undefined,
    hour: one(sp.t) !== undefined && hour >= 0 && hour < 24 ? hour : undefined,
    skipWelcome: one(sp.w) === "0",
  };
  return (
    <TwinApp
      lang={lang}
      dict={d.demo}
      wa={d.whatsapp}
      titleTemplate={d.meta.demoTitle}
      farm={farm}
      type={isFarmType(type) ? type : "tower"}
      resume={resume}
      fallbackName={d.demo.fallbackName}
      langLabel={d.nav.switchLang}
      langTitle={d.nav.switchLangLabel}
    />
  );
}
