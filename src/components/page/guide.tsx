import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { fmt, type Locale } from "@/i18n/config";
import type { GuideCopy, GuideSection } from "@/i18n/guides-en";
import { GUIDES, href, guidePath, type Guide } from "@/lib/routes";
import { h2Cls, Steps, Ticks } from "./blocks";

/** Reading time in minutes, at about 200 words a minute (never under 3). */
export function readMinutes(g: GuideCopy) {
  const text = [g.lead, ...g.summary, ...g.sections.flatMap((s) => [...s.body, ...(s.list ?? []), ...(s.steps ?? []).map((x) => `${x.t} ${x.d}`)]), ...g.faq.map((f) => `${f.q} ${f.a}`)];
  const words = text.join(" ").split(/\s+/).length;
  return Math.max(3, Math.round(words / 200));
}

/** A guide's card on the Guides page and under "More guides". */
export function GuideCard({ lang, g, guide, read, open }: { lang: Locale; g: GuideCopy; guide: Guide; read: string; open: string }) {
  return (
    <li>
      <Link
        href={href(lang, guidePath(guide))}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-colors hover:border-green"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static WebP still, small size; no image optimiser on the cPanel host */}
        <img
          src={`/farms/${g.image}-sm.webp`}
          width={800}
          height={500}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full bg-[#e6ebee] object-cover"
        />
        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="font-mono text-[12px] text-muted">{fmt(read, { n: String(readMinutes(g)) })}</p>
          <h3 className="font-display text-[19px] leading-snug font-bold text-balance">{g.title}</h3>
          <p className="text-[14.5px] leading-relaxed text-muted">{g.meta.description}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[14.5px] font-semibold text-green">
            {open}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
          </span>
        </div>
      </Link>
    </li>
  );
}

export const otherGuides = (g: Guide) => GUIDES.filter((o) => o !== g);

/** One section of a guide: its h2, paragraphs, then a list, steps or table if it has one. */
export function GuideBlock({ s }: { s: GuideSection }) {
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="flex scroll-mt-24 flex-col gap-4">
      <h2 id={`${s.id}-title`} className={h2Cls}>
        {s.h}
      </h2>
      {s.body.map((t) => (
        <p key={t} className="text-[16.5px] leading-[1.7]">
          {t}
        </p>
      ))}
      {s.list && <Ticks items={s.list} />}
      {s.steps && (
        <div className="[&_ol]:lg:grid-cols-2">
          <Steps items={s.steps} />
        </div>
      )}
      {s.table && (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[520px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-line bg-white text-start text-[14.5px]">
            <thead>
              <tr>
                {s.table.head.map((h, i) => (
                  <th key={i} scope="col" className="border-b border-line bg-[#eaf5ee] px-4 py-3 text-start font-semibold text-green-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.table.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((c, i) =>
                    i === 0 && s.table!.head[0] === "" ? (
                      <th key={i} scope="row" className="border-b border-line px-4 py-3 text-start align-top font-semibold [tr:last-child_&]:border-b-0">
                        {c}
                      </th>
                    ) : (
                      <td key={i} className="border-b border-line px-4 py-3 align-top leading-relaxed text-muted [tr:last-child_&]:border-b-0">
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
      {s.note && <p className="text-[13px] text-muted">{s.note}</p>}
    </section>
  );
}
