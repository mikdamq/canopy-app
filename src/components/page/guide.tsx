import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { fmt, type Locale } from "@/i18n/config";
import type { GuideCopy, GuideSection } from "@/i18n/guides-en";
import { GUIDES, href, guidePath, type Guide } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Steps } from "./blocks";

/** Text with links written as [words](/path); the path is after the language. */
export function Rich({ lang, text }: { lang: Locale; text: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    out.push(text.slice(last, m.index));
    out.push(
      <Link key={m.index} href={href(lang, m[2])} className="font-semibold text-green-ink underline underline-offset-4 hover:text-green">
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return <>{out.map((n, i) => (typeof n === "string" ? <Fragment key={`t${i}`}>{n}</Fragment> : n))}</>;
}

/** Plain text of a string with [words](/path) links, for word counts and structured data. */
export const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

/** Reading time in minutes, at about 200 words a minute (never under 3). */
export function readMinutes(g: GuideCopy) {
  const text = [g.lead, ...g.summary, ...g.sections.flatMap((s) => [...s.body, ...(s.list ?? []), ...(s.steps ?? []).map((x) => `${x.t} ${x.d}`)]), ...g.faq.map((f) => `${f.q} ${f.a}`)];
  const words = plain(text.join(" ")).split(/\s+/).length;
  return Math.max(3, Math.round(words / 200));
}

/** The small 3D still at the top of a guide card. */
function Thumb({ g, className }: { g: GuideCopy; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static WebP still, small size; no image optimiser on the cPanel host
    <img
      src={`/farms/${g.image}-sm.webp`}
      width={800}
      height={500}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn("w-full bg-[#e6ebee] object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none", className)}
    />
  );
}

/** A guide's card on the Guides page and under "More guides". `dark` is for cards on an ink band. */
export function GuideCard({
  lang,
  g,
  guide,
  read,
  open,
  tag,
  dark,
}: {
  lang: Locale;
  g: GuideCopy;
  guide: Guide;
  read: string;
  open: string;
  tag?: string;
  dark?: boolean;
}) {
  return (
    <li>
      <Link
        href={href(lang, guidePath(guide))}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-3xl border transition-colors",
          dark ? "border-white/10 bg-white/[0.06] text-white hover:border-white/40" : "border-transparent bg-white hover:border-forest/25",
        )}
      >
        <div className="overflow-hidden">
          <Thumb g={g} className="aspect-[16/9]" />
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-6">
          <p className={cn("flex flex-wrap items-center gap-2 text-[12.5px]", dark ? "text-[#b9c3d6]" : "text-muted")}>
            {tag && (
              <span className={cn("rounded-full px-2.5 py-0.5 font-semibold", dark ? "bg-white/10 text-white" : "bg-sage text-green-ink")}>{tag}</span>
            )}
            <span>{fmt(read, { n: String(readMinutes(g)) })}</span>
          </p>
          <h3 className="font-display text-[20px] leading-snug font-bold text-balance">{g.title}</h3>
          <p className={cn("line-clamp-3 text-[14.5px] leading-relaxed", dark ? "text-[#b9c3d6]" : "text-muted")}>{g.meta.description}</p>
          <span className={cn("mt-auto inline-flex items-center gap-1.5 pt-2 text-[14.5px] font-semibold", dark ? "text-white" : "text-green")}>
            {open}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
          </span>
        </div>
      </Link>
    </li>
  );
}

/** The main guide, as a wide featured card. */
export function FeaturedGuide({ lang, g, badge, read, open }: { lang: Locale; g: GuideCopy; badge: string; read: string; open: string }) {
  return (
    <Link
      href={href(lang, guidePath("guide"))}
      className="group grid overflow-hidden rounded-[32px] border border-transparent bg-white shadow-[0_30px_80px_-40px_rgba(14,59,41,0.5)] transition-colors hover:border-forest/25 lg:grid-cols-[1.15fr_1fr]"
    >
      <div className="overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- static WebP still in two sizes; no image optimiser on the cPanel host */}
        <img
          src={`/farms/${g.image}.webp`}
          srcSet={`/farms/${g.image}-sm.webp 800w, /farms/${g.image}.webp 1600w`}
          sizes="(min-width: 1024px) 640px, 100vw"
          width={1600}
          height={1000}
          alt=""
          decoding="async"
          fetchPriority="high"
          className="aspect-[16/10] h-full w-full bg-[#e6ebee] object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
        <p className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
          <span className="rounded-full bg-lime px-3 py-1 font-bold text-forest">{badge}</span>
          <span>{fmt(read, { n: String(readMinutes(g)) })}</span>
        </p>
        <h2 className="font-display text-[28px] leading-[1.08] font-bold tracking-[-0.015em] text-balance sm:text-[36px]">{g.title}</h2>
        <p className="text-[16px] leading-relaxed text-muted">{g.meta.description}</p>
        <span className="inline-flex items-center gap-2 pt-1 text-[16px] font-semibold text-green">
          {open}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/** Up to three other guides for "More guides": same topic first, then the main guide, then the rest. */
export function otherGuides(g: Guide, topicOf: (x: Guide) => string | undefined) {
  const t = topicOf(g);
  const rest = GUIDES.filter((o) => o !== g);
  const same = rest.filter((o) => t && topicOf(o) === t);
  const order = [...same, ...(g === "guide" ? [] : (["guide"] as Guide[])), ...rest];
  return [...new Set(order)].filter((o) => o !== g).slice(0, 3);
}

/** One numbered section of a guide: its h2, paragraphs, then a list, steps or table if it has one. */
export function GuideBlock({ lang, s, n }: { lang: Locale; s: GuideSection; n: number }) {
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="flex scroll-mt-28 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[13px] font-semibold text-green" dir="ltr">
          {String(n).padStart(2, "0")}
        </span>
        <h2 id={`${s.id}-title`} className="font-display text-[26px] leading-[1.15] font-bold tracking-[-0.015em] text-balance sm:text-[30px]">
          {s.h}
        </h2>
      </div>
      {s.body.map((t) => (
        <p key={t} className="text-[17.5px] leading-[1.8] text-ink/85 sm:text-[18px]">
          <Rich lang={lang} text={t} />
        </p>
      ))}
      {s.list && (
        <ul className="flex flex-col gap-3">
          {s.list.map((t) => (
            <li key={t} className="flex items-start gap-3 text-[17px] leading-[1.7] text-ink/85">
              <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-forest text-lime">
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </span>
              <span>
                <Rich lang={lang} text={t} />
              </span>
            </li>
          ))}
        </ul>
      )}
      {s.steps && (
        <div className="[&_ol]:sm:grid-cols-1">
          <Steps items={s.steps} />
        </div>
      )}
      {s.table && (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[520px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-line bg-white text-start text-[15px]">
            <thead>
              <tr>
                {s.table.head.map((h, i) => (
                  <th key={i} scope="col" className="border-b border-forest bg-forest px-4 py-3 text-start font-semibold text-white">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.table.rows.map((row, r) => (
                <tr key={r} className="even:bg-cream">
                  {row.map((c, i) =>
                    i === 0 && s.table!.head[0] === "" ? (
                      <th key={i} scope="row" className="border-b border-line px-4 py-3 text-start align-top font-semibold [tr:last-child_&]:border-b-0">
                        {c}
                      </th>
                    ) : (
                      <td key={i} className="border-b border-line px-4 py-3 align-top leading-relaxed text-ink/80 [tr:last-child_&]:border-b-0">
                        {c}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {s.note && <p className="text-[13.5px] text-muted">{s.note}</p>}
    </section>
  );
}
