"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMedia } from "@/lib/use-media";

type Mode = "default" | "link" | "cta" | "label" | "text" | "hidden";

/**
 * Custom cursor: a precise dot plus a ring that trails behind it.
 * Elements opt into richer states with data attributes:
 *   data-cursor="cta"                       big green ring with an arrow and label
 *   data-cursor="label" data-cursor-label=  ring with a word inside (e.g. over the 3D farm)
 * Links, buttons and fields get sensible states automatically.
 * Only on devices with a precise pointer, and never with reduced motion.
 */
export function Cursor() {
  const fine = useMedia("(pointer: fine)");
  const reduce = useReducedMotion();
  const on = fine === true && !reduce;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const [mode, setMode] = useState<Mode>("hidden");
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!on) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    let last = { x: -100, y: -100 };
    const classify = (t: Element | null) => {
      const tagged = t?.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        setMode(tagged.dataset.cursor as Mode);
        setLabel(tagged.dataset.cursorLabel ?? "");
      } else if (t?.closest("input:not([type=range]):not([type=checkbox]), textarea")) {
        setMode("text");
      } else if (t?.closest("a, button, summary, label, [role=button], input")) {
        setMode("link");
      } else setMode("default");
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = { x: e.clientX, y: e.clientY };
      x.set(e.clientX);
      y.set(e.clientY);
      classify(e.target as Element | null);
    };
    // Content moves under a still mouse while scrolling: re-check what the cursor is over.
    const scroll = () => {
      if (last.x >= 0) classify(document.elementFromPoint(last.x, last.y));
    };
    window.addEventListener("scroll", scroll, { passive: true });
    const leave = () => setMode("hidden");
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [on, x, y]);

  if (!on) return null;

  const ring = {
    default: { size: 34, bg: "rgba(46,158,91,0)", border: "rgba(20,27,43,0.35)" },
    link: { size: 54, bg: "rgba(46,158,91,0.14)", border: "rgba(46,158,91,0.6)" },
    cta: { size: 64, bg: "rgba(46,158,91,0.16)", border: "rgba(46,158,91,0.9)" },
    label: { size: 92, bg: "rgba(20,27,43,0.9)", border: "rgba(20,27,43,0.9)" },
    text: { size: 6, bg: "rgba(46,158,91,0)", border: "rgba(46,158,91,0)" },
    hidden: { size: 0, bg: "rgba(0,0,0,0)", border: "rgba(0,0,0,0)" },
  }[mode];
  const big = mode === "label";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div style={{ x: rx, y: ry }} className="absolute top-0 left-0">
        <motion.div
          className="relative grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-white"
          animate={{
            width: ring.size,
            height: ring.size,
            backgroundColor: ring.bg,
            borderColor: ring.border,
            scale: down ? 0.86 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          <AnimatePresence>
            {big && (
              <motion.span
                key={mode + label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="flex items-center gap-0.5 text-[12px] font-semibold"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
          {mode === "cta" && <ArrowUpRight className="absolute -end-1 -top-1 size-4 rounded-full bg-leaf p-0.5 text-white rtl:-scale-x-100" />}
        </motion.div>
      </motion.div>
      <motion.div style={{ x, y }} className="absolute top-0 left-0">
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-leaf"
          animate={{ width: big || mode === "hidden" ? 0 : mode === "text" ? 3 : 7, height: big || mode === "hidden" ? 0 : mode === "text" ? 22 : 7, borderRadius: mode === "text" ? 2 : 999 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </div>
  );
}
