"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { cn } from "@/lib/utils";
import { LangSwitch } from "./lang-switch";
import { Logo } from "./logo";
import { WhatsAppIcon, WhatsAppLink } from "./whatsapp-link";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The landing page's sections, linked from any page (`/en#how`). */
export const siteSections = (lang: Locale, nav: Dict["nav"]) =>
  [
    [`/${lang}#how`, nav.how],
    [`/${lang}#features`, nav.features],
    [`/${lang}#who`, nav.who],
    [`/${lang}#pilot`, nav.pilot],
    [`/${lang}#faq`, nav.faq],
  ] as const;

/**
 * The menu button and its sheet: home, the demo, every landing section, the request
 * form, WhatsApp, privacy and the language switch. On the site it shows below the
 * desktop breakpoint; in the demo (`always`) it shows at every size.
 */
export function SiteMenu({
  lang,
  nav,
  wa,
  langHref,
  always = false,
  className,
}: {
  lang: Locale;
  nav: Dict["nav"];
  wa: Dict["whatsapp"];
  /** Omit to leave the language switch out of the sheet (the demo has its own). */
  langHref?: string;
  always?: boolean;
  className?: string;
}) {
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

  // The sheet is rendered at the end of <body>: inside the frosted header (or the demo's
  // top bar) a fixed overlay would be clipped to that bar.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const close = () => setOpen(false);
  const row = "border-b border-line py-3 font-display text-[22px] font-bold";

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label={nav.menu}
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full border border-line bg-white/70 transition-colors hover:border-ink",
          !always && "lg:hidden",
          className,
        )}
      >
        <Menu className="size-4" aria-hidden />
      </button>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className={cn("fixed inset-0 z-[70] bg-[#0b1222]/40 backdrop-blur-[2px]", !always && "lg:hidden")}
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
                  className="mx-auto flex max-h-svh max-w-xl flex-col gap-5 overflow-y-auto rounded-b-3xl bg-bg px-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-5 shadow-2xl sm:px-6"
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
                    <Link href={`/${lang}`} onClick={close} className={row}>
                      {nav.home}
                    </Link>
                    <Link href={`/${lang}/demo`} onClick={close} className={cn(row, "text-green")}>
                      {nav.demo}
                    </Link>
                    {siteSections(lang, nav).map(([href, label]) => (
                      <a key={href} href={href} onClick={close} className={row}>
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
                    <div className="flex items-center justify-center gap-5 pt-1 text-[14px] font-semibold text-muted">
                      {langHref && <LangSwitch href={langHref} title={nav.switchLangLabel} label={nav.switchLang} className="px-2 py-2" />}
                      <Link href={`/${lang}/privacy`} onClick={close} className="px-2 py-2">
                        {nav.privacy}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
