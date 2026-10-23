import { ArrowRight, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Building blocks for the content pages. Plain server components with semantic HTML
 * (one h1 per page, h2 per section, lists as lists), so search engines and AI tools can
 * read the structure. Motion is left out on purpose: these pages are for reading.
 */

export const h2Cls = "font-display text-[30px] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance sm:text-[40px]";

/** A small pill above a heading; lime on the forest band (`.band`), forest on cream. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex w-fit items-center gap-2 rounded-full bg-forest/[0.07] px-3 py-1 text-[12.5px] font-semibold text-forest in-[.band]:bg-white/10 in-[.band]:text-lime">
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </p>
  );
}

/** The page's opening, on the forest band: eyebrow, the one h1, and an answer-first lead paragraph. */
export function PageIntro({ eyebrow, title, lead, children, aside }: { eyebrow: string; title: string; lead: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <div className={cn("grid items-center gap-10", aside && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14")}>
      <div className="flex flex-col gap-4">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-[20ch] font-display text-[38px] leading-[1.06] font-extrabold tracking-[-0.035em] text-balance text-white sm:text-[56px]">{title}</h1>
        <p className="max-w-[60ch] text-[17px] leading-relaxed text-white/70 sm:text-[18px]">{lead}</p>
        {children && <div className="mt-2 flex flex-wrap items-center gap-3">{children}</div>}
      </div>
      {aside}
    </div>
  );
}

export function Section({ id, title, lead, children, tone }: { id?: string; title: string; lead?: string; children?: ReactNode; tone?: "white" }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={cn("scroll-mt-24", tone === "white" && "bg-sage")}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col gap-3">
          <h2 id={id ? `${id}-title` : undefined} className={h2Cls}>
            {title}
          </h2>
          {lead && <p className="max-w-[62ch] text-[16px] leading-relaxed text-muted">{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export function Cards({ items, cols = 3, icons }: { items: readonly { t: string; d: string }[]; cols?: 2 | 3 | 4; icons?: ReactNode[] }) {
  return (
    <ul className={cn("grid gap-4", cols === 2 && "sm:grid-cols-2", cols === 3 && "sm:grid-cols-2 lg:grid-cols-3", cols === 4 && "sm:grid-cols-2 lg:grid-cols-4")}>
      {items.map((it, i) => (
        <li key={it.t} className="flex flex-col gap-2 rounded-[24px] bg-white p-6">
          {icons?.[i] && <span className="mb-2 grid size-11 place-items-center rounded-full bg-forest text-lime">{icons[i]}</span>}
          <h3 className="font-display text-[19px] font-bold">{it.t}</h3>
          <p className="text-[15px] leading-relaxed text-muted">{it.d}</p>
        </li>
      ))}
    </ul>
  );
}

export function Steps({ items }: { items: readonly { t: string; d: string }[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <li key={it.t} className="flex gap-4 rounded-[24px] bg-white p-5 sm:p-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-[14px] font-bold text-lime" dir="ltr">
            0{i + 1}
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-[17px] font-bold">{it.t}</h3>
            <p className="text-[14.5px] leading-relaxed text-muted">{it.d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Ticks({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3 text-[15.5px] leading-relaxed">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-forest text-lime">
            <Check className="size-3.5" strokeWidth={3} aria-hidden />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Questions as native disclosure widgets: readable without JavaScript and by crawlers. */
export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="flex flex-col border-t border-forest/15">
      {items.map((it) => (
        <details key={it.q} className="group border-b border-forest/15 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[17px] font-bold">
            <h3>{it.q}</h3>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-forest/20 transition-all duration-300 group-open:rotate-180 group-open:border-lime group-open:bg-lime">
              <ChevronDown className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="max-w-[64ch] pb-5 text-[15.5px] leading-relaxed text-muted">{it.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Lime pill: the main action. On cream it turns forest on hover, on the forest band white. */
export const primaryCls =
  "inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-[15px] font-bold text-forest transition-colors hover:bg-forest hover:text-white in-[.band]:hover:bg-white in-[.band]:hover:text-forest";

/** Outlined pill: the second action. Forest on cream, white on the forest band. */
export const secondaryCls =
  "inline-flex items-center gap-2 rounded-full border-2 border-forest/25 px-5 py-2.5 text-[15px] font-bold text-forest transition-colors hover:border-forest in-[.band]:border-white/30 in-[.band]:text-white in-[.band]:hover:border-white";

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={primaryCls}>
      {children}
      <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
    </Link>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={secondaryCls}>
      {children}
    </Link>
  );
}

/** One of the 3D farm stills, in two sizes, with real alt text. */
export function FarmImage({ name, alt, priority, className }: { name: string; alt: string; priority?: boolean; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static WebP stills that already come in two sizes; there's no image optimiser on the cPanel host
    <img
      src={`/farms/${name}.webp`}
      srcSet={`/farms/${name}-sm.webp 800w, /farms/${name}.webp 1600w`}
      sizes="(min-width: 1024px) 560px, 100vw"
      width={1600}
      height={1000}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={cn("aspect-[16/10] w-full rounded-[28px] bg-[#e6ebee] object-cover", className)}
    />
  );
}
