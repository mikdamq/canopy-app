"use client";

import { useSyncExternalStore } from "react";

/** `null` during server render and hydration, then the live media-query result. */
export function useMedia(query: string) {
  return useSyncExternalStore<boolean | null>(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => null,
  );
}
