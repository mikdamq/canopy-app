import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TwinApp from "@/components/twin/twin-app";
import { fmt, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cleanFarmName } from "@/lib/site";

export async function generateMetadata({ params, searchParams }: PageProps<"/[lang]/demo">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  const farm = cleanFarmName((await searchParams).farm) || d.demo.fallbackName;
  return { title: { absolute: fmt(d.meta.demoTitle, { farm }) }, robots: { index: false } };
}

export default async function DemoPage({ params, searchParams }: PageProps<"/[lang]/demo">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  const farm = cleanFarmName((await searchParams).farm);
  return (
    <TwinApp
      lang={lang}
      dict={d.demo}
      farm={farm}
      fallbackName={d.demo.fallbackName}
      langLabel={d.nav.switchLang}
      langTitle={d.nav.switchLangLabel}
    />
  );
}
