"use client";

import { useEffect, useState, type RefObject } from "react";
import { useReducedMotion, useScroll, type MotionValue } from "framer-motion";
import { useLiteAnimations } from "@/lib/use-lite-animations";

/**
 * The one scroll engine on the site is framer-motion's `useScroll`
 * (hardware-accelerated, ScrollTimeline-backed where available). Every
 * cinematic chapter reads progress through these helpers so there is no
 * sprawl of bespoke scroll listeners (brief §12.3).
 */

/** Progress 0→1 across an element's full travel through the viewport. */
type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

export function useSceneProgress(
  target: RefObject<HTMLElement | null>,
  offset: ScrollOffset = ["start end", "end start"],
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target, offset });
  return scrollYProgress;
}

/**
 * True when continuous / scroll-linked motion is appropriate: the visitor
 * has not asked for reduced motion, the device is not a coarse-pointer phone,
 * and the viewport is wide enough for a pinned chapter (≥ 1024px).
 *
 * Starts false so the server render is the calm static layout; motion is a
 * progressive enhancement, never a gate in front of content.
 */
export function useCinematicOk(): boolean {
  const reduced = useReducedMotion();
  const lite = useLiteAnimations();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return !reduced && !lite && wide;
}

/** Piecewise-linear window: 0 before `from`, 1 after `to`. */
export function window01(p: number, from: number, to: number): number {
  if (p <= from) return 0;
  if (p >= to) return 1;
  return (p - from) / (to - from);
}

/** Smoothstep ease for hand-driven interpolation. */
export function smooth(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}
