"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMedia } from "@/lib/use-media";
import { FarmSim } from "@/components/twin/sim";

const FarmCanvas = dynamic(() => import("@/components/twin/scene"), { ssr: false });

/** The live farm running quietly behind the hero copy. */
export function HeroTwin() {
  const reduce = useReducedMotion() ?? false;
  const [sim] = useState(() => new FarmSim());
  const wide = useMedia("(min-width: 1024px)");
  useEffect(() => {
    if (reduce) sim.setPlaying(false);
  }, [reduce, sim]);
  if (wide === null) return null;
  return <FarmCanvas sim={sim} reduce={reduce} compact={!wide} hero />;
}
