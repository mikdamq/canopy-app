import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RequestFlow from "@/components/request/request-flow";
import { isFarmType } from "@/components/twin/layouts";
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
  const sp = await searchParams;
  const farm = cleanFarmName(sp.farm);
  // The farm type picked in the demo (?type=), to start the form with.
  const type = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  const farmType = isFarmType(type) ? type : undefined;
  const q = new URLSearchParams();
  if (farm) q.set("farm", farm);
  if (farmType && farmType !== "tower") q.set("type", farmType);
  const other = lang === "en" ? "ar" : "en";
  return (
    <div className="min-h-svh bg-bg">
      <SiteHeader
        lang={lang}
        nav={d.nav}
        sections={false}
        langHref={`/${other}/request${q.size ? `?${q}` : ""}`}
      />
      <main id="main" className="mx-auto w-full max-w-6xl px-4 pt-6 pb-20 sm:px-6 lg:pt-12">
        <RequestFlow
          lang={lang}
          r={d.request}
          wa={d.whatsapp}
          farm={farm}
          farmType={farmType}
          source={farm ? "demo" : "landing"}
          bookingUrl={BOOKING_URL}
          contactEmail={CONTACT_EMAIL}
        />
      </main>
    </div>
  );
}
