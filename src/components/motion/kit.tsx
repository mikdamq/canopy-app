"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------- Reveal ------------------------------- */

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" } & Omit<HTMLMotionProps<"div">, "children">) {
  const Comp = (as === "li" ? motion.li : motion.div) as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* ----------------------------- Word reveal ---------------------------- */

/**
 * Headline that rises in word by word. Works in Arabic because words are never
 * split into letters, so the joins between letters stay intact.
 */
export function WordReveal({
  text,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.045,
  immediate = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of on scroll (for the hero). */
  immediate?: boolean;
}) {
  const Tag = as as "h2";
  const words = text.split(" ");
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <Tag className={className} aria-label={text}>
      <motion.span initial="hide" {...trigger} transition={{ staggerChildren: stagger, delayChildren: delay }} aria-hidden className="inline">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top -mb-[0.12em]">
            <motion.span
              className="inline-block"
              variants={{ hide: { y: "105%" }, show: { y: "0%" } }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ------------------------------ Typewriter ----------------------------- */

/**
 * Cycles through phrases. Latin text is typed and erased letter by letter;
 * Arabic (`mode="word"`) swaps whole phrases so letters always stay joined.
 */
export function Typewriter({
  words,
  mode = "letters",
  className,
  hold = 1900,
}: {
  words: string[];
  mode?: "letters" | "word";
  className?: string;
  hold?: number;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [n, setN] = useState(words[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (mode === "word") {
      const t = setTimeout(() => setI((v) => (v + 1) % words.length), hold + 600);
      return () => clearTimeout(t);
    }
    const word = words[i];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && n === word.length) t = setTimeout(() => setDeleting(true), hold);
    else if (deleting && n === 0) {
      t = setTimeout(() => {
        setDeleting(false);
        setI((v) => (v + 1) % words.length);
      }, 260);
    } else t = setTimeout(() => setN((v) => v + (deleting ? -1 : 1)), deleting ? 32 : 68);
    return () => clearTimeout(t);
  }, [i, n, deleting, words, mode, hold, reduce]);

  if (mode === "word") {
    return (
      <span className={cn("relative inline-grid", className)} aria-live="polite">
        {/* Widest phrase reserves the space so the layout never jumps. */}
        {words.map((w, k) => (
          <motion.span
            key={k}
            className="col-start-1 row-start-1"
            initial={false}
            animate={k === i ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: k === (i + words.length - 1) % words.length ? -18 : 18, filter: "blur(6px)" }}
            transition={{ duration: 0.6, ease: EASE }}
            aria-hidden={k !== i}
          >
            {w}
          </motion.span>
        ))}
      </span>
    );
  }
  return (
    <span className={className} aria-label={words[i]}>
      <span aria-hidden>{words[i].slice(0, n)}</span>
      <span aria-hidden className="ms-[0.04em] inline-block h-[0.82em] w-[0.08em] translate-y-[0.06em] animate-[caret_1s_steps(1)_infinite] bg-current align-baseline" />
    </span>
  );
}

/* ------------------------------- Count up ------------------------------ */

/** Counts from 0 to `to` the first time it becomes visible. */
export function CountUp({ to, suffix = "", decimals = 0, className }: { to: number; suffix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = to.toFixed(decimals) + suffix;
      return;
    }
    const c = animate(0, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => c.stop();
  }, [inView, to, suffix, decimals, reduce]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {to.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ------------------------------- Magnetic ------------------------------ */

/** Pulls its child gently toward the pointer (mouse only). */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={cn("inline-block", className)}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ Spotlight ------------------------------ */

/** Card with a soft glow that follows the pointer. */
export function Spotlight({ children, className, glow = "rgba(46,158,91,0.14)" }: { children: ReactNode; className?: string; glow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn("group/spot relative isolate overflow-hidden", className)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 60%)` }}
      />
      {children}
    </div>
  );
}

/* ---------------------------- Scroll progress --------------------------- */

/** Thin bar along the top that fills as the page is read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-green rtl:origin-right"
    />
  );
}
