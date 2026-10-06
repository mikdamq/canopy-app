"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { Locale } from "@/i18n/config";
import { cleanFarmName, MAX_FARM_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

/** "Your farm's name" field that opens the personalised demo. */
export function NameForm({
  lang,
  label,
  placeholder,
  button,
  error,
  note,
  tone = "light",
}: {
  lang: Locale;
  label: string;
  placeholder: string;
  button: string;
  error: string;
  note?: string;
  tone?: "light" | "dark";
}) {
  const router = useRouter();
  const id = useId();
  const [name, setName] = useState("");
  const [bad, setBad] = useState(false);
  const dark = tone === "dark";
  return (
    <form
      className="flex w-full max-w-[520px] flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const clean = cleanFarmName(name);
        if (!clean) return setBad(true);
        router.push(`/${lang}/demo?farm=${encodeURIComponent(clean)}`);
      }}
    >
      <label htmlFor={id} className={cn("text-[13.5px] font-semibold", dark ? "text-white/80" : "text-ink")}>
        {label}
      </label>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl border p-1.5 sm:flex-row",
          dark ? "border-white/15 bg-white/10" : "border-line bg-white shadow-[0_16px_40px_-28px_rgba(20,27,43,0.5)]",
          bad && "border-[#e5484d]",
        )}
      >
        <input
          id={id}
          value={name}
          maxLength={MAX_FARM_NAME}
          placeholder={placeholder}
          aria-invalid={bad}
          aria-describedby={bad ? `${id}-err` : undefined}
          onChange={(e) => {
            setName(e.target.value);
            setBad(false);
          }}
          className={cn(
            "min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2.5 text-[16px] outline-none",
            dark ? "text-white placeholder:text-white/40" : "placeholder:text-[#9aa6ba]",
          )}
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-green px-5 py-3 text-[15px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-green-ink"
        >
          {button}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </button>
      </div>
      {bad ? (
        <p id={`${id}-err`} className="text-[13px] font-medium text-[#e5484d]" role="alert">
          {error}
        </p>
      ) : (
        note && <p className={cn("text-[13px]", dark ? "text-white/55" : "text-muted")}>{note}</p>
      )}
    </form>
  );
}
