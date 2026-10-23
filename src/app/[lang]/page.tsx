import { ArrowRight, ArrowUpRight, Building2, Check, ChevronDown, Container, FlaskConical, Sprout } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { HomeHero } from "@/components/landing/home-hero";
import { MotionRoot } from "@/components/motion/motion-root";
import { Reveal, ScrollProgress } from "@/components/motion/kit";
import { JsonLd } from "@/components/page/json-ld";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { siteSolutions } from "@/components/ui/site-nav";
import { fmt, hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { homeCopy } from "@/i18n/home";
import { organization, software, website, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { brandName } from "@/lib/site";
import { cn } from "@/lib/utils";

const FEATURE_IMG = ["tower-zoom", "lab-zoom", "container-zoom", "tower-night"];
const TYPE_ICON = [Building2, Container, Sprout, FlaskConical];
const TYPE_IMG = ["tower", "container", "greenhouse", "lab"];

/**
 * Key words in a heading, in a lime badge. It's an inline block, so the line box grows
 * around it instead of the badge painting over the line above (Arabic letters reach far
 * above and below the line).
 */
function Hl({ children }: { children: ReactNode }) {
  return <span className="my-[0.08em] inline-block rounded-[0.38em] bg-lime px-[0.22em] py-[0.02em] leading-[1.2] text-forest rtl:leading-[1.45]">{children}</span>;
}

/** A heading split into a / hl / b, the middle part in a lime badge. */
function Title({ t, className, as: Tag = "h2" }: { t: { a: string; hl: string; b: string }; className?: string; as?: "h2" | "h3" }) {
  return (
    <Tag className={cn("max-w-[20ch] text-[34px] leading-[1.15] font-extrabold tracking-[-0.03em] text-balance rtl:leading-[1.4] sm:text-[46px]", className)}>
      {t.a} <Hl>{t.hl}</Hl>
      {t.b && ` ${t.b}`}
    </Tag>
  );
}

function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={cn(
        "flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[12.5px] font-semibold",
        dark ? "bg-white/10 text-lime" : "bg-forest/[0.07] text-forest",
      )}
    >
      <span className={cn("size-1.5 rounded-full", dark ? "bg-lime" : "bg-forest")} aria-hidden />
      {children}
    </p>
  );
}

function Img({ name, alt, className, sizes }: { name: string; alt: string; className?: string; sizes: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static WebP stills in two sizes; no image optimiser on the cPanel host
    <img
      src={`/farms/${name}.webp`}
      srcSet={`/farms/${name}-sm.webp 800w, /farms/${name}.webp 1600w`}
      sizes={sizes}
      width={1600}
      height={1000}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("bg-[#e6ebee] object-cover", className)}
    />
  );
}

/** Round arrow button, the reference's "circular arrow" micro-UI. */
function RoundArrow({ dark }: { dark?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:-rotate-45 rtl:group-hover:rotate-45",
        dark ? "bg-lime text-forest" : "bg-forest text-lime",
      )}
    >
      <ArrowRight className="size-4 rtl:rotate-180" />
    </span>
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
  const x = homeCopy(lang);
  const other: Locale = lang === "en" ? "ar" : "en";
  const solutions = siteSolutions(lang, d.nav);

  return (
    <MotionRoot>
      <div className="bg-cream text-forest">
        <ScrollProgress />
        {/* Hero: forest band */}
        <section className="relative overflow-hidden bg-forest text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_85%_10%,rgba(198,240,77,0.14),transparent_60%),radial-gradient(60%_60%_at_0%_100%,rgba(8,41,28,0.9),transparent_70%)]" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
          />
          <div className="relative">
            <SiteHeader lang={lang} nav={d.nav} wa={d.whatsapp} langHref={`/${other}`} />
            <span id="main" tabIndex={-1} />
            <HomeHero lang={lang} d={d} x={x} />
          </div>
          {/* Built for: pill row */}
          <div className="relative border-t border-white/10">
            <ul className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2.5 px-4 py-6 sm:px-6">
              <li className="me-2 text-[13px] font-medium text-white/55">{d.built.title}</li>
              {solutions.map((s, i) => {
                const Icon = TYPE_ICON[i];
                return (
                  <li key={s.type}>
                    <Link
                      href={s.href}
                      className="flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-[13.5px] font-semibold text-white/90 transition-colors hover:border-lime hover:text-lime"
                    >
                      <Icon className="size-4" aria-hidden />
                      {s.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Numbers: cream */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
            <Reveal className="flex flex-col gap-5">
              <Eyebrow>{x.metrics.eyebrow}</Eyebrow>
              <Title t={x.metrics} />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-[#4a5a50]">{d.pilot.sub}</p>
            </Reveal>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {x.metrics.items.map((m, i) => (
              <Reveal key={m.l} as="li" delay={i * 0.08}>
                <div className={cn("flex h-full flex-col gap-3 rounded-[24px] p-4 sm:gap-4 sm:rounded-[28px] sm:p-6", i === 0 ? "bg-forest text-white" : "bg-white")}>
                  <p className="flex items-baseline gap-1" dir="ltr">
                    <span className="text-[44px] leading-none font-extrabold tracking-[-0.05em] sm:text-[64px]">{m.v}</span>
                    {m.u && <span className={cn("text-[17px] font-bold sm:text-[22px]", i === 0 ? "text-lime" : "text-green")}>{m.u}</span>}                  </p>
                  <p className="text-[15px] font-bold sm:text-[17px]">{m.l}</p>
                  <p className={cn("text-[13px] leading-relaxed sm:text-[14.5px]", i === 0 ? "text-white/70" : "text-[#55635a]")}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* How it works: sage */}
        <section id="how" className="bg-sage">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="flex flex-col items-start gap-5">
              <Eyebrow>{d.how.eyebrow}</Eyebrow>
              <Title t={x.how} className="max-w-[24ch]" />
            </div>
            <ol className="mt-12 grid gap-4 md:grid-cols-3">
              {d.how.steps.map((s, i) => (
                <Reveal key={s.t} as="li" delay={i * 0.1}>
                  <div className="flex h-full flex-col gap-4 rounded-[28px] bg-cream p-6 sm:p-7">
                    <span className="grid size-11 place-items-center rounded-full bg-forest text-[15px] font-bold text-lime" dir="ltr">
                      0{i + 1}
                    </span>
                    <h3 className="text-[21px] leading-snug font-bold">{s.t}</h3>
                    <p className="text-[15px] leading-relaxed text-[#4a5a50]">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <Link href={`/${lang}/product`} className="group mt-10 inline-flex items-center gap-3 text-[15.5px] font-bold">
              <RoundArrow />
              {d.how.more}
            </Link>
          </div>
        </section>

        {/* What you see: 2 × 2 matrix, cream */}
        <section id="features" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="flex flex-col items-start gap-5">
            <Eyebrow>{x.benefits.eyebrow}</Eyebrow>
            <Title t={x.benefits} />
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {d.features.items.map((f, i) => (
              <Reveal key={f.t} delay={(i % 2) * 0.1}>
                <article className={cn("group flex h-full flex-col overflow-hidden rounded-[32px]", i === 3 ? "bg-emerald text-white" : "bg-white")}>
                  <div className="p-3 pb-0">
                    <div className="overflow-hidden rounded-[24px]">
                      <Img
                        name={FEATURE_IMG[i]}
                        alt={x.benefits.alts[i]}
                        sizes="(min-width: 768px) 560px, 100vw"
                        className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6 sm:p-7">
                    <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-[12px] font-bold", i === 3 ? "bg-lime text-forest" : "bg-sage text-forest")} dir="ltr">
                      0{i + 1}
                    </span>
                    <h3 className="text-[22px] font-bold">{f.t}</h3>
                    <p className={cn("text-[15px] leading-relaxed", i === 3 ? "text-white/70" : "text-[#4a5a50]")}>{f.d}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Farm types: card grid, sage */}
        <section id="who" className="bg-sage">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-col items-start gap-5">
                <Eyebrow>{x.types.eyebrow}</Eyebrow>
                <Title t={x.types} />
              </div>
              <Link href={`/${lang}/solutions`} className="group inline-flex items-center gap-3 text-[15.5px] font-bold">
                {d.nav.solutionsAll}
                <RoundArrow />
              </Link>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {solutions.map((s, i) => {
                const Icon = TYPE_ICON[i];
                return (
                  <Reveal key={s.type} as="li" delay={i * 0.08}>
                    <Link href={s.href} className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-cream transition-shadow hover:shadow-[0_30px_60px_-35px_rgba(14,59,41,0.55)]">
                      <div className="relative p-2.5 pb-0">
                        <div className="overflow-hidden rounded-[22px]">
                          <Img name={`${TYPE_IMG[i]}`} alt="" sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-[1.05] motion-reduce:transition-none" />
                        </div>
                        <span className="absolute start-5 top-5 grid size-9 place-items-center rounded-full bg-cream text-forest">
                          <Icon className="size-4" aria-hidden />
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-1.5 p-5">
                        <h3 className="text-[18px] font-bold">{s.label}</h3>
                        <p className="text-[14px] leading-relaxed text-[#4a5a50]">{s.hint}</p>
                        <span className="mt-auto flex items-center gap-1.5 pt-3 text-[14px] font-bold text-green">
                          {x.types.open}
                          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Pilot: emerald band, three cards (in place of testimonials) */}
        <section id="pilot" className="relative overflow-hidden bg-emerald text-white">
          <div aria-hidden className="pointer-events-none absolute -top-40 end-[-10%] size-[560px] rounded-full bg-[radial-gradient(circle,rgba(198,240,77,0.16),transparent_65%)]" />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-col items-start gap-5">
                <Eyebrow dark>{d.pilot.eyebrow}</Eyebrow>
                <Title t={x.pilot} className="text-white" />
              </div>
              <Link href={`/${lang}/pilot`} className="group inline-flex items-center gap-3 text-[15.5px] font-bold">
                {d.pilot.more}
                <RoundArrow dark />
              </Link>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              <Reveal>
                <div className="flex h-full flex-col gap-5 rounded-[28px] bg-lime p-7 text-forest">
                  <span className="flex w-fit items-center gap-2 rounded-full bg-forest px-3 py-1 text-[12.5px] font-bold text-lime">
                    <span className="relative flex size-2">
                      <span className="absolute inset-0 animate-ping rounded-full bg-lime opacity-70 motion-reduce:animate-none" />
                      <span className="relative size-2 rounded-full bg-lime" />
                    </span>
                    {x.pilot.spots}
                  </span>
                  <p className="text-[40px] leading-none font-extrabold tracking-[-0.04em]">{x.pilot.free}</p>
                  <ul className="flex flex-col gap-2.5">
                    {d.pilot.free.map((t) => (
                      <li key={t} className="flex gap-2.5 text-[15px] font-medium">
                        <Check className="mt-0.5 size-4 shrink-0" strokeWidth={3} aria-hidden />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${lang}/request`} className="mt-auto flex w-fit items-center gap-2 rounded-full bg-forest px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-emerald">
                    {d.pilot.cta}
                    <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="flex h-full flex-col gap-5 rounded-[28px] border border-white/10 bg-white/[0.05] p-7">
                  <h3 className="text-[22px] font-bold">{x.pilot.askTitle}</h3>
                  <ol className="flex flex-col gap-4">
                    {x.pilot.ask.map((t, i) => (
                      <li key={t} className="flex gap-3 text-[15.5px] leading-relaxed text-white/80">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-[12.5px] font-bold text-lime" dir="ltr">
                          {i + 1}
                        </span>
                        {t}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-auto border-t border-white/10 pt-5">
                    <p className="mb-3 text-[13.5px] font-semibold text-white/55">{d.pilot.laterTitle}</p>
                    <ul className="flex flex-wrap gap-2">
                      {d.pilot.later.map((t) => (
                        <li key={t} className="rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/75">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <figure className="flex h-full flex-col gap-5 rounded-[28px] bg-cream p-7 text-forest">
                  <span className="w-fit rounded-full bg-sage px-3 py-1 text-[12.5px] font-bold">{x.pilot.quote}</span>
                  <span aria-hidden className="text-[64px] leading-[0.5] font-extrabold text-green">“</span>
                  <blockquote className="flex flex-col gap-3 text-[16.5px] leading-relaxed">
                    {d.founder.note.map((p) => (
                      <p key={p}>{fmt(p, { brand: brandName(lang) })}</p>
                    ))}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 border-t border-forest/10 pt-5">
                    <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-forest text-[15px] font-bold text-lime" dir="ltr">
                      {d.founder.initials}
                    </span>
                    <span className="flex flex-col">
                      <span className="font-bold">{d.founder.name}</span>
                      <span className="text-[13.5px] text-[#55635a]">{d.founder.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ: cream accordion */}
        <section id="faq" className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:py-28">
          <div className="flex flex-col items-start gap-5">
            <Eyebrow>{d.faq.eyebrow}</Eyebrow>
            <h2 className="max-w-[16ch] text-[34px] leading-[1.12] font-extrabold tracking-[-0.03em] sm:text-[46px]">{d.faq.title}</h2>
            <Link href={`/${lang}/faq`} className="group mt-2 inline-flex items-center gap-3 text-[15.5px] font-bold">
              <RoundArrow />
              {d.faq.all}
            </Link>
          </div>
          <div className="flex flex-col border-t border-forest/15">
            {d.faq.items.map((f) => (
              <details key={f.q} className="group border-b border-forest/15 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17.5px] font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-forest/20 transition-all duration-300 group-open:rotate-180 group-open:border-lime group-open:bg-lime">
                    <ChevronDown className="size-4" aria-hidden />
                  </span>
                </summary>
                <p className="mt-3 max-w-[60ch] text-[15.5px] leading-relaxed text-[#4a5a50]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <SiteFooter lang={lang} d={d} />
        <JsonLd data={graph(organization(), website(lang), software(lang, d.meta.description))} />
      </div>
    </MotionRoot>
  );
}
