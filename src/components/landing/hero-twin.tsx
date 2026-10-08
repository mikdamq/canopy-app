"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMedia } from "@/lib/use-media";
import { cn } from "@/lib/utils";
import { FarmSim } from "@/components/twin/sim";

const FarmCanvas = dynamic(() => import("@/components/twin/scene"), { ssr: false });

/**
 * The live farm running quietly behind the hero copy. A still of the same view shows
 * from the first paint (before any JavaScript runs); the live 3D fades in over it once
 * it has drawn its first frame.
 */
export function HeroTwin() {
  const reduce = useReducedMotion() ?? false;
  const [sim] = useState(() => new FarmSim());
  const [ready, setReady] = useState(false);
  const wide = useMedia("(min-width: 1024px)");
  useEffect(() => {
    if (reduce) sim.setPlaying(false);
  }, [reduce, sim]);
  return (
    <>
      <picture>
        <source media="(min-width: 1024px)" srcSet="/hero/farm-wide.webp" />
        <img
          src="/hero/farm-compact.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>
      {wide !== null && (
        <div className={cn("absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none", ready ? "opacity-100" : "opacity-0")}>
          <FarmCanvas sim={sim} reduce={reduce} compact={!wide} hero onReady={() => setReady(true)} />
        </div>
      )}
    </>
  );
}
