import { Mail, MapPin, MessageCircle, Sprout, Users, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cards, PageIntro, Section } from "@/components/page/blocks";
import { PageShell } from "@/components/page/page-shell";
import { WhatsAppIcon, WhatsAppLink } from "@/components/ui/whatsapp-link";
import { fmt, hasLocale } from "@/i18n/config";
import { getDictionary, getPages } from "@/i18n/dictionaries";
import { PAGE, href } from "@/lib/routes";
import { organization, webPage } from "@/lib/schema";
import { contentMeta } from "@/lib/seo";
import { brandName, CONTACT_EMAIL } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  return contentMeta(lang, PAGE.about, p.about.meta, d.meta.ogAlt);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [d, p] = await Promise.all([getDictionary(lang), getPages(lang)]);
  const x = p.about;
  const f = d.founder;
  const icon = "size-5";

  return (
    <PageShell
      lang={lang}
      d={d}
      p={p}
      path={PAGE.about}
      crumbs={[{ name: d.nav.about, path: href(lang, PAGE.about) }]}
      ld={[webPage(lang, PAGE.about, x.meta.title, x.meta.description, "AboutPage"), organization()]}
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6 sm:px-6 lg:pt-12">
        <PageIntro eyebrow={x.eyebrow} title={x.title} lead={x.lead} />
      </div>

      <Section id="name" title={x.nameTitle}>
        <p className="max-w-[65ch] text-[17px] leading-relaxed">{x.name}</p>
      </Section>

      <Section id="why" title={x.whyTitle} tone="white">
        <div className="grid max-w-[70ch] gap-4 text-[16.5px] leading-relaxed">
          {x.why.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </Section>

      <Section id="founder" title={f.title}>
        <div className="flex flex-col gap-6 rounded-3xl border border-line bg-white p-6 sm:flex-row sm:p-8">
          <span className="grid size-20 shrink-0 place-items-center rounded-full bg-green font-display text-[26px] font-bold text-white" aria-hidden>
            {f.initials}
          </span>
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-display text-[20px] font-bold">{f.name}</p>
              <p className="text-[14px] text-muted">{f.role}</p>
            </div>
            {f.note.map((t) => (
              <p key={t} className="max-w-[65ch] text-[16px] leading-relaxed">
                {fmt(t, { brand: brandName(lang) })}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section id="how" title={x.howTitle} tone="white">
        <Cards items={x.how} icons={[<MessageCircle key="a" className={icon} />, <Sprout key="b" className={icon} />, <ShieldCheck key="c" className={icon} />]} />
      </Section>

      <Section id="where" title={x.whereTitle}>
        <p className="flex max-w-[65ch] items-start gap-3 text-[17px] leading-relaxed">
          <MapPin className="mt-1 size-5 shrink-0 text-green" aria-hidden />
          {x.where}
        </p>
      </Section>

      <Section id="contact" title={x.contactTitle} tone="white">
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-green px-5 py-2.5 text-[15px] font-semibold text-green transition-colors hover:bg-green hover:text-white"
          >
            <Mail className="size-4" aria-hidden />
            <span dir="ltr">{CONTACT_EMAIL}</span>
          </a>
          <WhatsAppLink
            d={d.whatsapp}
            place="about"
            className="inline-flex items-center gap-2 rounded-xl bg-green px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-green-ink"
          >
            <WhatsAppIcon className="size-4" />
            {d.whatsapp.label}
          </WhatsAppLink>
          <Link href={href(lang, PAGE.faq)} className="inline-flex items-center gap-2 px-2 py-3 text-[15px] font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">
            <Users className="size-4" aria-hidden />
            {d.nav.faq}
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
