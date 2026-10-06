import { ArrowRight, Check, ChevronDown, Moon, PackageCheck, Scissors, Sprout, Sun, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroTwin } from "@/components/landing/hero-twin";
import { NameForm } from "@/components/landing/name-form";
import { Logo } from "@/components/ui/logo";
import { SiteHeader } from "@/components/ui/site-header";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { BRAND, CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={cn("font-mono text-[12px] tracking-[0.12em] uppercase", dark ? "text-[#7fe0a6]" : "text-green")}>{children}</p>;
}

function H2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("max-w-[22ch] font-display text-[32px] leading-[1.05] font-bold tracking-[-0.02em] text-balance sm:text-[42px]", className)}>
      {children}
    </h2>
  );
}

/* Small illustrations for the feature cards, drawn from the product's own UI. */
function FeatureArt({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="flex flex-col gap-1.5">
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
      <div className="grid grid-cols-3 gap-1.5">
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
    <div className="relative h-[54px] overflow-hidden rounded-xl" style={{ background: "linear-gradient(90deg,#0b1222 0%,#1d2a4a 22%,#e8eef4 40%,#e8eef4 62%,#1d2a4a 80%,#0b1222 100%)" }}>
      <Sun className="absolute top-3 left-1/2 size-5 -translate-x-1/2 text-[#f5a524]" aria-hidden />
      <Moon className="absolute top-3 left-3 size-4 text-[#9fb2ff]" aria-hidden />
      <span className="absolute inset-x-0 bottom-0 h-1.5 bg-[#ff4fd8]/70 [clip-path:polygon(0_0,30%_0,30%_100%,0_100%)]" />
    </div>
  );
}

export default async function Landing({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  const other = lang === "en" ? "ar" : "en";
  const year = new Date().getFullYear();

  return (
    <div className="bg-bg">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_70%_40%,#f7f9fb_0%,#e3e9f0_70%)]">
        <SiteHeader lang={lang} nav={d.nav} langHref={`/${other}`} className="relative z-20" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 px-4 pt-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:pt-10 lg:pb-20">
          <div className="relative z-10 flex flex-col gap-6">
            <Eyebrow>{d.hero.eyebrow}</Eyebrow>
            <h1 className="max-w-[14ch] font-display text-[44px] leading-[0.98] font-extrabold tracking-[-0.03em] text-balance sm:text-[60px] lg:text-[68px]">
              {d.hero.title}
            </h1>
            <p className="max-w-[48ch] text-[17px] leading-relaxed text-muted">{d.hero.sub}</p>
            <NameForm
              lang={lang}
              label={d.hero.inputLabel}
              placeholder={d.hero.placeholder}
              button={d.hero.open}
              error={d.hero.nameError}
              note={d.hero.note}
            />
          </div>
          <div className="relative h-[340px] sm:h-[440px] lg:h-[560px]">
            <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/70 bg-[#e8eef4] shadow-[0_40px_80px_-50px_rgba(20,27,43,0.6)]">
              <HeroTwin />
            </div>
            <div className="absolute start-3 top-3 rounded-2xl border border-line bg-white/95 px-3 py-2 shadow-sm sm:start-5 sm:top-5">
              <div className="text-[11px] text-muted">{d.hero.stat1}</div>
              <div className="text-[13px] font-semibold text-[#8a5300]">{d.hero.stat1v}</div>
            </div>
            <div className="absolute end-3 bottom-3 rounded-2xl border border-line bg-white/95 px-3 py-2 shadow-sm sm:end-5 sm:bottom-5">
              <div className="text-[11px] text-muted">{d.hero.stat2}</div>
              <div className="text-[13px] font-semibold text-green-ink">{d.hero.stat2v}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-5 sm:px-6">
          <span className="font-mono text-[12px] tracking-[0.1em] text-muted uppercase">{d.built.title}</span>
          {d.built.items.map((t) => (
            <span key={t} className="text-[15px] font-semibold">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-20 sm:px-6 lg:py-28">
        <div className="flex flex-col gap-4">
          <Eyebrow>{d.how.eyebrow}</Eyebrow>
          <H2>{d.how.title}</H2>
        </div>
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {d.how.steps.map((s, i) => (
            <li key={i} className="flex flex-col gap-3 border-t-2 border-ink pt-5">
              <span className="font-mono text-[13px] text-muted">0{i + 1}</span>
              <h3 className="font-display text-[22px] font-bold">{s.t}</h3>
              <p className="max-w-[38ch] text-[15.5px] leading-relaxed text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-6 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="flex flex-col gap-4">
            <Eyebrow>{d.features.eyebrow}</Eyebrow>
            <H2>{d.features.title}</H2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {d.features.items.map((f, i) => (
              <article key={i} className="flex flex-col gap-5 rounded-3xl border border-line bg-bg p-6">
                <div className="rounded-2xl border border-line bg-[#f7f9fb] p-4">
                  <FeatureArt i={i} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-[21px] font-bold">{f.t}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{f.d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Try with your name */}
      <section className="bg-night text-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="flex flex-col gap-3">
            <H2 className="text-white">{d.tryBand.title}</H2>
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-white/65">{d.tryBand.sub}</p>
          </div>
          <NameForm lang={lang} tone="dark" label={d.hero.inputLabel} placeholder={d.hero.placeholder} button={d.hero.open} error={d.hero.nameError} />
        </div>
      </section>

      {/* Who */}
      <section id="who" className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-20 sm:px-6 lg:py-28">
        <div className="flex flex-col gap-4">
          <Eyebrow>{d.who.eyebrow}</Eyebrow>
          <H2>{d.who.title}</H2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {d.who.items.map((w) => (
            <div key={w.t} className="flex flex-col gap-2">
              <h3 className="font-display text-[20px] font-bold">{w.t}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pilot */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="grid gap-8 rounded-[32px] border border-line bg-white p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-4">
            <Eyebrow>{d.pilot.eyebrow}</Eyebrow>
            <H2>{d.pilot.title}</H2>
            <p className="max-w-[44ch] text-[16px] leading-relaxed text-muted">{d.pilot.sub}</p>
            <Link
              href={`/${lang}/request`}
              className="mt-2 flex w-fit items-center gap-2 rounded-xl bg-green px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-green-ink"
            >
              {d.pilot.cta}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-2xl bg-[#eef6f1] p-5">
              <h3 className="font-semibold">{d.pilot.freeTitle}</h3>
              <ul className="flex flex-col gap-2.5">
                {d.pilot.free.map((t) => (
                  <li key={t} className="flex gap-2 text-[14.5px]">
                    <Check className="mt-0.5 size-4 shrink-0 text-green" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl bg-bg p-5">
              <h3 className="font-semibold text-muted">{d.pilot.laterTitle}</h3>
              <ul className="flex flex-col gap-2.5">
                {d.pilot.later.map((t) => (
                  <li key={t} className="flex gap-2 text-[14.5px] text-muted">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#9aa6ba]" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-6 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:py-28">
          <div className="flex flex-col gap-4">
            <Eyebrow>{d.faq.eyebrow}</Eyebrow>
            <H2>{d.faq.title}</H2>
          </div>
          <div className="flex flex-col">
            {d.faq.items.map((f) => (
              <details key={f.q} className="group border-b border-line py-5 first:pt-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-3 max-w-[60ch] text-[15.5px] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="flex flex-col items-start gap-6 rounded-[32px] bg-ink p-8 text-white sm:p-12">
          <H2 className="text-white">{d.final.title}</H2>
          <p className="max-w-[46ch] text-[16px] text-white/65">{d.final.sub}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${lang}/request`}
              className="flex items-center gap-2 rounded-xl bg-green px-5 py-3 text-[15px] font-semibold transition-colors hover:bg-[#35b468]"
            >
              {d.final.cta}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
            <Link href={`/${lang}/demo`} className="rounded-xl border border-white/20 px-5 py-3 text-[15px] font-semibold transition-colors hover:border-white/60">
              {d.final.demo}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-col gap-2">
            <Logo />
            <p className="text-[14px] text-muted">{d.footer.tagline}</p>
          </div>
          <div className="flex flex-col gap-1 text-[14px] text-muted sm:items-end">
            <span>
              {d.footer.contact}:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline-offset-4 hover:underline" dir="ltr">
                {CONTACT_EMAIL}
              </a>
            </span>
            <span>
              © {year} {BRAND}. {d.footer.rights}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
