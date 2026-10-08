"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { cn } from "@/lib/utils";
import { LangSwitch } from "@/components/ui/lang-switch";
import { Logo } from "@/components/ui/logo";
import { WhatsAppIcon, WhatsAppLink } from "@/components/ui/whatsapp-link";

type NavProps = { lang: Locale; nav: Dict["nav"]; wa: Dict["whatsapp"]; langHref: string };

const EASE = [0.22, 1, 0.36, 1] as const;

const sections = (nav: Dict["nav"]) =>
  [
    ["#how", nav.how],
    ["#features", nav.features],
    ["#who", nav.who],
    ["#pilot", nav.pilot],
    ["#faq", nav.faq],
  ] as const;

/** Phone menu: a button that opens a sheet with every section, the demo, the request form and WhatsApp. */
export function MobileMenu({ lang, nav, wa, langHref, className }: NavProps & { className?: string }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    sheet.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !sheet.current) return;
      // Keep keyboard focus inside the sheet while it's open.
      const items = sheet.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const btn = button.current;
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label={nav.menu}
        className={cn("grid size-9 place-items-center rounded-full border border-line bg-white/70 md:hidden", className)}
      >
        <Menu className="size-4" aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-[#0b1222]/40 backdrop-blur-[2px] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              ref={sheet}
              role="dialog"
              aria-modal="true"
              aria-label={nav.menu}
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col gap-5 rounded-b-3xl bg-bg px-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <Link href={`/${lang}`} onClick={close}>
                  <Logo />
                </Link>
                <button
                  type="button"
                  data-autofocus
                  onClick={close}
                  aria-label={nav.close}
                  className="grid size-9 place-items-center rounded-full border border-line bg-white"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <nav className="flex flex-col">
                <Link
                  href={`/${lang}/demo`}
                  onClick={close}
                  className="border-b border-line py-3 font-display text-[22px] font-bold text-green"
                >
                  {nav.demo}
                </Link>
                {sections(nav).map(([href, label]) => (
                  <a key={href} href={href} onClick={close} className="border-b border-line py-3 font-display text-[22px] font-bold">
                    {label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/${lang}/request`}
                  onClick={close}
                  className="rounded-xl bg-green px-4 py-3 text-center text-[15px] font-semibold text-white"
                >
                  {nav.cta}
                </Link>
                <WhatsAppLink
                  d={wa}
                  place="menu"
                  className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[15px] font-semibold"
                >
                  <WhatsAppIcon className="size-4 text-[#25d366]" />
                  {wa.label}
                </WhatsAppLink>
                <LangSwitch
                  href={langHref}
                  title={nav.switchLangLabel}
                  label={nav.switchLang}
                  className="self-center px-3 py-2 text-[14px] font-semibold text-muted"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * A slim bar that slides in when the visitor scrolls back up past the hero,
 * so the demo and the request form are always one tap away.
 */
export function StickyBar(props: NavProps) {
  const { lang, nav } = props;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const pastHero = y > window.innerHeight * 0.9;
        if (!pastHero) setShown(false);
        else if (y < last - 4) setShown(true);
        else if (y > last + 4) setShown(false);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      inert={!shown}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur transition-transform duration-300 motion-reduce:transition-none",
        shown ? "translate-y-0" : "-translate-y-[110%]",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <Link href={`/${lang}`} onClick={() => window.scrollTo({ top: 0 })}>
          <Logo />
        </Link>
        <nav className="ms-4 hidden items-center gap-5 text-[13.5px] text-muted lg:flex">
          {sections(nav).map(([href, label]) => (
            <a key={href} href={href} className="transition-colors hover:text-ink">
              {label}
            </a>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <LangSwitch
            href={props.langHref}
            title={nav.switchLangLabel}
            label={nav.switchLang}
            className="hidden rounded-full border border-line px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-ink sm:block"
          />
          <Link
            href={`/${lang}/demo`}
            className="rounded-full bg-green px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-green-ink"
          >
            {nav.demo}
          </Link>
          <Link
            href={`/${lang}/request`}
            className="hidden rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#263049] sm:block"
          >
            {nav.cta}
          </Link>
          <MobileMenu {...props} />
        </div>
      </div>
    </div>
  );
}
