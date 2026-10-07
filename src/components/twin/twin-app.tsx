"use client";

import { ArrowLeft, ArrowRight, Moon, MousePointerClick, PackageCheck, Pause, Play, Scissors, Search, SlidersHorizontal, Sprout, Sun, Truck, ZoomIn } from "lucide-react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { fmt, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { track } from "@/lib/analytics";
import { cleanFarmName, MAX_FARM_NAME } from "@/lib/site";
import { useMedia } from "@/lib/use-media";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/ui/logo";
import type { AnchorSink } from "./scene";
import { FarmSim, JOURNEY, SPECTRA, fmtHour, type JourneyStep, type LogEntry, type Snapshot, type Spectrum } from "./sim";

const FarmCanvas = dynamic(() => import("./scene"), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;
type D = Dict["demo"];

/** DOM labels pinned to 3D anchors; positions arrive every frame from the scene. */
class Anchors implements AnchorSink {
  private els = new Map<string, HTMLElement>();
  private pos = new Map<string, [number, number, boolean]>();
  bind = (key: string) => (el: HTMLElement | null) => {
    if (el) this.els.set(key, el);
    else this.els.delete(key);
  };
  set = (key: string, x: number, y: number, visible: boolean) => {
    this.pos.set(key, [x, y, visible]);
  };
  flush = () => {
    this.els.forEach((el, key) => {
      const p = this.pos.get(key);
      if (!p) return;
      // Labels sit beside the tower's left edge regardless of reading direction.
      const dx = el.dataset.align === "left" ? "-100%" : "-50%";
      el.style.transform = `translate(${p[0].toFixed(1)}px, ${p[1].toFixed(1)}px) translate(${dx}, -50%)`;
      el.style.visibility = p[2] ? "visible" : "hidden";
    });
  };
}

/* ------------------------------ Primitives ------------------------------ */

function Card({ className, children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={cn(
        "rounded-2xl border border-line bg-white/92 shadow-[0_12px_32px_-20px_rgba(20,27,43,0.45)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

const Kicker = ({ children }: { children: ReactNode }) => (
  <div className="font-mono text-[10.5px] tracking-[0.1em] text-muted uppercase">{children}</div>
);

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase() || "CF";
}

function logText(d: D, l: LogEntry) {
  const crop = l.crop !== undefined ? d.crops[l.crop] : "";
  return fmt(d.log[l.key], { n: (l.floor ?? 0) + 1, crop, kg: l.kg ?? 0 });
}

/* ------------------------------- Tag layer ------------------------------ */

function TagLayer({ snap, sim, anchors, d, rtl }: { snap: Snapshot; sim: FarmSim; anchors: Anchors; d: D; rtl: boolean }) {
  const hidden = { visibility: "hidden" as const };
  if (snap.focus === null) {
    return (
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" dir="ltr">
        {snap.floors.map((fl, k) => (
          <button
            key={k}
            type="button"
            ref={anchors.bind(`f${k}`)}
            data-align="left"
            dir={rtl ? "rtl" : "ltr"}
            style={hidden}
            onClick={() => sim.setFocus(k)}
            className={cn(
              "pointer-events-auto absolute top-0 left-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap shadow-sm transition-colors",
              k === snap.sel ? "border-ink bg-ink text-white" : "border-line bg-white/95 hover:border-ink",
            )}
          >
            <bdi>{fmt(d.floorTag, { n: k + 1 })}</bdi>
            <span className="hidden sm:inline"> · {d.crops[k]}</span> ·{" "}
            {fl.state === "growing" ? `${Math.round(fl.g * 100)}%` : d.states[fl.state]}
          </button>
        ))}
      </div>
    );
  }
  const fl = snap.floors[snap.focus];
  const tags: [string, string][] = [
    [d.tags.air, `${fl.temp.toFixed(1)} °C · ${Math.round(fl.hum)}% RH`],
    [d.tags.co2, `${fl.co2} ppm`],
    [d.tags.water, `pH ${fl.ph.toFixed(1)} · EC ${fl.ec.toFixed(1)}`],
    [d.tags.led, fl.on ? `${SPECTRA[fl.spectrum].nm}` : d.tags.offUntil],
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" dir="ltr">
      {tags.map(([k, v], i) => (
        <div
          key={i}
          ref={anchors.bind(`s${i}`)}
          dir={rtl ? "rtl" : "ltr"}
          style={hidden}
          className="absolute top-0 left-0 rounded-lg border border-line bg-white/95 px-2 py-1 whitespace-nowrap shadow-sm"
        >
          <div className="text-[9.5px] font-medium tracking-[0.06em] text-muted uppercase">{k}</div>
          <div className="font-mono text-[11.5px]">{v}</div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------- Top bar ------------------------------- */

function TopBar({ snap, d, farm, ctaHref, langHref, langLabel, langTitle }: {
  snap: Snapshot;
  d: D;
  farm: string;
  ctaHref: string;
  langHref: string;
  langLabel: string;
  langTitle: string;
}) {
  const night = snap.day < 0.35;
  return (
    <Card className="flex min-w-0 items-center gap-2.5 px-2.5 py-2 sm:gap-3 sm:px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Mark />
        <div className="min-w-0">
          <div className="truncate font-display text-[15px] leading-tight font-bold sm:text-[16px]">{farm}</div>
          <div className="font-mono text-[10px] tracking-[0.06em] text-[#b76e00] uppercase">{d.sample}</div>
        </div>
      </div>
      <div className="hidden min-w-0 flex-1 items-center gap-2 truncate rounded-lg border border-line bg-[#f8fafc] px-2.5 py-1.5 text-[13px] text-muted xl:flex">
        <Search className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{d.search}</span>
      </div>
      <div className="ms-auto flex items-center gap-1.5 font-mono text-[12px] whitespace-nowrap text-[#0e9f6e] xl:ms-0" dir="ltr">
        {night ? <Moon className="size-3.5 text-[#5b6fa8]" aria-hidden /> : <Sun className="size-3.5 text-[#f5a524]" aria-hidden />}
        {fmtHour(snap.hour)}
      </div>
      <Link
        href={langHref}
        title={langTitle}
        className="rounded-full border border-line px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap hover:border-ink"
      >
        {langLabel}
      </Link>
      <Link
        href={ctaHref}
        className="hidden items-center gap-1.5 rounded-xl bg-green px-3 py-2 text-[13px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-green-ink sm:flex"
      >
        {d.getThis}
        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
      </Link>
      <div className="hidden items-center gap-2 whitespace-nowrap 2xl:flex">
        <span className="grid size-[30px] place-items-center rounded-full bg-ink font-mono text-[11px] text-white">{initials(farm)}</span>
        <span className="text-[11px] leading-tight text-muted">{d.role}</span>
      </div>
    </Card>
  );
}

/* --------------------------------- Stats -------------------------------- */

function Stats({ snap, d }: { snap: Snapshot; d: D }) {
  const solarShare = Math.min(100, Math.round((snap.solarKw / snap.loadKw) * 100));
  const items = [
    { k: d.stats.harvested, v: fmt(d.counts.kg, { n: snap.stats.kg }), s: fmt(d.stats.crates, { n: snap.stats.crates }), c: "text-[#0e9f6e]" },
    {
      k: d.stats.solar,
      v: `${solarShare}%`,
      s: fmt(d.stats.solarLine, { s: snap.solarKw, l: snap.loadKw }),
      c: snap.solarKw > 0 ? "text-[#b76e00]" : "text-muted",
    },
    { k: d.stats.deliveries, v: `${snap.stats.deliveries}`, s: d.van[snap.van], c: "text-[#2f5bea]" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 lg:flex lg:gap-2.5">
      {items.map((it, i) => (
        <Card key={i} delay={0.05 * i} className="min-w-0 px-3 py-2.5 lg:min-w-[160px] lg:px-3.5">
          <div className="text-[11px] leading-tight text-muted lg:truncate lg:text-[11.5px]">{it.k}</div>
          <div className="font-display text-[19px] leading-tight font-bold tabular-nums lg:text-[24px]">{it.v}</div>
          <div className={cn("line-clamp-2 font-mono text-[10.5px] leading-snug lg:truncate", it.c)}>{it.s}</div>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------ Floor panel ----------------------------- */

const PILL: Record<Snapshot["floors"][number]["state"], string> = {
  growing: "bg-[#ddf4ea] text-[#086b4a]",
  ready: "bg-[#fff1d6] text-[#8a5300]",
  harvesting: "bg-[#e3ebff] text-[#2f5bea]",
  empty: "bg-[#eef1f6] text-muted",
  seeding: "bg-[#e3ebff] text-[#2f5bea]",
};

function FloorPanel({ snap, sim, reduce, d }: { snap: Snapshot; sim: FarmSim; reduce: boolean; d: D }) {
  const k = snap.sel;
  const f = snap.floors[k];
  const canHarvest = snap.busyFloor === null && (f.state === "growing" || f.state === "ready") && f.g >= 0.6;
  const zoomed = snap.focus === k;
  return (
    <Card delay={0.1} className="flex min-w-0 flex-col gap-3.5 p-3.5">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={fmt(d.floor, { n: "" }).trim()}>
        {snap.floors.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={i === k}
            onClick={() => (snap.focus === null ? sim.select(i) : sim.setFocus(i))}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
              i === k ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
            )}
          >
            {fmt(d.floor, { n: i + 1 })}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={k}
          initial={{ opacity: 0, y: reduce ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -6 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="flex flex-col gap-3.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <Kicker>{fmt(d.floor, { n: k + 1 })}</Kicker>
              <div className="font-display text-[22px] leading-tight font-bold">{d.crops[k]}</div>
            </div>
            <span className={cn("mt-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium", PILL[f.state])}>{d.states[f.state]}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between gap-2 text-[12.5px]">
              <span className="text-muted">
                {f.state === "ready" ? d.readyToHarvest : f.state === "growing" ? fmt(d.dayOf, { d: f.day, t: f.days }) : d.states[f.state]}
              </span>
              <span className="font-mono tabular-nums">
                {f.state === "growing" ? fmt(d.daysLeft, { n: f.daysLeft }) : `${Math.round(f.g * 100)}%`}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#e9edf4]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: f.color }}
                animate={{ width: `${Math.max(2, f.g * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-dashed border-line pt-3">
            <Kicker>{d.lightRecipe}</Kicker>
            <div className="grid grid-cols-3 gap-1.5" role="group" aria-label={d.lightRecipe}>
              {(Object.keys(SPECTRA) as Spectrum[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={f.spectrum === s}
                  onClick={() => sim.setSpectrum(k, s)}
                  className={cn(
                    "flex min-w-0 flex-col items-start gap-1 rounded-xl border px-2 py-1.5 text-start transition-colors",
                    f.spectrum === s ? "border-ink bg-[#f4f6fa]" : "border-line bg-white hover:border-[#8c97ab]",
                  )}
                >
                  <span className="h-1.5 w-full rounded-full" style={{ background: SPECTRA[s].color, boxShadow: `0 0 10px ${SPECTRA[s].color}` }} />
                  <span className="truncate text-[11.5px] font-semibold">{d.spectra[s].label}</span>
                  <span className="truncate font-mono text-[9.5px] text-muted" dir="ltr">{SPECTRA[s].nm}</span>
                </button>
              ))}
            </div>
            <label htmlFor="cf-hours" className="mt-1 flex items-baseline justify-between gap-2 text-[12.5px]">
              <span>
                {d.lightsOn} <b className="font-mono font-medium">{fmt(d.hours, { n: f.hours })}</b>
              </span>
              <span className="font-mono text-[11px] text-muted">
                <bdi dir="ltr">{f.window}</bdi> · {f.on ? d.onNow : d.offNow}
              </span>
            </label>
            <input
              id="cf-hours"
              type="range"
              min={10}
              max={22}
              step={1}
              value={f.hours}
              onChange={(e) => sim.setHours(k, Number(e.target.value))}
              className="w-full accent-green"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              [d.growthSpeed, `${f.speedPct}%`, f.speedPct >= 100 ? "text-[#0e9f6e]" : "text-[#b76e00]"],
              [d.energyPerKg, `${f.kwhPerKg.toFixed(1)} kWh`, f.kwhPerKg <= 9.6 ? "text-[#0e9f6e]" : "text-[#b76e00]"],
              [d.air, `${f.temp.toFixed(1)} °C`, "text-ink"],
            ].map(([a, b, c]) => (
              <div key={a} className="min-w-0 rounded-xl bg-[#f4f6fa] px-2 py-1.5">
                <div className="truncate text-[10.5px] text-muted">{a}</div>
                <div className={cn("truncate font-mono text-[13px] font-medium tabular-nums", c)} dir="ltr">
                  {b}
                </div>
              </div>
            ))}
          </div>
          <p className="-mt-1 text-[11.5px] leading-snug text-muted">
            {d.spectra[f.spectrum].label}: {d.spectra[f.spectrum].note}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => sim.setFocus(zoomed ? null : k)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-[13px] font-semibold transition-colors hover:border-ink"
            >
              {zoomed ? <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden /> : <ZoomIn className="size-4" aria-hidden />}
              {zoomed ? d.back : d.zoomIn}
            </button>
            <button
              type="button"
              disabled={!canHarvest}
              onClick={() => sim.harvest(k)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-[13px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Scissors className="size-4" aria-hidden />
              {snap.busyFloor === k ? d.harvesting : snap.busyFloor !== null ? d.lineBusy : f.g < 0.6 ? d.tooEarly : d.harvestNow}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

/* -------------------------------- Journey ------------------------------- */

const STEP_ICON: Record<JourneyStep, typeof Sprout> = {
  Seed: Sprout,
  Grow: Sun,
  Harvest: Scissors,
  Pack: PackageCheck,
  Deliver: Truck,
};

function Journey({ snap, d }: { snap: Snapshot; d: D }) {
  const counts: Record<JourneyStep, string> = {
    Seed: fmt(d.counts.trays, { n: snap.stats.seeded }),
    Grow: fmt(d.counts.floors, { n: snap.floors.filter((f) => f.state === "growing" || f.state === "ready").length }),
    Harvest: fmt(d.counts.kg, { n: snap.stats.kg }),
    Pack: fmt(d.counts.crates, { n: snap.stats.crates }),
    Deliver: fmt(d.counts.runs, { n: snap.stats.deliveries }),
  };
  return (
    <Card delay={0.15} className="flex min-w-0 flex-col gap-3 p-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <b className="text-[13.5px]">{d.journey}</b>
        <span className="font-mono text-[11px] text-muted">
          {snap.busyFloor !== null ? fmt(d.inLine, { n: snap.busyFloor + 1 }) : fmt(d.atDock, { n: snap.stack })}
        </span>
      </div>
      <ol className="grid grid-cols-5 gap-1">
        {JOURNEY.map((s, i) => {
          const Icon = STEP_ICON[s];
          const active = snap.step === s;
          return (
            <li key={s} className="relative flex flex-col items-center gap-1 text-center">
              {i < JOURNEY.length - 1 && (
                <span className="absolute top-[17px] start-[calc(50%+20px)] h-0.5 w-[calc(100%-40px)] bg-line" aria-hidden />
              )}
              <span
                className={cn(
                  "relative grid size-[34px] place-items-center rounded-full transition-colors",
                  active ? "bg-green text-white shadow-[0_0_0_5px_rgba(46,158,91,0.18)]" : "bg-[#eef1f6] text-muted",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className={cn("text-[12px] font-semibold", active ? "text-ink" : "text-muted")}>{d.steps[s]}</span>
              <span className="font-mono text-[10.5px] text-muted tabular-nums">{counts[s]}</span>
            </li>
          );
        })}
      </ol>
      <ul className="flex flex-col gap-1 border-t border-dashed border-line pt-2.5" aria-live="polite">
        <AnimatePresence initial={false}>
          {snap.log.slice(0, 3).map((l) => (
            <motion.li
              key={l.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2.5 text-[12px]"
            >
              <span className="font-mono text-muted">{l.time}</span>
              <span className="min-w-0 truncate">{logText(d, l)}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  );
}

/* --------------------------------- Clock -------------------------------- */

function Clock({ snap, sim, d }: { snap: Snapshot; sim: FarmSim; d: D }) {
  const night = snap.day < 0.35;
  const lit = snap.floors.filter((f) => f.on).length;
  return (
    <Card delay={0.2} className="flex min-w-0 flex-col gap-2.5 p-3.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Kicker>{night ? d.nightShift : d.dayShift}</Kicker>
          <div className="flex items-center gap-2 font-display text-[30px] leading-none font-bold tabular-nums" dir="ltr">
            {night ? <Moon className="size-5 text-[#5b6fa8]" aria-hidden /> : <Sun className="size-5 text-[#f5a524]" aria-hidden />}
            {fmtHour(snap.hour)}
          </div>
        </div>
        <button
          type="button"
          aria-pressed={snap.playing}
          onClick={() => sim.setPlaying(!snap.playing)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors",
            snap.playing ? "bg-green text-white" : "border border-line bg-white",
          )}
        >
          {snap.playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
          {snap.playing ? d.pause : d.play}
        </button>
      </div>
      <div dir="ltr" className="flex flex-col gap-1">
        <input
          type="range"
          min={0}
          max={23.75}
          step={0.25}
          value={snap.hour}
          aria-label={d.timeOfDay}
          onChange={(e) => sim.setHour(Number(e.target.value))}
          className="w-full accent-green"
        />
        <div className="flex justify-between font-mono text-[10.5px] text-muted">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
      <p className="text-[11.5px] leading-snug text-muted">{fmt(d.litNote, { n: lit })}</p>
    </Card>
  );
}

/* ------------------------------- CTA card ------------------------------- */

function CtaCard({ d, farm, href }: { d: D; farm: string; href: string }) {
  return (
    <Card delay={0.25} className="flex flex-col gap-2.5 border-transparent bg-ink p-4 text-white">
      <div className="font-display text-[18px] leading-snug font-bold">{fmt(d.cta.title, { farm })}</div>
      <p className="text-[12.5px] leading-snug text-white/70">{d.cta.sub}</p>
      <Link
        href={href}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-green px-3 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-[#35b468]"
      >
        {d.cta.button}
        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
      </Link>
    </Card>
  );
}

/* ------------------------------- Welcome ------------------------------- */

function Welcome({ d, farm, onStart }: { d: D; farm: string; onStart: (name: string) => void }) {
  const [name, setName] = useState(farm);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!farm) input.current?.focus();
  }, [farm]);
  const icons = [MousePointerClick, SlidersHorizontal, Moon];
  return (
    <motion.div
      data-consent-wait
      className="fixed inset-0 z-50 grid place-items-center bg-[#0b1222]/45 p-4 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onStart(name);
      }}
    >
      <motion.form
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: EASE }}
        onSubmit={(e) => {
          e.preventDefault();
          onStart(name);
        }}
        className="flex w-full max-w-[440px] flex-col gap-4 rounded-3xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <Mark className="size-9 rounded-xl" />
        <div className="flex flex-col gap-1.5">
          <h2 id="welcome-title" className="font-display text-[24px] leading-tight font-bold text-balance">
            {farm ? fmt(d.welcome.title, { farm }) : d.welcome.titleNoName}
          </h2>
          <p className="text-[14px] text-muted">{d.welcome.sub}</p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {d.welcome.tips.map((t, i) => {
            const Icon = icons[i];
            return (
              <li key={i} className="flex items-start gap-3 text-[14px]">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#eef6f1] text-green">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="pt-1">{t}</span>
              </li>
            );
          })}
        </ul>
        <label className="flex flex-col gap-1.5 text-[13px] font-medium">
          {d.welcome.nameLabel}
          <input
            ref={input}
            value={name}
            maxLength={MAX_FARM_NAME}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-line px-3 py-2.5 text-[15px] font-normal outline-none focus:border-green"
          />
        </label>
        <button type="submit" className="rounded-xl bg-green px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-green-ink">
          {d.welcome.start}
        </button>
      </motion.form>
    </motion.div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function TwinApp({
  lang,
  dict,
  farm: initialFarm,
  fallbackName,
  langLabel,
  langTitle,
}: {
  lang: Locale;
  dict: D;
  farm: string;
  fallbackName: string;
  langLabel: string;
  langTitle: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const router = useRouter();
  const [sim] = useState(() => new FarmSim());
  const [anchors] = useState(() => new Anchors());
  const snap = useSyncExternalStore(sim.subscribe, sim.getSnapshot, sim.getSnapshot);
  const wide = useMedia("(min-width: 1024px)");
  const [farm, setFarm] = useState(initialFarm);
  const [welcome, setWelcome] = useState(true);

  useEffect(() => {
    if (reduce) sim.setPlaying(false);
  }, [reduce, sim]);

  // Funnel: the demo opened, then the first real touch, click or key press inside it.
  const interacted = useRef(false);
  useEffect(() => {
    track("demo_opened", { lang, named: Boolean(initialFarm) });
  }, [lang, initialFarm]);
  const onInteract = () => {
    // Taps on the welcome card don't count: it's the gate, not the demo.
    if (interacted.current || welcome) return;
    interacted.current = true;
    track("demo_interaction", { lang });
  };

  const shown = farm || fallbackName;
  const q = farm ? `?farm=${encodeURIComponent(farm)}` : "";
  const ctaHref = `/${lang}/request${q}`;
  const langHref = `/${lang === "en" ? "ar" : "en"}/demo${q}`;
  const zoomed = snap.focus !== null;

  const start = (name: string) => {
    const clean = cleanFarmName(name);
    setFarm(clean);
    setWelcome(false);
    if (clean !== initialFarm) router.replace(`/${lang}/demo${clean ? `?farm=${encodeURIComponent(clean)}` : ""}`, { scroll: false });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        onPointerDownCapture={onInteract}
        onKeyDownCapture={onInteract}
        className="relative w-full overflow-x-hidden bg-[#e8eef4] pb-20 sm:pb-0 lg:h-svh lg:min-h-[740px] lg:overflow-hidden"
      >
        <div className="relative h-[60svh] min-h-[360px] lg:absolute lg:inset-0 lg:h-auto">
          {wide !== null && <FarmCanvas sim={sim} reduce={reduce} compact={!wide} anchors={anchors} rtl={lang === "ar"} />}
          <TagLayer snap={snap} sim={sim} anchors={anchors} d={dict} rtl={lang === "ar"} />

          <div className="pointer-events-none absolute inset-x-3 top-3 z-30 lg:inset-x-4 lg:top-4 [&>*]:pointer-events-auto">
            <TopBar snap={snap} d={dict} farm={shown} ctaHref={ctaHref} langHref={langHref} langLabel={langLabel} langTitle={langTitle} />
          </div>

          <AnimatePresence>
            {zoomed && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                onClick={() => sim.setFocus(null)}
                className="absolute start-3 bottom-3 z-30 flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[13px] font-semibold text-white shadow-lg lg:start-1/2 lg:top-[92px] lg:bottom-auto lg:-translate-x-1/2 rtl:lg:translate-x-1/2"
              >
                <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
                {dict.back}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {wide ? (
          <>
            <div className="absolute start-4 top-[84px] z-30">
              <Stats snap={snap} d={dict} />
            </div>
            <div className="absolute end-4 top-[84px] bottom-4 z-30 flex w-[340px] flex-col gap-3 overflow-y-auto pb-1">
              <FloorPanel snap={snap} sim={sim} reduce={reduce} d={dict} />
              <Clock snap={snap} sim={sim} d={dict} />
              <CtaCard d={dict} farm={shown} href={ctaHref} />
            </div>
            <div className="absolute start-4 bottom-4 z-30 w-[min(560px,calc(100%-388px))]">
              <Journey snap={snap} d={dict} />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 border-t border-line bg-[#f1f4f8] p-3">
            <Stats snap={snap} d={dict} />
            <FloorPanel snap={snap} sim={sim} reduce={reduce} d={dict} />
            <CtaCard d={dict} farm={shown} href={ctaHref} />
            <Journey snap={snap} d={dict} />
            <Clock snap={snap} sim={sim} d={dict} />
          </div>
        )}

        {/* Phone: the call to action is always one tap away. */}
        <div data-cta-bar className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur sm:hidden">
          <Link
            href={ctaHref}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-green px-4 py-3 text-[15px] font-semibold text-white"
          >
            {dict.getThis}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>

        <AnimatePresence>{welcome && <Welcome d={dict} farm={farm} onStart={start} />}</AnimatePresence>
      </div>
    </MotionConfig>
  );
}
