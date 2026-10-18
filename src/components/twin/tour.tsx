"use client";

import { ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { fmt } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { FarmSim, Snapshot } from "./sim";

type D = Dict["demo"];
export type TourPanel = "floor" | "clock" | "journey" | "numbers";

/** Remembered per device: once finished or skipped, the tour doesn't start by itself again. */
export const TOUR_KEY = "canopy-tour";
export function tourSeen() {
  try {
    return localStorage.getItem(TOUR_KEY) === "done";
  } catch {
    return false;
  }
}
function markSeen() {
  try {
    localStorage.setItem(TOUR_KEY, "done");
  } catch {
    /* storage blocked: the tour may show again next time */
  }
}

type Step = {
  /** `data-tour` value of the element the bubble points at. */
  target: string;
  title: string;
  body: string;
  /** The toolbar panel the step needs open. */
  panel?: TourPanel;
  /** Done by doing: the step moves on by itself once this is true. */
  done?: (s: Snapshot) => boolean;
  /** Set the scene up for the step (e.g. zoom in for the sensors). */
  enter?: () => void;
  last?: boolean;
};

const PAD = 8;
const GAP = 14;

type Box = { top: number; left: number; width: number; height: number };
type Side = "below" | "above" | "left" | "right" | "center";

/** The visible element for a `data-tour` value (the desktop and phone layouts can both have one). */
function findTarget(name: string): HTMLElement | null {
  const all = document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`);
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && el.style.visibility !== "hidden") return el;
  }
  return null;
}

/** Where the bubble goes: beside the target, wherever it fits, on screen. */
function place(t: Box | null, bw: number, bh: number, vw: number, vh: number): { side: Side; top: number; left: number; arrow: number } {
  if (!t) return { side: "center", top: Math.max(12, (vh - bh) / 2), left: (vw - bw) / 2, arrow: 0 };
  const cx = t.left + t.width / 2;
  const cy = t.top + t.height / 2;
  const fits = {
    below: t.top + t.height + GAP + bh <= vh - 8,
    above: t.top - GAP - bh >= 8,
    left: t.left - GAP - bw >= 8,
    right: t.left + t.width + GAP + bw <= vw - 8,
  };
  // Targets in the side panel read best with the bubble beside them.
  const order: Side[] = vw >= 1024 && cx > vw * 0.55 ? ["left", "below", "above"] : ["below", "above", "right", "left"];
  const side = order.find((s) => fits[s as keyof typeof fits]) ?? "below";
  const clampX = (x: number) => Math.min(Math.max(8, x), vw - bw - 8);
  const clampY = (y: number) => Math.min(Math.max(8, y), vh - bh - 8);
  if (side === "below" || side === "above") {
    const left = clampX(cx - bw / 2);
    const top = side === "below" ? t.top + t.height + GAP : t.top - GAP - bh;
    return { side, top: clampY(top), left, arrow: Math.min(Math.max(18, cx - left), bw - 18) };
  }
  const top = clampY(cy - bh / 2);
  const left = side === "left" ? t.left - GAP - bw : t.left + t.width + GAP;
  return { side, top, left: clampX(left), arrow: Math.min(Math.max(18, cy - top), bh - 18) };
}

/**
 * The guided tour: a spotlight on the real control and a bubble that points at it.
 * Doing the step's action moves on by itself (learn by doing); Next is always there too.
 * The page stays usable underneath: the dim layer doesn't catch clicks.
 */
export function Tour({
  d,
  sim,
  snap,
  farm,
  ctaHref,
  unit,
  onPanel,
  onClose,
  reduce,
}: {
  d: D;
  sim: FarmSim;
  snap: Snapshot;
  farm: string;
  ctaHref: string;
  /** "Floor 2", "Container 2"… for the selected unit. */
  unit: string;
  onPanel: (p: TourPanel) => void;
  onClose: () => void;
  reduce: boolean;
}) {
  const t = d.tour;
  const ty = d.types[snap.type];
  const steps: Step[] = [
    { target: "unit", title: ty.zoomTry, body: ty.tip, done: (s) => s.focus !== null },
    { target: "sensors", title: t.sensors.t, body: t.sensors.d, enter: () => sim.getSnapshot().focus === null && sim.setFocus(sim.getSnapshot().sel) },
    { target: "recipe", title: t.recipe.t, body: fmt(t.recipe.d, { unit }), panel: "floor", done: (s) => s.tried.recipe },
    { target: "impact", title: t.impact.t, body: t.impact.d, panel: "floor" },
    { target: "clock", title: t.clock.t, body: t.clock.d, panel: "clock", done: (s) => s.tried.clock },
    { target: "journey", title: t.journey.t, body: t.journey.d, panel: "journey", enter: () => sim.setFocus(null) },
    { target: "cta", title: t.done.t, body: fmt(t.done.d, { farm }), last: true },
  ];

  const [i, setI] = useState(0);
  const step = steps[i];
  const bubble = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [pos, setPos] = useState<ReturnType<typeof place> | null>(null);

  const finish = (how: "done" | "skip") => {
    markSeen();
    track("demo_tour", { stage: how, step: i + 1 });
    onClose();
  };
  const go = (n: number) => {
    if (n >= steps.length) return finish("done");
    setI(Math.max(0, n));
  };

  // Each step: open its panel, set the scene, bring the target on screen.
  useEffect(() => {
    if (i === 0) {
      sim.resetTried();
      track("demo_tour", { stage: "start", step: 1 });
    }
    if (step.panel) onPanel(step.panel);
    step.enter?.();
    const id = window.setTimeout(() => {
      const el = findTarget(step.target);
      const r = el?.getBoundingClientRect();
      if (el && r && (r.top < 70 || r.bottom > window.innerHeight - 90)) el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }, 120);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per step
  }, [i]);

  // Done by doing: move on shortly after the action, so its effect can be seen.
  const doneNow = step.done?.(snap) ?? false;
  useEffect(() => {
    if (!doneNow) return;
    const id = window.setTimeout(() => go(i + 1), 900);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- go is stable enough for one step
  }, [doneNow, i]);

  // Follow the target every frame: 3D labels move with the camera, panels scroll.
  useEffect(() => {
    let raf = 0;
    let last = "";
    const tick = () => {
      const el = findTarget(step.target);
      const r = el?.getBoundingClientRect();
      const next = r ? { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 } : null;
      const key = next ? `${next.top | 0},${next.left | 0},${next.width | 0},${next.height | 0}` : "none";
      if (key !== last) {
        last = key;
        setBox(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step.target]);

  useLayoutEffect(() => {
    const b = bubble.current;
    if (!b) return;
    setPos(place(box, b.offsetWidth, b.offsetHeight, window.innerWidth, window.innerHeight));
  }, [box, i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish("skip");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finish reads the current step
  }, [i]);

  const arrowStyle =
    pos && pos.side !== "center"
      ? pos.side === "below"
        ? { top: -6, left: pos.arrow - 6 }
        : pos.side === "above"
          ? { bottom: -6, left: pos.arrow - 6 }
          : pos.side === "left"
            ? { right: -6, top: pos.arrow - 6 }
            : { left: -6, top: pos.arrow - 6 }
      : null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" data-consent-wait>
      {/* Spotlight: everything but the target is dimmed. Clicks pass straight through. */}
      <motion.div
        aria-hidden
        className="absolute rounded-2xl ring-2 ring-[#7fe0a6]"
        initial={false}
        animate={
          box
            ? { top: box.top, left: box.left, width: box.width, height: box.height, opacity: 1 }
            : { top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0, opacity: 1 }
        }
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 36 }}
        style={{ boxShadow: "0 0 0 9999px rgba(11,18,34,0.42)" }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          ref={bubble}
          role="dialog"
          aria-modal="false"
          aria-labelledby="tour-title"
          aria-describedby="tour-body"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: pos ? 1 : 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ top: pos?.top ?? 0, left: pos?.left ?? 0 }}
          className="pointer-events-auto absolute w-[min(320px,calc(100vw-24px))] rounded-2xl bg-white p-4 shadow-[0_24px_60px_-20px_rgba(11,18,34,0.6)]"
        >
          {arrowStyle && <span aria-hidden className="absolute size-3 rotate-45 bg-white" style={arrowStyle} />}
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-sage px-2 py-0.5 font-mono text-[11px] font-semibold text-green-ink" dir="ltr">
              {fmt(t.step, { n: i + 1, t: steps.length })}
            </span>
            <button type="button" onClick={() => finish("skip")} aria-label={t.skip} className="grid size-7 place-items-center rounded-full text-muted hover:bg-[#eeede3] hover:text-ink">
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <h2 id="tour-title" className="mt-2 font-display text-[17px] leading-snug font-bold">
            {step.title}
          </h2>
          <p id="tour-body" className="mt-1 text-[14px] leading-relaxed text-muted" aria-live="polite">
            {step.body}
          </p>
          {step.done && !doneNow && <p className="mt-2 text-[12.5px] font-semibold text-green-ink">{t.doIt}</p>}
          <div className="mt-3.5 flex items-center justify-between gap-2">
            {step.last ? (
              <>
                <button type="button" onClick={() => finish("done")} className="rounded-xl px-3 py-2 text-[13.5px] font-semibold text-muted hover:text-ink">
                  {t.explore}
                </button>
                <Link
                  href={ctaHref}
                  onClick={() => finish("done")}
                  className="flex items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-[14px] font-bold text-forest transition-colors hover:bg-forest hover:text-white"
                >
                  {t.request}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </Link>
              </>
            ) : (
              <>
                <button type="button" onClick={() => (i === 0 ? finish("skip") : go(i - 1))} className="rounded-xl px-2 py-2 text-[13.5px] font-semibold text-muted hover:text-ink">
                  {i === 0 ? t.skip : t.back}
                </button>
                <button
                  type="button"
                  onClick={() => go(i + 1)}
                  className={cn("flex items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-[14px] font-bold text-forest transition-colors hover:bg-forest hover:text-white")}
                >
                  {t.next}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </button>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
