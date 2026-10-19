import { Mail } from "lucide-react";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics";
import { NameForm } from "@/components/landing/name-form";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { BRAND, CONTACT_EMAIL } from "@/lib/site";
import { Mark } from "./logo";
import { sitePages, siteSolutions } from "./site-nav";
import { WhatsAppIcon, WhatsAppLink } from "./whatsapp-link";

const link = "text-white/85 transition-colors hover:text-lime";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-[13.5px] font-semibold transition-colors hover:border-lime hover:text-lime";

/**
 * The footer on every page: the farm-name field (its "sign-up bar"), then a full site map
 * of this language for people and crawlers, and a large low-opacity wordmark at the bottom.
 */
export function SiteFooter({ lang, d }: { lang: Locale; d: Dict }) {
  const year = new Date().getFullYear();
  const h = (p: string) => `/${lang}${p}`;
  const columns: { title: string; links: [string, string][] }[] = [
    { title: d.footer.explore, links: sitePages(lang, d.nav).map((p) => [p.href, p.label]) },
    { title: d.nav.solutions, links: siteSolutions(lang, d.nav).map((s) => [s.href, s.label]) },
    {
      title: d.nav.product,
      links: [
        [h("/demo"), d.nav.demo],
        [h("/request"), d.nav.cta],
        [h("/privacy"), d.footer.privacy],
      ],
    },
  ];
  return (
    <footer className="relative overflow-hidden rounded-t-[40px] bg-forest text-white">
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-10 sm:px-6 lg:pt-20">
        <div className="grid gap-8 rounded-[32px] bg-emerald p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div className="flex flex-col gap-3">
            <h2 className="text-[30px] leading-[1.12] font-extrabold tracking-[-0.03em] sm:text-[38px]">{d.tryBand.title}</h2>
            <p className="max-w-[44ch] text-[15.5px] leading-relaxed text-white/65">{d.final.sub}</p>
          </div>
          <NameForm lang={lang} tone="forest" label={d.hero.inputLabel} placeholder={d.hero.placeholder} button={d.hero.open} error={d.hero.nameError} sample={d.hero.sample} />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-[19px] font-extrabold">
              <Mark />
              {BRAND}
            </span>
            <p className="max-w-[32ch] text-[14.5px] leading-relaxed text-white/60">{d.footer.tagline}</p>
            <p className="text-[13px] font-semibold text-white/50">{d.footer.contact}</p>
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${CONTACT_EMAIL}`} className={pill} dir="ltr">
                <Mail className="size-4" aria-hidden />
                {CONTACT_EMAIL}
              </a>
              <WhatsAppLink d={d.whatsapp} place="footer" className={pill}>
                <WhatsAppIcon className="size-4" />
                {d.whatsapp.short}
              </WhatsAppLink>
            </div>
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title} className="flex flex-col gap-3">
              <p className="text-[13px] font-semibold text-white/50">{c.title}</p>
              <ul className="flex flex-col gap-2 text-[14.5px] font-medium">
                {c.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className={link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-white/60">
          <span>
            © {year} {BRAND}. {d.footer.rights}
          </span>
          <CookieSettingsButton label={d.footer.cookies} className="cursor-pointer text-white/60 hover:text-white" />
        </div>
      </div>
      <span
        aria-hidden
        className="pointer-events-none -mt-4 -mb-[0.2em] block text-center text-[clamp(110px,25vw,340px)] leading-[0.9] font-extrabold tracking-[-0.06em] text-white/[0.05] select-none"
        dir="ltr"
      >
        {BRAND}
      </span>
    </footer>
  );
}
