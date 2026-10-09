"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { cn } from "@/lib/utils";
import { LangSwitch } from "./lang-switch";
import { Logo } from "./logo";
import { SiteMenu, siteSections } from "./site-menu";

/** Height the header takes at the top of the page; content starts below it. */
export const HEADER_H = 68;

/**
 * The site's top navigation, on every page. It's fixed and always visible: at the top
 * of the page it sits clear on the hero, and once the page scrolls it turns into a
 * compact frosted bar. `variant="request"` is calmer: no section links and no
 * "Request a pilot" button (you're already there), with the menu at every size.
 */
export function SiteHeader({
  lang,
  nav,
  wa,
  langHref,
  variant = "site",
}: {
  lang: Locale;
  nav: Dict["nav"];
  wa: Dict["whatsapp"];
  langHref: string;
  variant?: "site" | "request";
}) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const site = variant === "site";

  return (
    <>
      {/* Keeps the page's content clear of the fixed bar. */}
      <div aria-hidden style={{ height: HEADER_H }} />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,box-shadow] duration-300",
          compact
            ? "border-line bg-bg/85 shadow-[0_8px_24px_-20px_rgba(20,27,43,0.5)] backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-6xl items-center gap-3 px-4 transition-[padding] duration-300 sm:gap-4 sm:px-6 motion-reduce:transition-none",
            compact ? "py-2.5" : "py-4",
          )}
        >
          <Link
            href={`/${lang}`}
            className="shrink-0"
            onClick={() => window.location.pathname === `/${lang}` && window.scrollTo({ top: 0 })}
          >
            <Logo />
          </Link>
          {site && (
            <nav className="ms-4 hidden items-center gap-6 text-[14px] text-muted lg:flex">
              <Link href={`/${lang}/demo`} className="font-semibold text-ink transition-colors hover:text-green">
                {nav.demo}
              </Link>
              {siteSections(lang, nav).map(([href, label]) => (
                <a key={href} href={href} className="transition-colors hover:text-ink">
                  {label}
                </a>
              ))}
            </nav>
          )}
          {!site && (
            <Link href={`/${lang}`} className="hidden items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink sm:flex">
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
              {nav.backToSite}
            </Link>
          )}
          <div className="ms-auto flex items-center gap-2">
            <LangSwitch
              href={langHref}
              title={nav.switchLangLabel}
              label={nav.switchLang}
              className="rounded-full border border-line bg-white/70 px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-ink"
            />
            {site && (
              <Link
                href={`/${lang}/request`}
                className="rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#263049] sm:px-4 sm:py-2 sm:text-[13.5px]"
              >
                <span className="sm:hidden">{nav.ctaShort}</span>
                <span className="hidden sm:inline">{nav.cta}</span>
              </Link>
            )}
            <SiteMenu lang={lang} nav={nav} wa={wa} langHref={langHref} always={!site} />
          </div>
        </div>
      </header>
    </>
  );
}
