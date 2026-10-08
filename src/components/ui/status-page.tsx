"use client";

import { ArrowLeft, RotateCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment } from "react";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import status from "@/i18n/status";
import { CONTACT_EMAIL } from "@/lib/site";
import { Logo } from "./logo";

/** An empty grow shelf under a flickering LED: the picture for the 404 and error pages. */
function EmptyShelf({ code }: { code: string }) {
  return (
    <div className="relative w-full max-w-[340px]" aria-hidden dir="ltr">
      <div className="rounded-[28px] bg-gradient-to-b from-[#1d2a4a] to-night p-6 shadow-[0_40px_80px_-30px_rgba(20,27,43,0.6)]">
        {[0, 1, 2].map((f) => (
          <div key={f} className="flex flex-col gap-2 py-2">
            <span
              className={f === 1 ? "status-flicker h-1.5 rounded-full bg-led" : "h-1.5 rounded-full bg-led/25"}
              style={f === 1 ? { boxShadow: "0 0 18px 4px rgba(255,79,216,0.5)" } : undefined}
            />
            <div className="flex h-10 items-end justify-between px-1">
              {f === 1 ? (
                <span className="w-full text-center font-mono text-[32px] leading-none font-medium text-white/85">{code}</span>
              ) : (
                Array.from({ length: 6 }, (_, i) => <span key={i} className="h-3 w-6 rounded-t-full bg-green/30" />)
              )}
            </div>
            <span className="h-1.5 rounded bg-[#2a3757]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusPage({ kind, onRetry }: { kind: "notFound" | "error"; onRetry?: () => void }) {
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang && hasLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const t = status[lang];
  const [before, after] = t.help.split("{email}");

  return (
    <div className="flex min-h-svh flex-col bg-bg">
      <header className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
        <Link href={`/${lang}`} aria-label={t.home}>
          <Logo />
        </Link>
      </header>
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="max-w-[34rem]">
          <h1 className="font-display text-[38px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[52px]">
            {kind === "notFound" ? t.notFoundTitle : t.errorTitle}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">{kind === "notFound" ? t.notFoundSub : t.errorSub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#263049]"
              >
                <RotateCw className="size-4" aria-hidden />
                {t.retry}
              </button>
            ) : (
              <Link
                href={`/${lang}/demo`}
                className="inline-flex items-center rounded-full bg-green px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-green-ink"
              >
                {t.demo}
              </Link>
            )}
            <Link
              href={`/${lang}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-[15px] font-semibold transition-colors hover:border-ink"
            >
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
              {t.home}
            </Link>
          </div>
          <p className="mt-8 text-[14px] text-muted">
            {[before, after].map((part, i) => (
              <Fragment key={i}>
                {part}
                {i === 0 && (
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-ink underline underline-offset-4" dir="ltr">
                    {CONTACT_EMAIL}
                  </a>
                )}
              </Fragment>
            ))}
          </p>
        </div>
        <EmptyShelf code={kind === "notFound" ? "404" : "500"} />
      </main>
    </div>
  );
}
