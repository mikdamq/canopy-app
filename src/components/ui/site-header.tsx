"use client";

import { ArrowLeft, Building2, ChevronDown, Container, FlaskConical, Play, Sprout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import type { SolutionType } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { LangSwitch } from "./lang-switch";
import { Logo } from "./logo";
import { SiteMenu } from "./site-menu";
import { sitePages, siteSolutions } from "./site-nav";

/** Height the header takes at the top of the page; content starts below it. */
export const HEADER_H = 68;

export const SOLUTION_ICON: Record<SolutionType, typeof Building2> = {
  tower: Building2,
  container: Container,
  greenhouse: Sprout,
  lab: FlaskConical,
};

/** "Solutions ▾": a disclosure listing the four farm types. Opens on click or hover; Escape closes it. */
function SolutionsMenu({ lang, nav, active }: { lang: Locale; nav: Dict["nav"]; active: boolean }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const hover = (v: boolean) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(v), v ? 60 : 160);
  };
  return (
    <div ref={wrap} className="relative" onPointerEnter={(e) => e.pointerType === "mouse" && hover(true)} onPointerLeave={(e) => e.pointerType === "mouse" && hover(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="solutions-menu"
        onClick={() => setOpen((v) => !v)}
        className={cn("flex items-center gap-1 transition-colors hover:text-ink", (active || open) && "text-ink")}
      >
        {nav.solutions}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <div
        id="solutions-menu"
        hidden={!open}
        className="absolute start-1/2 top-full z-10 w-[420px] -translate-x-1/2 pt-3 rtl:translate-x-1/2"
      >
        <div className="rounded-2xl border border-line bg-white p-2 shadow-[0_24px_60px_-30px_rgba(20,27,43,0.45)]">
          <ul className="grid gap-1">
            {siteSolutions(lang, nav).map((s) => {
              const Icon = SOLUTION_ICON[s.type];
              return (
                <li key={s.type}>
                  <Link href={s.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#eaf5ee]">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eaf5ee] text-green">
                      <Icon className="size-4.5" aria-hidden />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[14.5px] font-semibold text-ink">{s.label}</span>
                      <span className="text-[13px] text-muted">{s.hint}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={`/${lang}/solutions`}
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-xl px-3 py-2.5 text-[14px] font-semibold text-green transition-colors hover:bg-[#eaf5ee]"
          >
            {nav.solutionsAll}
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * The site's top navigation, on every page. It's fixed and always visible: at the top
 * of the page it sits clear on the hero, and once the page scrolls it turns into a
 * compact frosted bar. Pages sit in the middle; the two actions (the live demo and the
 * pilot request) sit on the right, apart from them. `variant="request"` is calmer: no
 * page links or actions (you're already in the form), with the menu at every size.
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
  const pathname = usePathname();
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const site = variant === "site";
  const isActive = (h: string) => pathname === h || pathname.startsWith(`${h}/`);

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
            <nav aria-label={nav.pages} className="ms-6 hidden items-center gap-6 text-[14.5px] font-medium text-muted lg:flex">
              {sitePages(lang, nav).map((pg) =>
                pg.key === "solutions" ? (
                  <SolutionsMenu key={pg.key} lang={lang} nav={nav} active={isActive(pg.href)} />
                ) : (
                  <Link
                    key={pg.key}
                    href={pg.href}
                    aria-current={isActive(pg.href) ? "page" : undefined}
                    className={cn("transition-colors hover:text-ink", isActive(pg.href) && "text-ink")}
                  >
                    {pg.label}
                  </Link>
                ),
              )}
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
              className="rounded-full px-2.5 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
            />
            {site && (
              <>
                <Link
                  href={`/${lang}/demo`}
                  className="hidden items-center gap-1.5 rounded-full border-[1.5px] border-green px-3.5 py-[7px] text-[13.5px] font-semibold whitespace-nowrap text-green transition-colors hover:bg-green hover:text-white sm:flex"
                >
                  <Play className="size-3.5 fill-current" aria-hidden />
                  {nav.demo}
                </Link>
                <Link
                  href={`/${lang}/request`}
                  className="rounded-full bg-green px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-green-ink sm:px-4 sm:py-2 sm:text-[13.5px]"
                >
                  <span className="sm:hidden">{nav.ctaShort}</span>
                  <span className="hidden sm:inline">{nav.cta}</span>
                </Link>
              </>
            )}
            <SiteMenu lang={lang} nav={nav} wa={wa} langHref={langHref} always={!site} />
          </div>
        </div>
      </header>
    </>
  );
}
