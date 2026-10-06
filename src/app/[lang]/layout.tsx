import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { LOCALES, dirOf, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
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
  return {
    title: { default: d.meta.title, template: `%s · Canopy` },
    description: d.meta.description,
    alternates: { languages: { en: "/en", ar: "/ar" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${latinDisplay.variable} ${latin.variable} ${arabic.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
