"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Honour the visitor's reduced-motion setting for every animation inside. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
