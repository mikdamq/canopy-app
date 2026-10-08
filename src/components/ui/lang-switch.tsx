"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const SECTIONS = ["how", "features", "who", "pilot", "faq"];

/**
 * Language switch that keeps the visitor's place: it links to the same section of
 * the other language's page (the section nearest the top of the screen).
 */
export function LangSwitch({ href, label, title, className }: { href: string; label: string; title: string; className?: string }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      title={title}
      className={className}
      onClick={(e) => {
        let current = "";
        for (const id of SECTIONS) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
        }
        if (!current) return;
        e.preventDefault();
        router.push(`${href}#${current}`);
      }}
    >
      {label}
    </Link>
  );
}
