import { ArrowRight, Check, ChevronDown, Mail, Moon, PackageCheck, Scissors, Sprout, Sun, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FeatureTour } from "@/components/landing/feature-tour";
import { Hero } from "@/components/landing/hero";
import { NameForm } from "@/components/landing/name-form";
import { Steps } from "@/components/landing/steps";
import { Cursor } from "@/components/motion/cursor";
import { MotionRoot } from "@/components/motion/motion-root";
import { Magnetic, Reveal, ScrollProgress, Spotlight, WordReveal } from "@/components/motion/kit";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { WhatsAppIcon, WhatsAppLink } from "@/components/ui/whatsapp-link";
import { fmt, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMeta } from "@/lib/seo";
import { BRAND, CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <Reveal y={10}>
      <p className={cn("font-mono text-[12px] tracking-[0.12em] uppercase", dark ? "text-[#7fe0a6]" : "text-green")}>{children}</p>
    </Reveal>
  );
}

const h2 = "max-w-[22ch] font-display text-[32px] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[42px]";

/* Small illustrations for the feature cards on phones, drawn from the product's own UI. */
function FeatureArt({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="flex flex-col gap-1.5" dir="ltr">
        {[["F4", "22%"], ["F3", "97%"], ["F2", "50%"]].map(([f, v], k) => (
          <div key={f} className={cn("flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold", k === 1 ? "border-ink bg-ink text-white" : "border-line bg-white")}>
            <span>{f}</span>
            <span className="h-1 flex-1 rounded-full bg-current opacity-15" />
            <span className="font-mono">{v}</span>
          </div>
        ))}
      </div>
    );
  if (i === 1)
    return (
      <div className="grid grid-cols-3 gap-1.5" dir="ltr">
        {["#ff4fd8", "#fff1d6", "#5b8cff"].map((c, k) => (
          <div key={c} className={cn("flex flex-col gap-1.5 rounded-xl border bg-white p-2", k === 0 ? "border-ink" : "border-line")}>
            <span className="h-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 10px ${c}` }} />
            <span className="h-1.5 w-2/3 rounded-full bg-[#e9edf4]" />
            <span className="font-mono text-[10px] text-muted">{[100, 86, 76][k]}%</span>
          </div>
        ))}
      </div>
    );
  if (i === 2)
    return (
      <div className="flex items-center justify-between">
        {[Sprout, Sun, Scissors, PackageCheck, Truck].map((Icon, k) => (
          <span key={k} className={cn("grid size-8 place-items-center rounded-full", k === 2 ? "bg-green text-white shadow-[0_0_0_5px_rgba(46,158,91,0.18)]" : "bg-[#eef1f6] text-muted")}>
            <Icon className="size-4" aria-hidden />
          </span>
        ))}
      </div>
    );
  return (
    <div className="relative h-[54px] overflow-hidden rounded-xl" dir="ltr" style={{ background: "linear-gradient(90deg,#0b1222 0%,#1d2a4a 22%,#e8eef4 40%,#e8eef4 62%,#1d2a4a 80%,#0b1222 100%)" }}>
      <Sun className="absolute top-3 left-1/2 size-5 -translate-x-1/2 text-[#f5a524]" aria-hidden />
      <Moon className="absolute top-3 left-3 size-4 text-[#9fb2ff]" aria-hidden />
    </div>
  );
}

function PrimaryCta({ href, children, label }: { href: string; children: ReactNode; label: string }) {
  return (
    <Magnetic>
      <Link
        href={href}
        data-cursor="cta"
        data-cursor-label={label}
        className="flex w-fit items-center gap-2 rounded-xl bg-green px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-green-ink"
      >
        {children}
        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
      </Link>
    </Magnetic>
  );
}

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return pageMeta({ lang, path: "", title: d.meta.title, description: d.meta.description, imageAlt: d.meta.ogAlt });
}

export default async function Landing({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  const other = lang === "en" ? "ar" : "en";
  const marquee = [...d.built.items, ...d.built.items];

  return (
    <MotionRoot>
    <div className="bg-bg">
      <ScrollProgress />
      <Cursor />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_70%_40%,#f7f9fb_0%,#e3e9f0_70%)]">
        <SiteHeader lang={lang} nav={d.nav} langHref={`/${other}`} className="relative z-20" />
        <Hero lang={lang} d={d.hero} cursor={d.cursor} />
      </section>

      {/* Built for: slow marquee */}
      <section className="overflow-hidden border-y border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-8 px-4 py-5 sm:px-6">
          <span className="shrink-0 font-mono text-[12px] tracking-[0.1em] text-muted uppercase">{d.built.title}</span>
          <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <div className="flex w-max animate-[marquee_28s_linear_infinite] rtl:animate-[marquee-rtl_28s_linear_infinite] motion-reduce:animate-none!">
              {marquee.map((t, i) => (
                <span key={i} className="flex items-center gap-10 pe-10 text-[15px] font-semibold whitespace-nowrap" aria-hidden={i >= d.built.items.length}>
                  {t}
                  <span className="size-1.5 rounded-full bg-leaf" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-20 sm:px-6 lg:py-28">
        <div className="flex flex-col gap-4">
          <Eyebrow>{d.how.eyebrow}</Eyebrow>
          <WordReveal text={d.how.title} className={h2} />
        </div>
        <Steps steps={d.how.steps} />
      </section>

      {/* Features: pinned 3D tour on desktop, cards on phones */}
      <FeatureTour
        d={d.features}
        fallback={
          <section id="features" className="scroll-mt-6 bg-white">
            <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
              <div className="flex flex-col gap-4">
                <Eyebrow>{d.features.eyebrow}</Eyebrow>
                <WordReveal text={d.features.title} className={h2} />
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {d.features.items.map((f, i) => (
                  <Reveal key={i} delay={(i % 2) * 0.1}>
                    <article className="flex h-full flex-col gap-5 rounded-3xl border border-line bg-bg p-6">
                      <div className="rounded-2xl border border-line bg-[#f7f9fb] p-4">
                        <FeatureArt i={i} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-display text-[21px] font-bold">{f.t}</h3>
                        <p className="text-[15px] leading-relaxed text-muted">{f.d}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        }
      />

      {/* Try with your name */}
      <section className="relative overflow-hidden bg-night text-white">
        <div aria-hidden className="pointer-events-none absolute -top-40 end-[-10%] size-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,79,216,0.22),transparent_65%)]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-48 start-[-10%] size-[520px] rounded-full bg-[radial-gradient(circle,rgba(46,158,91,0.25),transparent_65%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col gap-3">
            <WordReveal text={d.tryBand.title} className={cn(h2, "text-white")} />
            <Reveal delay={0.2}>
              <p className="max-w-[46ch] text-[16px] leading-relaxed text-white/65">{d.tryBand.sub}</p>
            </Reveal>
          </div>
          <Reveal delay={0.25}>
            <NameForm lang={lang} tone="dark" label={d.hero.inputLabel} placeholder={d.hero.placeholder} button={d.hero.open} error={d.hero.nameError} />
          </Reveal>
        </div>
      </section>

      {/* Who */}
      <section id="who" className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-20 sm:px-6 lg:py-28">
        <div className="flex flex-col gap-4">
          <Eyebrow>{d.who.eyebrow}</Eyebrow>
          <WordReveal text={d.who.title} className={h2} />
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {d.who.items.map((w, i) => (
            <Reveal key={w.t} delay={i * 0.12} className="h-full">
              <Spotlight className="h-full rounded-3xl border border-line bg-white p-6">
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[12px] text-green">0{i + 1}</span>
                  <h3 className="font-display text-[20px] font-bold">{w.t}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{w.d}</p>
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pilot */}
      <section id="pilot" className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 pb-20 sm:px-6 lg:pb-28">
        <Reveal>
          <div className="grid gap-8 rounded-[32px] border border-line bg-white p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col gap-4">
              <Eyebrow>{d.pilot.eyebrow}</Eyebrow>
              <WordReveal text={d.pilot.title} className={h2} />
              <p className="max-w-[44ch] text-[16px] leading-relaxed text-muted">{d.pilot.sub}</p>
              <div className="mt-2">
                <PrimaryCta href={`/${lang}/request`} label={d.cursor.go}>
                  {d.pilot.cta}
                </PrimaryCta>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Spotlight className="rounded-2xl bg-[#eef6f1] p-5" glow="rgba(46,158,91,0.18)">
                <h3 className="mb-3 font-semibold">{d.pilot.freeTitle}</h3>
                <ul className="flex flex-col gap-2.5">
                  {d.pilot.free.map((t, i) => (
                    <Reveal key={t} as="li" delay={0.1 + i * 0.07} y={10} className="flex gap-2 text-[14.5px]">
                      <Check className="mt-0.5 size-4 shrink-0 text-green" aria-hidden />
                      {t}
                    </Reveal>
                  ))}
                </ul>
              </Spotlight>
              <div className="rounded-2xl bg-bg p-5">
                <h3 className="mb-3 font-semibold text-muted">{d.pilot.laterTitle}</h3>
                <ul className="flex flex-col gap-2.5">
                  {d.pilot.later.map((t, i) => (
                    <Reveal key={t} as="li" delay={0.2 + i * 0.07} y={10} className="flex gap-2 text-[14.5px] text-muted">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#9aa6ba]" aria-hidden />
                      {t}
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Founder */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <div className="flex flex-col gap-4">
            <Eyebrow>{d.founder.eyebrow}</Eyebrow>
            <WordReveal text={d.founder.title} className={h2} />
          </div>
          <Reveal>
            <figure className="relative rounded-[32px] border border-line bg-white p-6 sm:p-10">
              <div className="flex flex-col gap-4 text-[17px] leading-relaxed">
                {d.founder.note.map((p) => (
                  <p key={p}>{fmt(p, { brand: BRAND })}</p>
                ))}
              </div>
              <figcaption className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
                <span
                  aria-hidden
                  className="grid size-14 shrink-0 place-items-center rounded-full bg-green font-display text-[18px] font-bold text-white shadow-[0_0_0_6px_rgba(46,158,91,0.14)]"
                  dir="ltr"
                >
                  {d.founder.initials}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-display text-[18px] font-bold">{d.founder.name}</span>
                  <span className="text-[14px] text-muted">{d.founder.role}</span>
                </span>
                <span className="flex flex-wrap gap-2 sm:ms-auto">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[14px] font-semibold transition-colors hover:border-ink"
                  >
                    <Mail className="size-4" aria-hidden />
                    {d.founder.email}
                  </a>
                  <WhatsAppLink
                    d={d.whatsapp}
                    place="founder"
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[14px] font-semibold transition-colors hover:border-ink"
                  >
                    <WhatsAppIcon className="size-4 text-[#25d366]" />
                    {d.whatsapp.short}
                  </WhatsAppLink>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-6 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:py-28">
          <div className="flex flex-col gap-4">
            <Eyebrow>{d.faq.eyebrow}</Eyebrow>
            <WordReveal text={d.faq.title} className={h2} />
          </div>
          <div className="flex flex-col">
            {d.faq.items.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.06} y={14}>
                <details className="group border-b border-line py-5">
                  <summary className="flex list-none items-center justify-between gap-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line transition-all duration-300 group-open:rotate-180 group-open:border-ink group-open:bg-ink group-open:text-white">
                      <ChevronDown className="size-4" aria-hidden />
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[60ch] animate-[faq-in_0.4s_ease] text-[15.5px] leading-relaxed text-muted">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <div className="relative flex flex-col items-start gap-6 overflow-hidden rounded-[32px] bg-ink p-8 text-white sm:p-12">
            <div aria-hidden className="pointer-events-none absolute -end-24 -top-24 size-[380px] rounded-full bg-[radial-gradient(circle,rgba(46,158,91,0.35),transparent_65%)]" />
            <WordReveal text={d.final.title} className={cn(h2, "relative text-white")} />
            <p className="relative max-w-[46ch] text-[16px] text-white/65">{d.final.sub}</p>
            <div className="relative flex flex-wrap items-center gap-3">
              <PrimaryCta href={`/${lang}/request`} label={d.cursor.go}>
                {d.final.cta}
              </PrimaryCta>
              <Magnetic>
                <Link
                  href={`/${lang}/demo`}
                  data-cursor="cta"
                  data-cursor-label={d.cursor.open}
                  className="block rounded-xl border border-white/20 px-5 py-3 text-[15px] font-semibold transition-colors hover:border-white/60"
                >
                  {d.final.demo}
                </Link>
              </Magnetic>
              <WhatsAppLink
                d={d.whatsapp}
                place="landing"
                className="flex items-center gap-2 rounded-xl px-3 py-3 text-[15px] font-semibold text-[#7fe0a6] transition-colors hover:text-white"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter lang={lang} d={d.footer} wa={d.whatsapp} />
    </div>
    </MotionRoot>
  );
}
