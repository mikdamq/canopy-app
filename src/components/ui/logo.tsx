import { Sprout } from "lucide-react";
import { BRAND } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg bg-green text-white", className)}>
      <Sprout className="size-4" strokeWidth={2.2} aria-hidden />
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-display text-[17px] font-bold whitespace-nowrap", className)}>
      <Mark />
      {BRAND}
    </span>
  );
}
