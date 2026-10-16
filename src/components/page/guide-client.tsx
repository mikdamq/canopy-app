"use client";

import { List, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** A thin bar at the top of the window that fills as the reader moves through the article. */
export function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.getElementById(target);
      if (!el || !bar.current) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const done = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.current.style.transform = `scaleX(${done})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-leaf rtl:origin-right" />
    </div>
  );
}

/**
 * "On this page": a floating button that opens the list of sections. Closes on a choice,
 * on Escape, or on a click outside; focus goes back to the button.
 */
export function TocButton({ label, closeLabel, items }: { label: string; closeLabel: string; items: { id: string; h: string }[] }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className="fixed end-4 bottom-4 z-[55] flex flex-col items-end gap-2 sm:end-6 sm:bottom-6">
      {open && (
        <div
          ref={panel}
          id="toc-panel"
          className="max-h-[60vh] w-[min(320px,calc(100vw-2rem))] overflow-auto rounded-2xl border border-line bg-white p-2 shadow-[0_24px_60px_-28px_rgba(20,27,43,0.55)]"
        >
          <p className="px-3 pt-2 pb-1 text-[12px] font-semibold tracking-wide text-muted uppercase rtl:tracking-normal">{label}</p>
          <ol className="flex flex-col">
            {items.map((it, i) => (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 rounded-xl px-3 py-2 text-[14.5px] leading-snug hover:bg-[#eaf5ee] focus-visible:bg-[#eaf5ee]"
                >
                  <span className="font-mono text-[12px] text-green" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {it.h}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls="toc-panel"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(20,27,43,0.6)] transition-colors hover:bg-[#263049]"
      >
        {open ? <X className="size-4" aria-hidden /> : <List className="size-4" aria-hidden />}
        {open ? closeLabel : label}
      </button>
    </div>
  );
}
