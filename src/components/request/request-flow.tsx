"use client";

import { ArrowLeft, ArrowRight, CalendarCheck, Check, Loader2 } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { fmt, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import {
  CROPS,
  FARM_TYPES,
  GOALS,
  MONITORING,
  ROLES,
  STEP_FIELDS,
  requestSchema,
  type FieldName,
} from "@/lib/request-schema";
import { cn } from "@/lib/utils";

type R = Dict["request"];

type Form = {
  name: string;
  email: string;
  phone: string;
  role: (typeof ROLES)[number] | "";
  country: string;
  farmName: string;
  farmType: (typeof FARM_TYPES)[number] | "";
  areaM2: string;
  levels: string;
  crops: (typeof CROPS)[number][];
  cropsOther: string;
  monitoring: (typeof MONITORING)[number] | "";
  sensorBrand: string;
  goals: (typeof GOALS)[number][];
  message: string;
  consent: boolean;
  website: string;
};

const ERROR_KEY: Record<FieldName, keyof R["errors"]> = {
  name: "required",
  email: "email",
  phone: "phone",
  role: "required",
  country: "required",
  farmName: "required",
  farmType: "required",
  areaM2: "number",
  levels: "number",
  crops: "choose",
  cropsOther: "required",
  monitoring: "required",
  sensorBrand: "required",
  goals: "choose",
  message: "required",
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
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] outline-none transition-colors placeholder:text-[#9aa6ba] focus:border-green",
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

export default function RequestFlow({
  lang,
  r,
  farm,
  source,
  bookingUrl,
  contactEmail,
}: {
  lang: Locale;
  r: R;
  farm: string;
  source: string;
  bookingUrl: string;
  contactEmail: string;
}) {
  const uid = useId();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "done">("idle");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [f, setF] = useState<Form>({
    name: "",
    email: "",
    phone: "",
    role: "",
    country: "",
    farmName: farm,
    farmType: "",
    areaM2: "",
    levels: "",
    crops: [],
    cropsOther: "",
    monitoring: "",
    sensorBrand: "",
    goals: [],
    message: "",
    consent: false,
    website: "",
  });

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (k in ERROR_KEY) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const payload = () => ({ ...f, locale: lang, source });

  /** Validate the fields of one step; returns true when they're all fine. */
  const check = (s: number) => {
    const fields = STEP_FIELDS[s];
    const mask = Object.fromEntries(fields.map((k) => [k, true])) as Record<FieldName, true>;
    const res = requestSchema.pick(mask).safeParse(payload());
    if (res.success) return true;
    const next: Partial<Record<FieldName, string>> = {};
    for (const issue of res.error.issues) {
      const k = issue.path[0] as FieldName;
      if (!next[k]) next[k] = r.errors[ERROR_KEY[k]];
    }
    setErrors(next);
    const first = fields.find((k) => next[k]);
    if (first) document.getElementById(`${uid}-${first}`)?.focus();
    return false;
  };

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!check(2)) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      go(3);
    } catch {
      setStatus("error");
    }
  };

  const id = (k: FieldName) => `${uid}-${k}`;
  const firstName = f.name.trim().split(/\s+/)[0] ?? "";
  const bookingSrc = bookingUrl
    ? `${bookingUrl}${bookingUrl.includes("?") ? "&" : "?"}name=${encodeURIComponent(f.name)}&email=${encodeURIComponent(f.email)}`
    : "";
  const demoHref = `/${lang}/demo${f.farmName ? `?farm=${encodeURIComponent(f.farmName)}` : ""}`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] lg:gap-14">
        {/* Intro and progress */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[12px] tracking-[0.1em] text-green uppercase">{r.eyebrow}</p>
            <h1 className="font-display text-[34px] leading-[1.05] font-bold tracking-[-0.02em] text-balance sm:text-[44px]">{r.title}</h1>
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-muted">{r.sub}</p>
          </div>
          <ol className="flex flex-col gap-1">
            {r.steps.map((s, i) => {
              const done = i < step;
              const active = i === step;
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
          <p className="text-[12.5px] text-muted">{r.privacy}</p>
        </aside>

        {/* Form card */}
        <section className="min-w-0 rounded-3xl border border-line bg-white p-5 shadow-[0_24px_60px_-40px_rgba(20,27,43,0.5)] sm:p-8">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 2) {
                if (check(step)) go(step + 1);
              } else if (step === 2) void submit();
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
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: 24 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 * dir }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex flex-col gap-5"
              >
                <h2 className="font-display text-[22px] font-bold">{r.steps[step]}</h2>

                {step === 0 && (
                  <>
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
                    <Field label={r.fields.role} error={errors.role}>
                      <Chips label={r.fields.role} options={ROLES} labels={r.roles} value={f.role} onChange={(v) => set("role", v as Form["role"])} />
                    </Field>
                    <Field label={r.fields.country} error={errors.country} htmlFor={id("country")}>
                      <input
                        id={id("country")}
                        autoComplete="country-name"
                        value={f.country}
                        onChange={(e) => set("country", e.target.value)}
                        className={inputCls(!!errors.country)}
                      />
                    </Field>
                  </>
                )}

                {step === 1 && (
                  <>
                    <Field label={r.fields.farmName} error={errors.farmName} htmlFor={id("farmName")}>
                      <input id={id("farmName")} value={f.farmName} onChange={(e) => set("farmName", e.target.value)} className={inputCls(!!errors.farmName)} />
                    </Field>
                    <Field label={r.fields.farmType} error={errors.farmType}>
                      <Chips
                        label={r.fields.farmType}
                        options={FARM_TYPES}
                        labels={r.farmTypes}
                        value={f.farmType}
                        onChange={(v) => set("farmType", v as Form["farmType"])}
                      />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={r.fields.area} error={errors.areaM2} htmlFor={id("areaM2")}>
                        <input
                          id={id("areaM2")}
                          inputMode="decimal"
                          dir="ltr"
                          value={f.areaM2}
                          onChange={(e) => set("areaM2", e.target.value.replace(/[^\d.]/g, ""))}
                          className={cn(inputCls(!!errors.areaM2), "rtl:text-right")}
                        />
                      </Field>
                      <Field label={r.fields.levels} error={errors.levels} htmlFor={id("levels")}>
                        <input
                          id={id("levels")}
                          inputMode="numeric"
                          dir="ltr"
                          value={f.levels}
                          onChange={(e) => set("levels", e.target.value.replace(/\D/g, ""))}
                          className={cn(inputCls(!!errors.levels), "rtl:text-right")}
                        />
                      </Field>
                    </div>
                    <Field label={r.fields.crops} error={errors.crops}>
                      <Chips label={r.fields.crops} options={CROPS} labels={r.crops} value={f.crops} multi onChange={(v) => set("crops", v as Form["crops"])} />
                    </Field>
                    <Field label={r.fields.cropsOther} htmlFor={id("cropsOther")}>
                      <input id={id("cropsOther")} value={f.cropsOther} onChange={(e) => set("cropsOther", e.target.value)} className={inputCls()} />
                    </Field>
                    <Field label={r.fields.monitoring} error={errors.monitoring}>
                      <Chips
                        label={r.fields.monitoring}
                        options={MONITORING}
                        labels={r.monitoring}
                        value={f.monitoring}
                        onChange={(v) => set("monitoring", v as Form["monitoring"])}
                      />
                    </Field>
                    {f.monitoring === "software" && (
                      <Field label={r.fields.sensorBrand} htmlFor={id("sensorBrand")}>
                        <input id={id("sensorBrand")} value={f.sensorBrand} onChange={(e) => set("sensorBrand", e.target.value)} className={inputCls()} />
                      </Field>
                    )}
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field label={r.fields.goals} error={errors.goals}>
                      <Chips label={r.fields.goals} options={GOALS} labels={r.goals} value={f.goals} multi onChange={(v) => set("goals", v as Form["goals"])} />
                    </Field>
                    <Field label={r.fields.message} htmlFor={id("message")}>
                      <textarea
                        id={id("message")}
                        rows={4}
                        value={f.message}
                        onChange={(e) => set("message", e.target.value)}
                        className={cn(inputCls(), "resize-y")}
                      />
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
                  </>
                )}

                {step === 3 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#eaf6ef] text-green">
                        <Check className="size-5" aria-hidden />
                      </span>
                      <div className="flex flex-col gap-1">
                        <p className="font-display text-[20px] leading-snug font-bold">{fmt(r.done.title, { name: firstName })}</p>
                        <p className="text-[14.5px] text-muted">{r.done.sub}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="flex items-center gap-2 text-[14px] font-semibold">
                        <CalendarCheck className="size-4 text-green" aria-hidden />
                        {r.done.bookingTitle}
                      </p>
                      {bookingSrc ? (
                        <iframe
                          title={r.done.bookingTitle}
                          src={bookingSrc}
                          className="h-[640px] w-full rounded-2xl border border-line"
                          loading="lazy"
                        />
                      ) : (
                        <p className="rounded-xl bg-[#f4f6fa] px-4 py-3 text-[14px] text-muted">{r.done.fallback}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={demoHref} className="rounded-xl bg-ink px-4 py-2.5 text-[14px] font-semibold text-white">
                        {r.done.demo}
                      </Link>
                      <Link href={`/${lang}`} className="rounded-xl border border-line px-4 py-2.5 text-[14px] font-semibold hover:border-ink">
                        {r.done.home}
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {step < 3 && (
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => go(step - 1)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-muted hover:text-ink"
                  >
                    <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
                    {r.back}
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex items-center gap-2 rounded-xl bg-green px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-green-ink disabled:opacity-60"
                >
                  {status === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
                  {step < 2 ? r.next : status === "sending" ? r.sending : r.submit}
                  {step < 2 && <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />}
                </button>
              </div>
            )}
          </form>
        </section>
      </div>
    </MotionConfig>
  );
}
