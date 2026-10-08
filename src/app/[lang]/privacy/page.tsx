import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { fmt, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import { BRAND, CONTACT_EMAIL } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return {
    title: d.meta.privacyTitle,
    ...pageMeta({
      lang,
      path: "/privacy",
      title: `${d.meta.privacyTitle} · ${BRAND}`,
      description: d.meta.privacyDescription,
      imageAlt: d.meta.ogAlt,
    }),
  };
}

/** Fill {brand} and turn {email} into a mail link. */
function Para({ text }: { text: string }) {
  const parts = fmt(text, { brand: BRAND }).split("{email}");
  return (
    <p>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-green-ink underline underline-offset-4" dir="ltr">
              {CONTACT_EMAIL}
            </a>
          )}
        </Fragment>
      ))}
    </p>
  );
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  const p = d.privacy;
  const other = lang === "en" ? "ar" : "en";

  return (
    <div className="flex min-h-svh flex-col bg-bg">
      <SiteHeader lang={lang} nav={d.nav} sections={false} langHref={`/${other}/privacy`} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-20 sm:px-6 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          {/* Contents, pinned on wide screens */}
          <nav aria-label={p.title} className="hidden lg:block">
            <ol className="sticky top-8 flex flex-col gap-2 text-[14px] text-muted">
              {p.sections.map((s, i) => (
                <li key={s.t}>
                  <a href={`#s${i + 1}`} className="flex gap-3 transition-colors hover:text-ink">
                    <span className="font-mono text-[12px] text-green" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.t}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-[68ch] min-w-0">
            <p className="font-mono text-[12px] tracking-[0.12em] text-green uppercase">{p.eyebrow}</p>
            <h1 className="mt-3 font-display text-[36px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[48px]">{p.title}</h1>
            <p className="mt-3 text-[13px] text-muted">{p.updated}</p>
            <p className="mt-6 text-[17px] leading-relaxed">{fmt(p.intro, { brand: BRAND })}</p>

            <div className="mt-10 flex flex-col gap-10">
              {p.sections.map((s, i) => (
                <section key={s.t} id={`s${i + 1}`} className="scroll-mt-8 border-t border-line pt-6">
                  <h2 className="flex items-baseline gap-3 font-display text-[22px] font-bold tracking-[-0.01em] sm:text-[24px]">
                    <span className="font-mono text-[13px] font-normal text-green" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.t}
                  </h2>
                  <div className="mt-3 flex flex-col gap-3 text-[15.5px] leading-relaxed text-[#2b3447]">
                    {s.p.map((t) => (
                      <Para key={t} text={t} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <Link
              href={`/${lang}`}
              className="mt-12 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold transition-colors hover:border-ink"
            >
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
              {p.back}
            </Link>
          </article>
        </div>
      </main>
      <SiteFooter lang={lang} d={d.footer} wa={d.whatsapp} />
    </div>
  );
}
