"use client";

import { useEffect, useState } from "react";

const QUERY = "(hover: none), (pointer: coarse)";

/**
 * True on touch / coarse-pointer devices (phones, tablets), where continuous
 * ambient animation — drifting blur orbs, cursor effects, per-frame number
 * tweens — costs far more GPU/CPU than it adds. Entrance animations stay on;
 * only the always-running effects should key off this.
 *
 * Starts false (matches the server render) and resolves after mount, so it
 * never causes a hydration mismatch.
 */
export function useLiteAnimations(): boolean {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const update = () => setLite(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return lite;
}
