import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/analytics";
import { LOCALES, dirOf, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { BRAND, baseUrl, brandName } from "@/lib/site";
import "../globals.css";

const latinDisplay = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--cf-latin-display" });
const latin = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--cf-latin" });
const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"], variable: "--cf-arabic" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--cf-mono" });

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  // Each page adds its own canonical link, language alternates and share image (see lib/seo.ts).
  return {
    metadataBase: baseUrl(),
    title: { default: d.meta.title, template: `%s · ${brandName(lang)}` },
    description: d.meta.description,
    applicationName: BRAND,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${latinDisplay.variable} ${latin.variable} ${arabic.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <a
          href="#main"
          className="sr-only z-[80] rounded-full bg-ink px-4 py-2 text-[14px] font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {d.nav.skip}
        </a>
        {children}
        <Analytics lang={lang} d={d.consent} />
      </body>
    </html>
  );
}
