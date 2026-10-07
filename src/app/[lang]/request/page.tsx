import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RequestFlow from "@/components/request/request-flow";
import { SiteHeader } from "@/components/ui/site-header";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import { BOOKING_URL, BRAND, CONTACT_EMAIL, cleanFarmName } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/request">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return {
    title: d.meta.requestTitle,
    ...pageMeta({ lang, path: "/request", title: `${d.meta.requestTitle} · ${BRAND}`, description: d.meta.description, imageAlt: d.meta.ogAlt }),
  };
}

export default async function RequestPage({ params, searchParams }: PageProps<"/[lang]/request">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  const farm = cleanFarmName((await searchParams).farm);
  const other = lang === "en" ? "ar" : "en";
  return (
    <div className="min-h-svh bg-bg">
      <SiteHeader
        lang={lang}
        nav={d.nav}
        sections={false}
        langHref={`/${other}/request${farm ? `?farm=${encodeURIComponent(farm)}` : ""}`}
      />
      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-20 sm:px-6 lg:pt-12">
        <RequestFlow
          lang={lang}
          r={d.request}
          farm={farm}
          source={farm ? "demo" : "landing"}
          bookingUrl={BOOKING_URL}
          contactEmail={CONTACT_EMAIL}
        />
      </main>
    </div>
  );
}
