"use client";

import { motion } from "motion/react";
import { Leaf } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import type { HomeDraft } from "@/i18n/home-draft";
import { CountUp, EASE, Typewriter } from "@/components/motion/kit";
import { HeroTwin } from "@/components/landing/hero-twin";
import { NameForm } from "@/components/landing/name-form";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

/** The draft's hero, on the forest band: headline with the farm type in a lime badge, the name field, and the live farm. */
export function DraftHero({ lang, d, x }: { lang: Locale; d: Dict; x: HomeDraft }) {
  const h = d.hero;
  return (
    <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-6 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:pt-12 lg:pb-24">
      <div className="relative z-10 flex flex-col gap-6">
        <motion.p
          {...fade(0.05)}
          className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] py-1.5 ps-1.5 pe-3.5 text-[13px] font-medium text-white/85"
        >
          <span className="grid size-6 place-items-center rounded-full bg-lime text-forest">
            <Leaf className="size-3.5" aria-hidden />
          </span>
          {x.hero.eyebrow}
        </motion.p>
        <h1
          className="text-[42px] leading-[1.06] font-extrabold tracking-[-0.035em] text-white sm:text-[58px] lg:text-[66px]"
          aria-label={`${h.titleA} ${h.words[0]} ${h.titleB}`}
        >
          <motion.span {...fade(0.15)} className="block" aria-hidden>
            {h.titleA}
          </motion.span>
          <motion.span {...fade(0.3)} className="my-1 block" aria-hidden>
            <span className="inline-block rounded-[0.42em] bg-lime px-[0.28em] pb-[0.06em] text-forest sm:-rotate-1">
              <Typewriter words={h.words} mode={lang === "ar" ? "word" : "letters"} />
            </span>
          </motion.span>
          <motion.span {...fade(0.45)} className="block" aria-hidden>
            {h.titleB}
          </motion.span>
        </h1>
        <motion.p {...fade(0.6)} className="max-w-[46ch] text-[17px] leading-relaxed text-white/70">
          {h.sub}
        </motion.p>
        <motion.div {...fade(0.75)}>
          <NameForm lang={lang} tone="forest" label={h.inputLabel} placeholder={h.placeholder} button={h.open} error={h.nameError} note={h.note} sample={h.sample} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
        className="relative h-[340px] sm:h-[440px] lg:h-[540px]"
      >
        <div aria-hidden className="absolute -inset-6 rounded-[48px] bg-[radial-gradient(closest-side,rgba(198,240,77,0.22),transparent)] blur-2xl" />
        <Link
          href={`/${lang}/demo`}
          aria-label={d.cursor.explore}
          className="absolute inset-0 block overflow-hidden rounded-[32px] border border-white/15 bg-[#e8eef4] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)]"
        >
          <HeroTwin />
        </Link>
        <span className="pointer-events-none absolute start-4 top-4 flex items-center gap-2 rounded-full bg-forest/90 py-1.5 ps-2.5 pe-3 text-[12.5px] font-semibold text-white backdrop-blur sm:start-5 sm:top-5">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-lime opacity-70 motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-lime" />
          </span>
          {x.hero.live}
          <span className="hidden font-normal text-white/60 sm:inline">· {x.hero.liveNote}</span>
        </span>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.2 }}
          className="pointer-events-none absolute -bottom-5 start-4 rounded-2xl bg-white px-4 py-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] sm:start-8"
        >
          <div className="text-[11.5px] text-[#55635a]">{h.stat1}</div>
          <div className="text-[14px] font-bold text-forest">{h.stat1v}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.4 }}
          className="pointer-events-none absolute end-4 -bottom-5 rounded-2xl bg-lime px-4 py-3 text-forest shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] sm:end-8"
        >
          <div className="text-[11.5px] font-medium opacity-75">{h.stat2}</div>
          <div className="text-[14px] font-bold">
            <CountUp to={64} suffix="%" /> {h.stat2v.replace(/^\s*64%\s*/, "")}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
