import type { Locale } from "@/i18n/config";
import { BRAND, BRAND_AR, CONTACT_EMAIL, WHATSAPP_NUMBER, baseUrl } from "./site";

/**
 * Structured data (JSON-LD, schema.org) for search engines and AI tools. Plain objects;
 * `<JsonLd>` writes them into the page. Facts here must match the visible page copy.
 */
type Thing = Record<string, unknown>;

const abs = (path: string) => new URL(path, baseUrl()).href;
const AREA = ["Jordan", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"];
const ORG_ID = () => abs("/#organization");
const SITE_ID = () => abs("/#website");

export function organization(): Thing {
  return {
    "@type": "Organization",
    "@id": ORG_ID(),
    name: BRAND,
    alternateName: BRAND_AR,
    url: abs("/"),
    logo: abs("/icon.svg"),
    email: CONTACT_EMAIL,
    ...(WHATSAPP_NUMBER ? { telephone: `+${WHATSAPP_NUMBER}` } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
    areaServed: AREA.map((name) => ({ "@type": "Country", name })),
    founder: { "@type": "Person", name: "Mikdam Qandil", jobTitle: "Founder" },
    knowsAbout: ["vertical farming", "indoor farming", "container farms", "hydroponic greenhouses", "digital twins", "farm management software"],
  };
}

export function website(lang: Locale): Thing {
  return {
    "@type": "WebSite",
    "@id": SITE_ID(),
    name: BRAND,
    url: abs("/"),
    inLanguage: ["en", "ar"],
    publisher: { "@id": ORG_ID() },
    ...(lang === "ar" ? { alternateName: BRAND_AR } : {}),
  };
}

export function software(lang: Locale, description: string): Thing {
  return {
    "@type": "SoftwareApplication",
    name: BRAND,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Farm management software",
    operatingSystem: "Web browser",
    description,
    url: abs(`/${lang}/product`),
    publisher: { "@id": ORG_ID() },
    offers: {
      "@type": "Offer",
      name: lang === "ar" ? "تجربة مجانية لمدة 3 أشهر" : "Free 3-month pilot",
      price: "0",
      priceCurrency: "USD",
      url: abs(`/${lang}/pilot`),
    },
  };
}

export function webPage(lang: Locale, path: string, name: string, description: string, type = "WebPage"): Thing {
  return {
    "@type": type,
    "@id": abs(`/${lang}${path}#page`),
    url: abs(`/${lang}${path}`),
    name,
    description,
    inLanguage: lang,
    isPartOf: { "@id": SITE_ID() },
    publisher: { "@id": ORG_ID() },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]): Thing {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqPage(items: { q: string; a: string }[]): Thing {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
  };
}

export function service(lang: Locale, name: string, description: string, path: string): Thing {
  return {
    "@type": "Service",
    name,
    description,
    url: abs(`/${lang}${path}`),
    provider: { "@id": ORG_ID() },
    areaServed: AREA.map((name) => ({ "@type": "Country", name })),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: lang === "ar" ? "مجانًا لمدة 3 أشهر" : "Free for 3 months" },
  };
}

/** One `<script type="application/ld+json">` holding a graph of things. */
export function graph(...things: Thing[]) {
  return { "@context": "https://schema.org", "@graph": things };
}
