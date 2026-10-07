"use client";

import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { fmt } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { useMedia } from "@/lib/use-media";
import { cn } from "@/lib/utils";
import { EASE, WordReveal } from "@/components/motion/kit";
import { FarmSim } from "@/components/twin/sim";

const FarmCanvas = dynamic(() => import("@/components/twin/scene"), { ssr: false });

/** What the live farm does for each feature step. */
function stage(sim: FarmSim, step: number) {
  sim.setPlaying(true);
  if (step === 0) {
    sim.setHour(13.5);
    sim.setFocus(2);
  } else if (step === 1) {
    sim.setFocus(null);
    sim.setHour(21.5);
    sim.setSpectrum(0, "white");
    sim.setSpectrum(1, "pink");
    sim.setSpectrum(2, "blue");
    sim.setSpectrum(3, "pink");
  } else if (step === 2) {
    sim.setFocus(null);
    sim.setHour(14);
    const k = sim.floors.findIndex((_, i) => sim.canHarvest(i));
    if (k >= 0) sim.harvest(k);
  } else {
    sim.setFocus(null);
    sim.setHour(18.2);
  }
}

function StepBar({ progress, i, n }: { progress: MotionValue<number>; i: number; n: number }) {
  const w = useTransform(progress, [i / n, (i + 1) / n], ["0%", "100%"]);
  return (
    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-line">
      <motion.span style={{ width: w }} className="absolute inset-y-0 start-0 bg-green" />
    </span>
  );
}

/**
 * Pinned section: the farm stays on screen while the visitor scrolls through
 * the features, and each one changes what the farm is doing.
 * Phones get the plain card grid passed in as `fallback`.
 */
export function FeatureTour({ d, fallback }: { d: Dict["features"]; fallback: ReactNode }) {
  const wide = useMedia("(min-width: 1024px)");
  return wide ? <PinnedTour d={d} /> : <>{fallback}</>;
}

function PinnedTour({ d }: { d: Dict["features"] }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const near = useInView(ref, { margin: "60% 0px 60% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = d.items.length;
  const [step, setStep] = useState(0);
  const [sim] = useState(() => new FarmSim());

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const s = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    if (s !== step) setStep(s);
  });
  useEffect(() => stage(sim, step), [sim, step]);

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + run * ((i + 0.5) / n), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="features" ref={ref} className="relative scroll-mt-0 bg-white" style={{ height: `${n * 90 + 60}svh` }}>
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="font-mono text-[12px] tracking-[0.12em] text-green uppercase">{d.eyebrow}</p>
              <WordReveal text={d.title} className="max-w-[18ch] font-display text-[40px] leading-[1.05] font-bold tracking-[-0.02em]" />
            </div>
            <ol className="flex flex-col">
              {d.items.map((f, i) => {
                const active = i === step;
                return (
                  <li key={i} className="relative">
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-current={active ? "step" : undefined}
                      className="flex w-full flex-col gap-1.5 py-4 text-start"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className={cn("font-mono text-[12px] transition-colors", active ? "text-green" : "text-[#9aa6ba]")}>0{i + 1}</span>
                        <span className={cn("font-display text-[21px] font-bold transition-colors", active ? "text-ink" : "text-[#9aa6ba]")}>{f.t}</span>
                      </span>
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.span
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="block overflow-hidden ps-8 text-[15px] leading-relaxed text-muted"
                          >
                            {f.d}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    <StepBar progress={scrollYProgress} i={i} n={n} />
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="relative h-[min(72svh,620px)]">
            <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-line bg-[#e8eef4] shadow-[0_40px_80px_-50px_rgba(20,27,43,0.6)]">
              {near && <FarmCanvas sim={sim} reduce={reduce} compact={false} hero />}
            </div>
            <div className="absolute start-5 top-5 flex items-center gap-2">
              <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] text-white">{fmt(d.step, { n: step + 1, t: n })}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="rounded-full border border-line bg-white/95 px-3 py-1 text-[12.5px] font-semibold shadow-sm"
                >
                  {d.captions[step]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
