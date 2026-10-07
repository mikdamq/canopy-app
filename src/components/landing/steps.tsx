"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { EASE } from "@/components/motion/kit";

/** "How it works": a line draws across the three steps as you scroll, and each step lights up as the line reaches it. */
export function Steps({ steps }: { steps: { t: string; d: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <ol ref={ref} className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
      <span aria-hidden className="absolute inset-x-0 top-0 hidden h-0.5 bg-line md:block" />
      <motion.span
        aria-hidden
        style={{ scaleX }}
        className="absolute inset-x-0 top-0 hidden h-0.5 origin-left bg-ink md:block rtl:origin-right"
      />
      {steps.map((s, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.8, ease: EASE, delay: i * 0.15 }}
          className="relative flex flex-col gap-3 border-t-2 border-ink pt-6 md:border-t-0"
        >
          <span className="absolute -top-[7px] start-0 hidden size-3.5 rounded-full border-2 border-ink bg-bg md:block" aria-hidden />
          <span className="font-mono text-[13px] text-muted">0{i + 1}</span>
          <h3 className="font-display text-[22px] font-bold">{s.t}</h3>
          <p className="max-w-[38ch] text-[15.5px] leading-relaxed text-muted">{s.d}</p>
        </motion.li>
      ))}
    </ol>
  );
}
