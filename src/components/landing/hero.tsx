"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { CountUp, EASE, Typewriter, WordReveal } from "@/components/motion/kit";
import { HeroTwin } from "./hero-twin";
import { NameForm } from "./name-form";

/** Headline, typewriter and the farm-name field, with a staged entrance. */
export function Hero({ lang, d, cursor }: { lang: Locale; d: Dict["hero"]; cursor: Dict["cursor"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // As the hero scrolls away, the farm card settles back and tilts like a screen being put down.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <div ref={ref} className="mx-auto grid w-full max-w-6xl items-center gap-6 px-4 pt-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:pt-10 lg:pb-24">
      <motion.div style={reduce ? undefined : { y: copyY }} className="relative z-10 flex flex-col gap-6">
        <motion.p {...fade(0.05)} className="font-mono text-[12px] tracking-[0.12em] text-green uppercase">
          {d.eyebrow}
        </motion.p>
        <h1 className="font-display text-[44px] leading-[1.02] font-extrabold tracking-[-0.03em] sm:text-[60px] lg:text-[68px]" aria-label={`${d.titleA} ${d.words[0]} ${d.titleB}`}>
          <WordReveal as="span" text={d.titleA} immediate delay={0.15} className="block" />
          <motion.span {...fade(0.45)} className="block text-green" aria-hidden>
            <Typewriter words={d.words} mode={lang === "ar" ? "word" : "letters"} />
          </motion.span>
          <WordReveal as="span" text={d.titleB} immediate delay={0.55} className="block" />
        </h1>
        <motion.p {...fade(0.75)} className="max-w-[48ch] text-[17px] leading-relaxed text-muted">
          {d.sub}
        </motion.p>
        <motion.div {...fade(0.9)}>
          <NameForm lang={lang} label={d.inputLabel} placeholder={d.placeholder} button={d.open} error={d.nameError} note={d.note} sample={d.sample} />
        </motion.div>
      </motion.div>

      <div className="relative h-[340px] [perspective:1400px] sm:h-[440px] lg:h-[560px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
          className="absolute inset-0"
        >
          <motion.div style={reduce ? undefined : { scale, rotateX, y }} className="absolute inset-0 origin-top">
            <Link
              href={`/${lang}/demo`}
              data-cursor="label"
              data-cursor-label={cursor.explore}
              aria-label={cursor.explore}
              className="absolute inset-0 block overflow-hidden rounded-[28px] border border-white/70 bg-[#e8eef4] shadow-[0_40px_80px_-50px_rgba(20,27,43,0.6)]"
            >
              <HeroTwin />
            </Link>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
              className="pointer-events-none absolute start-3 top-3 rounded-2xl border border-line bg-white/95 px-3 py-2 shadow-sm sm:start-5 sm:top-5"
            >
              <div className="text-[11px] text-muted">{d.stat1}</div>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#8a5300]">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#f5a524] opacity-60" />
                  <span className="relative size-2 rounded-full bg-[#f5a524]" />
                </span>
                {d.stat1v}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 1.3 }}
              className="pointer-events-none absolute end-3 bottom-3 rounded-2xl border border-line bg-white/95 px-3 py-2 shadow-sm sm:end-5 sm:bottom-5"
            >
              <div className="text-[11px] text-muted">{d.stat2}</div>
              <div className="text-[13px] font-semibold text-green-ink">
                <CountUp to={64} suffix="%" /> {d.stat2v.replace(/^\s*64%\s*/, "")}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="pointer-events-none hidden items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase lg:col-span-2 lg:flex"
        aria-hidden
      >
        <span className="relative h-8 w-[18px] rounded-full border border-[#9aa6ba]">
          <motion.span
            className="absolute start-1/2 top-1.5 size-1 -translate-x-1/2 rounded-full bg-ink rtl:translate-x-1/2"
            animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        {d.scroll}
      </motion.div>
    </div>
  );
}
