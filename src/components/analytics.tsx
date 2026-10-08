"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import {
  CLARITY_ID,
  CONSENT_OPEN_EVENT,
  UMAMI_ID,
  UMAMI_SRC,
  consentSnapshot,
  flushPending,
  stripFarm,
  saveConsent,
  subscribeConsent,
  type Consent,
} from "@/lib/analytics";
import { SITE_URL } from "@/lib/site";

// Umami looks this hook up by name on window when it loads.
if (typeof window !== "undefined") (window as unknown as Record<string, unknown>).canopyBeforeSend = stripFarm;

/**
 * Umami (no cookies) always runs once its ID is set. Microsoft Clarity sets cookies,
 * so it only loads after the visitor clicks "Allow" in the consent prompt.
 */
export function Analytics({ lang, d }: { lang: Locale; d: Dict["consent"] }) {
  // undefined = not read yet (server render), null = not asked yet.
  const consent = useSyncExternalStore(subscribeConsent, consentSnapshot, () => undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!CLARITY_ID) return;
    // Let the page settle before asking.
    const t = consentSnapshot() === null ? window.setTimeout(() => setOpen(true), 2500) : undefined;
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  const choose = (v: Consent) => {
    const withdrawing = v === "denied" && consent === "granted";
    saveConsent(v);
    setOpen(false);
    if (withdrawing) {
      // Clarity erases its cookies, then a reload makes sure its script is gone.
      window.clarity?.("consent", false);
      window.location.reload();
    }
  };

  const host = SITE_URL ? new URL(SITE_URL).hostname : "";

  return (
    <>
      {UMAMI_ID && (
        <Script
          src={UMAMI_SRC}
          data-website-id={UMAMI_ID}
          // Drops ?farm= from addresses, keeps utm_ tags (see stripFarm).
          data-before-send="canopyBeforeSend"
          {...(host ? { "data-domains": host } : {})}
          strategy="afterInteractive"
          onLoad={flushPending}
        />
      )}

      {CLARITY_ID && consent === "granted" && (
        <Script
          id="clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(CLARITY_ID)});window.clarity("consent");`,
          }}
        />
      )}

      {CLARITY_ID && (
        <MotionConfig reducedMotion="user">
          <AnimatePresence>
            {open && (
              <motion.div
                role="dialog"
                aria-live="polite"
                aria-label={d.more}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="consent-card fixed inset-x-3 bottom-3 z-[60] rounded-2xl border border-line bg-white/95 p-4 shadow-[0_24px_60px_-28px_rgba(20,27,43,0.55)] backdrop-blur sm:inset-x-auto sm:start-4 sm:bottom-4 sm:w-[380px]"
              >
                <p className="text-[13.5px] leading-relaxed text-ink">
                  {d.text}{" "}
                  <Link href={`/${lang}/privacy`} className="font-semibold text-green-ink underline underline-offset-4">
                    {d.more}
                  </Link>
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => choose("granted")}
                    className="rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#263049]"
                  >
                    {d.accept}
                  </button>
                  <button
                    type="button"
                    onClick={() => choose("denied")}
                    className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold transition-colors hover:border-ink"
                  >
                    {d.decline}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </MotionConfig>
      )}
    </>
  );
}

/** Footer link that brings the consent prompt back. Hidden when Clarity isn't set up. */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  if (!CLARITY_ID) return null;
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>
      {label}
    </button>
  );
}
