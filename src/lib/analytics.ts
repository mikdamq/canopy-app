/**
 * Funnel analytics. Umami counts page views on its own (that's the "landing" step);
 * these are the custom steps after it. Every event also goes to Google Analytics 4 and
 * Clarity, but those two only load after the visitor clicks "Allow". Everything is a
 * no-op until the IDs are set, so nothing breaks in development.
 */
export type FunnelEvent = "demo_opened" | "demo_interaction" | "request_details" | "demo_tour" | "request_error" | "request_sent" | "whatsapp_click";
type Data = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Data) => void };
    clarity?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "";
export const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
/** Tools that set cookies, so the visitor is asked first. */
export const NEEDS_CONSENT = Boolean(CLARITY_ID || GA_ID);

/**
 * Umami calls this before sending anything. It drops the farm name (?farm=) from the
 * address but keeps campaign tags (utm_source and friends) so outreach can be measured.
 */
export function stripFarm<T extends { url?: string }>(_type: string, payload: T): T {
  if (!payload?.url) return payload;
  try {
    const u = new URL(payload.url, window.location.origin);
    u.searchParams.delete("farm");
    const absolute = /^https?:/.test(payload.url);
    return { ...payload, url: absolute ? u.href : u.pathname + u.search };
  } catch {
    return payload;
  }
}

// Events fired before the Umami script has loaded wait here and are sent on load.
const pending: [FunnelEvent, Data | undefined][] = [];

export function track(event: FunnelEvent, data?: Data) {
  if (typeof window === "undefined") return;
  if (window.umami) window.umami.track(event, data);
  else if (UMAMI_ID) pending.push([event, data]);
  window.clarity?.("event", event);
  if (window.gtag) {
    // GA4 reports read `farm_type`; Umami keeps the shorter `type`.
    const { type, ...rest } = data ?? {};
    const params = type === undefined ? rest : { ...rest, farm_type: type };
    window.gtag("event", event, params);
    // Google's standard name for a lead, so GA4 can count it as a key event.
    if (event === "request_sent") window.gtag("event", "generate_lead", params);
  }
}

/** The address without the farm name (?farm=), for page views sent to GA4. */
export function cleanLocation() {
  const u = new URL(window.location.href);
  u.searchParams.delete("farm");
  return u.href;
}

/** A farm's area as a band, so reports never carry the exact figure. */
export function sizeBand(m2?: number) {
  if (!m2) return undefined;
  if (m2 < 100) return "under 100";
  if (m2 < 500) return "100-500";
  if (m2 < 2000) return "500-2000";
  return "over 2000";
}

/** Removes Google Analytics cookies (_ga, _ga_…) when the visitor withdraws consent. */
export function clearGaCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

export function flushPending() {
  while (window.umami && pending.length) {
    const [event, data] = pending.shift()!;
    window.umami.track(event, data);
  }
}

/* Consent for Clarity and GA4 (the parts that set cookies). Stored in this browser only. */
export type Consent = "granted" | "denied";
const KEY = "canopy-consent";
export const CONSENT_OPEN_EVENT = "canopy:consent-open";

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

const CHANGE_EVENT = "canopy:consent-change";
let memory: Consent | null = null; // used when storage is blocked (some private modes)

export function saveConsent(v: Consent) {
  memory = v;
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* the choice just lasts for this page */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** For useSyncExternalStore: follows changes from this tab and from other tabs. */
export function subscribeConsent(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export const consentSnapshot = () => readConsent() ?? memory;
