import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { BRAND, CONTACT_EMAIL } from "@/lib/site";
import { Logo } from "./logo";
import { WhatsAppLink } from "./whatsapp-link";

const link = "text-ink underline-offset-4 hover:underline";

export function SiteFooter({ lang, d, wa }: { lang: Locale; d: Dict["footer"]; wa: Dict["whatsapp"] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-[14px] text-muted">{d.tagline}</p>
        </div>
        <div className="flex flex-col gap-1 text-[14px] text-muted sm:items-end">
          <span>
            {d.contact}:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className={link} dir="ltr">
              {CONTACT_EMAIL}
            </a>
            <WhatsAppLink d={wa} place="footer" className={`${link} ms-3 inline-flex items-center gap-1.5`}>
              {wa.short}
            </WhatsAppLink>
          </span>
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href={`/${lang}/privacy`} className={link}>
              {d.privacy}
            </Link>
            <CookieSettingsButton label={d.cookies} className={`${link} cursor-pointer`} />
          </span>
          <span>
            © {year} {BRAND}. {d.rights}
          </span>
        </div>
      </div>
    </footer>
  );
}
