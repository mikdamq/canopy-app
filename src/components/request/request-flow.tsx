"use client";

import { CalendarCheck, Check, ChevronDown, Loader2, Mail, Plus } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { fmt, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import {
  CROPS,
  FARM_TYPES,
  FORM_FIELDS,
  GOALS,
  MONITORING,
  ROLES,
  detailsSchema,
  hasDetails,
  requestSchema,
  type FieldName,
} from "@/lib/request-schema";
import { isFarmType } from "@/components/twin/layouts";
import { WhatsAppIcon, WhatsAppLink } from "@/components/ui/whatsapp-link";
import { COUNTRIES, countryByName, withCountryCode } from "@/lib/countries";
import { WHATSAPP_NUMBER, whatsappUrl } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type R = Dict["request"];

type Form = {
  farmName: string;
  farmType: (typeof FARM_TYPES)[number] | "";
  name: string;
  email: string;
  phone: string;
  country: string;
  consent: boolean;
  website: string;
};

/** The optional "Tell us more" answers, as typed. */
type Details = {
  role: (typeof ROLES)[number] | "";
  areaM2: string;
  levels: string;
  crops: (typeof CROPS)[number][];
  cropsOther: string;
  monitoring: (typeof MONITORING)[number] | "";
  sensorBrand: string;
  goals: (typeof GOALS)[number][];
  message: string;
};

const ERROR_KEY: Record<FieldName, keyof R["errors"]> = {
  farmName: "required",
  farmType: "required",
  name: "required",
  email: "email",
  phone: "phone",
  country: "required",
  consent: "consent",
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------ Field parts ------------------------------ */

function Field({ label, error, hint, children, htmlFor }: { label: string; error?: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13.5px] font-semibold">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[12px] text-muted">{hint}</p>}
      {error && (
        <p className="text-[12.5px] font-medium text-[#c2323a]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (bad?: boolean) =>
  cn(
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] outline-none transition-colors placeholder:text-[#6b7689] focus:border-green",
    bad ? "border-[#e5484d]" : "border-line",
  );

function Chips<T extends string>({
  options,
  labels,
  value,
  onChange,
  multi = false,
  label,
}: {
  options: readonly T[];
  labels: readonly string[] | Record<T, string>;
  value: T | T[] | "";
  onChange: (v: T | T[]) => void;
  multi?: boolean;
  label: string;
}) {
  const text = (o: T, i: number) => (Array.isArray(labels) ? labels[i] : (labels as Record<T, string>)[o]);
  const on = (o: T) => (multi ? (value as T[]).includes(o) : value === o);
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          aria-pressed={on(o)}
          onClick={() => {
            if (!multi) return onChange(o);
            const cur = value as T[];
            onChange(cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o]);
          }}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13.5px] font-medium transition-colors",
            on(o) ? "border-green bg-[#eaf6ef] text-green-ink" : "border-line bg-white hover:border-[#8c97ab]",
          )}
        >
          {multi && on(o) && <Check className="size-3.5" aria-hidden />}
          {text(o, i)}
        </button>
      ))}
    </div>
  );
}

/* --------------------------------- Flow --------------------------------- */

const DRAFT_KEY = "canopy-request-draft";
const DRAFT_FIELDS = ["farmName", "farmType", "name", "email", "phone", "country"] as const;
type Draft = Partial<Pick<Form, (typeof DRAFT_FIELDS)[number]>>;

function readDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    // Keep only today's fields (an older, longer draft may still be stored).
    const all = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(DRAFT_FIELDS.filter((k) => typeof all[k] === "string").map((k) => [k, all[k]])) as Draft;
  } catch {
    return null;
  }
}
function writeDraft(f: Form) {
  try {
    // Consent and the spam trap are never kept.
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(Object.fromEntries(DRAFT_FIELDS.map((k) => [k, f[k]]))));
  } catch {
    /* storage blocked: the draft just isn't kept */
  }
}
function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* nothing to clear */
  }
}

const NO_DETAILS: Details = {
  role: "",
  areaM2: "",
  levels: "",
  crops: [],
  cropsOther: "",
  monitoring: "",
  sensorBrand: "",
  goals: [],
  message: "",
};

export default function RequestFlow({
  lang,
  r,
  wa,
  farm,
  farmType = "",
  source,
  bookingUrl,
  contactEmail,
}: {
  lang: Locale;
  r: R;
  wa: Dict["whatsapp"];
  farm: string;
  /** The farm type picked in the demo, to start the form with. */
  farmType?: Form["farmType"];
  source: string;
  bookingUrl: string;
  contactEmail: string;
}) {
  const uid = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "done">("idle");
  const [emailed, setEmailed] = useState(false);
  const [otherCountry, setOtherCountry] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const swapped = useRef(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [f, setF] = useState<Form>({
    farmName: farm,
    farmType,
    name: "",
    email: "",
    phone: "",
    country: "",
    consent: false,
    website: "",
  });
  // "Tell us more", after sending: the pass from the server ties the answers to this request.
  const [pass, setPass] = useState("");
  const [x, setX] = useState<Details>(NO_DETAILS);
  const [xOpen, setXOpen] = useState(false);
  const [xStatus, setXStatus] = useState<"idle" | "sending" | "error" | "done">("idle");
  const [xErrors, setXErrors] = useState<{ areaM2?: string; levels?: string }>({});

  // Keep a draft in this tab, so leaving the page by accident doesn't lose what was typed.
  useEffect(() => {
    const draft = readDraft();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from sessionStorage after hydration
    if (draft) setF((p) => ({ ...p, ...draft, farmName: draft.farmName || p.farmName, farmType: draft.farmType || p.farmType }));
  }, []);
  useEffect(() => {
    if (status !== "done") writeDraft(f);
  }, [f, status]);

  // The browser's scroll anchoring fights the swap to the thank-you screen, so switch it off here.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflowAnchor;
    root.style.overflowAnchor = "none";
    return () => {
      root.style.overflowAnchor = prev;
    };
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (k in ERROR_KEY) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const setD = <K extends keyof Details>(k: K, v: Details[K]) => {
    setX((p) => ({ ...p, [k]: v }));
    if (k === "areaM2" || k === "levels") setXErrors((e) => ({ ...e, [k]: undefined }));
  };

  // A local phone number gets the country's code (0791… → +962791…).
  const payload = () => ({ ...f, phone: withCountryCode(f.phone, f.country), locale: lang, source });

  /** Check the form; on a problem, show it and move focus to the first one. */
  const check = () => {
    const res = requestSchema.safeParse(payload());
    if (res.success) return true;
    const next: Partial<Record<FieldName, string>> = {};
    for (const issue of res.error.issues) {
      const k = issue.path[0] as FieldName;
      if (k in ERROR_KEY && !next[k]) next[k] = r.errors[ERROR_KEY[k]];
    }
    setErrors(next);
    const first = FORM_FIELDS.find((k) => next[k]);
    if (first) {
      track("request_error", { field: first, lang });
      document.getElementById(`${uid}-${first}`)?.focus();
    }
    return false;
  };

  // Bring the card (not the page top) into view once the thank-you screen has appeared.
  const scrollToCard = () => {
    const card = cardRef.current;
    if (!card) return;
    // Land just below the fixed site header.
    const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    const top = card.getBoundingClientRect().top + window.scrollY - header - 16;
    if (Math.abs(top - window.scrollY) < 8) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: smooth ? "smooth" : "auto" });
  };

  const submit = async () => {
    if (!check()) return;
    setStatus("sending");
    try {
      const body = payload();
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(String(res.status));
      const out = (await res.json().catch(() => ({}))) as { emailed?: boolean; details?: string };
      setF((p) => ({ ...p, phone: body.phone }));
      setEmailed(out.emailed === true);
      setPass(out.details ?? "");
      track("request_sent", { source, lang });
      clearDraft();
      swapped.current = true;
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const sendDetails = async () => {
    const parsed = detailsSchema.safeParse({ ...x, role: x.role || undefined, monitoring: x.monitoring || undefined });
    if (!parsed.success) {
      const bad = new Set(parsed.error.issues.map((i) => i.path[0]));
      setXErrors({ areaM2: bad.has("areaM2") ? r.errors.number : undefined, levels: bad.has("levels") ? r.errors.number : undefined });
      document.getElementById(`${uid}-${bad.has("areaM2") ? "areaM2" : "levels"}`)?.focus();
      return;
    }
    if (!hasDetails(parsed.data)) return setXOpen(false);
    setXStatus("sending");
    try {
      const { consent: _c, website: _w, ...request } = payload();
      void _c;
      void _w;
      const res = await fetch("/api/requests/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: pass, details: parsed.data, request }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("request_details", { stage: "sent", lang });
      setXStatus("done");
    } catch {
      setXStatus("error");
    }
  };

  const id = (k: string) => `${uid}-${k}`;
  const firstName = f.name.trim().split(/\s+/)[0] ?? "";
  const bookingHref = bookingUrl
    ? `${bookingUrl}${bookingUrl.includes("?") ? "&" : "?"}name=${encodeURIComponent(f.name)}&email=${encodeURIComponent(f.email)}`
    : "";
  const shownFarm = f.farmName.trim() || farm;
  // The country list shows a known country, "other" (with a text box), or nothing yet.
  const countryPick = otherCountry || (f.country && !countryByName(f.country)) ? "other" : f.country;
  const sent = status === "done";
  // Once sent, the language switch leads to the homepage, not back to an empty form.
  useEffect(() => {
    if (!sent) return;
    const root = document.documentElement;
    root.dataset.requestSent = "1";
    return () => {
      delete root.dataset.requestSent;
    };
  }, [sent]);
  const demoQuery = new URLSearchParams();
  if (f.farmName) demoQuery.set("farm", f.farmName);
  if (f.farmType && isFarmType(f.farmType) && f.farmType !== "tower") demoQuery.set("type", f.farmType);
  const demoHref = `/${lang}/demo${demoQuery.size ? `?${demoQuery}` : ""}`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] lg:gap-14">
        {/* Intro and progress */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[12px] tracking-[0.1em] text-green uppercase">{r.eyebrow}</p>
            <h1 className="font-display text-[34px] leading-[1.05] font-bold tracking-[-0.02em] text-balance sm:text-[44px]">
              {sent ? fmt(r.doneHeading, { name: firstName }) : r.title}
            </h1>
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-muted">{sent ? r.doneSub : r.sub}</p>
          </div>
          <ol className="flex flex-col gap-1 max-lg:hidden">
            {r.steps.map((s, i) => {
              const done = i === 0 && sent;
              const active = i === (sent ? 1 : 0);
              return (
                <li key={s} className="flex items-center gap-3 py-1.5">
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-full font-mono text-[12px] transition-colors",
                      done ? "bg-green text-white" : active ? "bg-ink text-white" : "bg-white text-muted ring-1 ring-line",
                    )}
                  >
                    {done ? <Check className="size-4" aria-hidden /> : i + 1}
                  </span>
                  <span className={cn("text-[15px]", active ? "font-semibold" : "text-muted")}>{s}</span>
                </li>
              );
            })}
          </ol>
          <p className="text-[12.5px] text-muted max-lg:hidden">
            {r.privacy}{" "}
            <Link href={`/${lang}/privacy`} className="text-ink underline underline-offset-4">
              {r.privacyLink}
            </Link>
          </p>
          <WhatsAppLink
            d={wa}
            farm={farm}
            place="request"
            className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-white px-4 py-2 text-[13.5px] font-semibold transition-colors hover:border-ink max-lg:hidden"
          >
            <WhatsAppIcon className="size-4 text-[#25d366]" />
            {wa.prefer} {wa.short}
          </WhatsAppLink>
        </aside>

        {/* Form card */}
        <section
          ref={cardRef}
          className="min-w-0 rounded-3xl [overflow-anchor:none] border border-line bg-white p-5 shadow-[0_24px_60px_-40px_rgba(20,27,43,0.5)] sm:p-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sent ? "done" : "form"}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: EASE }}
              onAnimationComplete={(def) => {
                // Also fires when the form finishes leaving; act on the thank-you screen's arrival.
                if ((def as { opacity?: number }).opacity !== 1 || !swapped.current) return;
                swapped.current = false;
                scrollToCard();
              }}
            >
              {!sent ? (
                <form
                  data-clarity-mask="true"
                  noValidate
                  className="flex flex-col gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void submit();
                  }}
                >
                  {/* Honeypot, hidden from people and screen readers */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    value={f.website}
                    onChange={(e) => set("website", e.target.value)}
                    className="absolute -start-[9999px] h-0 w-0 opacity-0"
                  />
                  <h2 className="font-display text-[22px] font-bold">{r.steps[0]}</h2>
                  <Field label={r.fields.farmName} error={errors.farmName} htmlFor={id("farmName")}>
                    <input
                      id={id("farmName")}
                      autoComplete="organization"
                      value={f.farmName}
                      onChange={(e) => set("farmName", e.target.value)}
                      className={inputCls(!!errors.farmName)}
                    />
                  </Field>
                  <Field label={r.fields.farmType} error={errors.farmType}>
                    <div id={id("farmType")} tabIndex={-1} className="outline-none">
                      <Chips
                        label={r.fields.farmType}
                        options={FARM_TYPES}
                        labels={r.farmTypes}
                        value={f.farmType}
                        onChange={(v) => set("farmType", v as Form["farmType"])}
                      />
                    </div>
                  </Field>
                  <Field label={r.fields.name} error={errors.name} htmlFor={id("name")}>
                    <input id={id("name")} autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} className={inputCls(!!errors.name)} />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={r.fields.email} error={errors.email} htmlFor={id("email")}>
                      <input
                        id={id("email")}
                        type="email"
                        dir="ltr"
                        autoComplete="email"
                        value={f.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={cn(inputCls(!!errors.email), "rtl:text-right")}
                      />
                    </Field>
                    <Field label={r.fields.phone} error={errors.phone} hint={r.fields.phoneHint} htmlFor={id("phone")}>
                      <input
                        id={id("phone")}
                        type="tel"
                        dir="ltr"
                        autoComplete="tel"
                        value={f.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className={cn(inputCls(!!errors.phone), "rtl:text-right")}
                      />
                    </Field>
                  </div>
                  <Field label={r.fields.country} error={errors.country} htmlFor={id("country")}>
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <select
                          id={id("country")}
                          autoComplete="country-name"
                          value={countryPick}
                          onChange={(e) => {
                            const v = e.target.value;
                            setOtherCountry(v === "other");
                            set("country", v === "other" || v === "" ? "" : v);
                          }}
                          className={cn(inputCls(!!errors.country), "appearance-none pe-10", !countryPick && "text-[#6b7689]")}
                        >
                          <option value="" disabled>
                            {r.countryChoose}
                          </option>
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.name} className="text-ink">
                              {r.countries[c.code]}
                            </option>
                          ))}
                          <option value="other" className="text-ink">
                            {r.countries.other}
                          </option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
                      </div>
                      {countryPick === "other" && (
                        <input
                          aria-label={r.countryOther}
                          placeholder={r.countryOther}
                          value={f.country}
                          onChange={(e) => set("country", e.target.value)}
                          className={inputCls(!!errors.country)}
                        />
                      )}
                    </div>
                  </Field>
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-start gap-3 text-[14px]">
                      <input
                        id={id("consent")}
                        type="checkbox"
                        checked={f.consent}
                        onChange={(e) => set("consent", e.target.checked)}
                        className="mt-0.5 size-[18px] accent-green"
                      />
                      {r.fields.consent}
                    </label>
                    {errors.consent && (
                      <p className="text-[12.5px] font-medium text-[#c2323a]" role="alert">
                        {errors.consent}
                      </p>
                    )}
                  </div>
                  {status === "error" && (
                    <p className="rounded-xl bg-[#fdecec] px-3.5 py-2.5 text-[13.5px] text-[#a3242b]" role="alert">
                      {fmt(r.errors.server, { email: contactEmail })}
                    </p>
                  )}
                  <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[12.5px] text-muted lg:hidden">
                      {r.privacy}{" "}
                      <Link href={`/${lang}/privacy`} className="text-ink underline underline-offset-4">
                        {r.privacyLink}
                      </Link>
                    </p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="flex items-center justify-center gap-2 rounded-xl bg-green px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-green-ink disabled:opacity-60 sm:ms-auto"
                    >
                      {status === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
                      {status === "sending" ? r.sending : r.submit}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Success band, edge to edge across the top of the card, like the confirmation email. */}
                  <div role="status" className="-mx-5 -mt-5 flex flex-col items-center gap-3 rounded-t-3xl bg-green px-6 pt-9 pb-8 text-center text-white sm:-mx-8 sm:-mt-8">
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.1 }}
                      className="grid size-16 place-items-center rounded-full bg-white text-green shadow-[0_0_0_10px_rgba(255,255,255,0.14)]"
                    >
                      <Check className="size-8" strokeWidth={3} aria-hidden />
                    </motion.span>
                    <span className="mt-2 rounded-full bg-[#17613a] px-3.5 py-1 text-[13px] font-semibold text-[#e3f4ea]">
                      {r.done.badge}
                    </span>
                    <h2 className="font-display text-[22px] leading-snug font-bold text-balance sm:text-[26px]">{r.done.reply}</h2>
                    {emailed && (
                      <p className="flex items-center gap-2 text-[14.5px] text-[#e3f4ea]">
                        <Mail className="size-4" aria-hidden />
                        {r.done.emailed}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-display text-[18px] font-bold text-green-ink">{r.done.nextTitle}</h3>
                    <ol className="flex flex-col gap-2.5">
                      {r.done.next.map((n, i) => (
                        <li
                          key={n.t}
                          className={cn(
                            "grid grid-cols-[32px_minmax(0,1fr)] gap-3 rounded-2xl bg-[#eaf5ee] p-4",
                            i === 0 && WHATSAPP_NUMBER && "ring-2 ring-green",
                          )}
                        >
                          <span className="grid size-8 place-items-center rounded-full bg-green font-mono text-[13px] font-semibold text-white" dir="ltr">
                            {i + 1}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[15.5px] font-bold text-green-ink">{n.t}</span>
                            <span className="text-[14px] leading-relaxed text-ink">{fmt(n.d, { farm: shownFarm })}</span>
                            {i === 0 && WHATSAPP_NUMBER && (
                              <a
                                href={whatsappUrl(fmt(r.done.photosMessage, { farm: shownFarm }))}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => track("whatsapp_click", { place: "done" })}
                                className="mt-2 inline-flex items-center gap-2 self-start rounded-xl bg-green px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-green-ink"
                              >
                                <WhatsAppIcon className="size-4" />
                                {r.done.photos}
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {pass && (
                    <div className="rounded-2xl border border-line p-5">
                      {xStatus === "done" ? (
                        <p className="flex items-center gap-2.5 text-[14.5px] font-semibold text-green-ink" role="status">
                          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-green text-white">
                            <Check className="size-4" aria-hidden />
                          </span>
                          {r.details.done}
                        </p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                            <h3 className="font-display text-[17px] font-bold">{r.details.title}</h3>
                            <p className="text-[14px] leading-relaxed text-muted">{r.details.sub}</p>
                          </div>
                          {!xOpen ? (
                            <button
                              type="button"
                              onClick={() => {
                                setXOpen(true);
                                track("request_details", { stage: "open", lang });
                              }}
                              className="inline-flex items-center gap-2 self-start rounded-xl border-2 border-green px-4 py-2 text-[14px] font-semibold text-green transition-colors hover:bg-green hover:text-white"
                            >
                              <Plus className="size-4" aria-hidden />
                              {r.details.open}
                            </button>
                          ) : (
                            <form
                              data-clarity-mask="true"
                              noValidate
                              className="flex flex-col gap-5"
                              onSubmit={(e) => {
                                e.preventDefault();
                                void sendDetails();
                              }}
                            >
                              <Field label={r.fields.role}>
                                <Chips label={r.fields.role} options={ROLES} labels={r.roles} value={x.role} onChange={(v) => setD("role", v as Details["role"])} />
                              </Field>
                              <div className="grid gap-5 sm:grid-cols-2">
                                <Field label={r.fields.area} error={xErrors.areaM2} htmlFor={id("areaM2")}>
                                  <input
                                    id={id("areaM2")}
                                    inputMode="decimal"
                                    dir="ltr"
                                    value={x.areaM2}
                                    onChange={(e) => setD("areaM2", e.target.value.replace(/[^\d.]/g, ""))}
                                    className={cn(inputCls(!!xErrors.areaM2), "rtl:text-right")}
                                  />
                                </Field>
                                <Field label={r.fields.levels} error={xErrors.levels} htmlFor={id("levels")}>
                                  <input
                                    id={id("levels")}
                                    inputMode="numeric"
                                    dir="ltr"
                                    value={x.levels}
                                    onChange={(e) => setD("levels", e.target.value.replace(/\D/g, ""))}
                                    className={cn(inputCls(!!xErrors.levels), "rtl:text-right")}
                                  />
                                </Field>
                              </div>
                              <Field label={r.fields.crops}>
                                <Chips label={r.fields.crops} options={CROPS} labels={r.crops} value={x.crops} multi onChange={(v) => setD("crops", v as Details["crops"])} />
                              </Field>
                              <Field label={r.fields.cropsOther} htmlFor={id("cropsOther")}>
                                <input id={id("cropsOther")} value={x.cropsOther} onChange={(e) => setD("cropsOther", e.target.value)} className={inputCls()} />
                              </Field>
                              <Field label={r.fields.monitoring}>
                                <Chips
                                  label={r.fields.monitoring}
                                  options={MONITORING}
                                  labels={r.monitoring}
                                  value={x.monitoring}
                                  onChange={(v) => setD("monitoring", v as Details["monitoring"])}
                                />
                              </Field>
                              {x.monitoring === "software" && (
                                <Field label={r.fields.sensorBrand} htmlFor={id("sensorBrand")}>
                                  <input id={id("sensorBrand")} value={x.sensorBrand} onChange={(e) => setD("sensorBrand", e.target.value)} className={inputCls()} />
                                </Field>
                              )}
                              <Field label={r.fields.goals}>
                                <Chips label={r.fields.goals} options={GOALS} labels={r.goals} value={x.goals} multi onChange={(v) => setD("goals", v as Details["goals"])} />
                              </Field>
                              <Field label={r.fields.message} htmlFor={id("message")}>
                                <textarea
                                  id={id("message")}
                                  rows={4}
                                  value={x.message}
                                  onChange={(e) => setD("message", e.target.value)}
                                  className={cn(inputCls(), "resize-y")}
                                />
                              </Field>
                              {xStatus === "error" && (
                                <p className="rounded-xl bg-[#fdecec] px-3.5 py-2.5 text-[13.5px] text-[#a3242b]" role="alert">
                                  {r.details.error}
                                </p>
                              )}
                              <button
                                type="submit"
                                disabled={xStatus === "sending"}
                                className="flex items-center justify-center gap-2 self-start rounded-xl bg-green px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-green-ink disabled:opacity-60"
                              >
                                {xStatus === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
                                {xStatus === "sending" ? r.details.sending : r.details.send}
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 border-t border-line pt-5">
                    <Link href={demoHref} className="rounded-xl border-2 border-green px-4 py-2 text-[14px] font-semibold text-green transition-colors hover:bg-green hover:text-white">
                      {r.done.demo}
                    </Link>
                    <Link href={`/${lang}`} className="rounded-xl border border-line px-4 py-2.5 text-[14px] font-semibold hover:border-ink">
                      {r.done.home}
                    </Link>
                    {bookingHref && (
                      <a
                        href={bookingHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2 py-2.5 text-[14px] font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
                      >
                        <CalendarCheck className="size-4" aria-hidden />
                        {r.done.talk}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </MotionConfig>
  );
}
