import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { BRAND, CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/site";
import { Logo } from "./logo";
import { siteSolutions } from "./site-nav";
import { WhatsAppLink } from "./whatsapp-link";

const link = "text-ink underline-offset-4 hover:underline";

/** The footer, with a full site map: every page in this language, for people and crawlers. */
export function SiteFooter({ lang, d, nav, wa }: { lang: Locale; d: Dict["footer"]; nav: Dict["nav"]; wa: Dict["whatsapp"] }) {
  const year = new Date().getFullYear();
  const h = (p: string) => `/${lang}${p}`;
  const columns: { title: string; links: [string, string][] }[] = [
    {
      title: nav.product,
      links: [
        [h("/product"), nav.product],
        [h("/demo"), nav.demo],
        [h("/request"), nav.cta],
      ],
    },
    {
      title: nav.solutions,
      links: [...siteSolutions(lang, nav).map((s) => [s.href, s.label] as [string, string]), [h("/solutions"), nav.solutionsAll]],
    },
    {
      title: BRAND,
      links: [
        [h("/pilot"), nav.pilot],
        [h("/learn"), nav.learn],
        [h("/about"), nav.about],
        [h("/faq"), nav.faq],
        [h("/privacy"), d.privacy],
      ],
    },
  ];
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-[32ch] text-[14px] text-muted">{d.tagline}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted">
            <span>
              {d.contact}:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={link} dir="ltr">
                {CONTACT_EMAIL}
              </a>
            </span>
            <WhatsAppLink d={wa} place="footer" className={`${link} inline-flex items-center gap-1.5`}>
              {wa.short}
            </WhatsAppLink>
            <a href={LINKEDIN_URL} className={link} target="_blank" rel="noopener">
              LinkedIn
            </a>
          </p>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="flex flex-col gap-3">
            <p className="text-[13px] font-semibold tracking-wide text-muted uppercase rtl:tracking-normal">{c.title}</p>
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
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-5 text-[13px] text-muted sm:px-6">
        <span>
          © {year} {BRAND}. {d.rights}
        </span>
        <CookieSettingsButton label={d.cookies} className={`${link} cursor-pointer text-muted`} />
      </div>
    </footer>
  );
}
