import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { cn } from "@/lib/utils";
import { LangSwitch } from "./lang-switch";
import { Logo } from "./logo";

/** Top navigation used on the landing and request pages. */
export function SiteHeader({
  lang,
  nav,
  langHref,
  sections = true,
  className,
  menu,
}: {
  lang: Locale;
  nav: Dict["nav"];
  langHref: string;
  sections?: boolean;
  className?: string;
  /** Extra control at the end, e.g. the phone menu on the landing page. */
  menu?: ReactNode;
}) {
  const links = [
    ["#how", nav.how],
    ["#features", nav.features],
    ["#who", nav.who],
    ["#faq", nav.faq],
  ] as const;
  return (
    <header className={cn("mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4 sm:px-6", className)}>
      <Link href={`/${lang}`}>
        <Logo />
      </Link>
      {sections && (
        <nav className="ms-6 hidden items-center gap-6 text-[14px] text-muted md:flex">
          <Link href={`/${lang}/demo`} className="font-semibold text-ink transition-colors hover:text-green">
            {nav.demo}
          </Link>
          {links.map(([href, label]) => (
            <a key={href} href={href} className="transition-colors hover:text-ink">
              {label}
            </a>
          ))}
        </nav>
      )}
      <div className="ms-auto flex items-center gap-2">
        <LangSwitch
          href={langHref}
          title={nav.switchLangLabel}
          label={nav.switchLang}
          className="rounded-full border border-line bg-white/70 px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-ink"
        />
        {sections && (
          <Link
            href={`/${lang}/request`}
            className="hidden rounded-full bg-ink px-4 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#263049] sm:block"
          >
            {nav.cta}
          </Link>
        )}
        {menu}
      </div>
    </header>
  );
}
