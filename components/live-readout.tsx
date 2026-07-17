"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small "the meter is running right now" readout: a live clock and a building
 * load figure that drifts every second the way a real feed would. Renders a
 * stable placeholder on the server, then comes alive after mount (so there's no
 * hydration mismatch and reduced-motion users still get a sensible value).
 */
export function LiveReadout() {
  const [time, setTime] = useState<string | null>(null);
  const [load, setLoad] = useState(486);
  const loadRef = useRef(486);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      // Random walk that stays in a believable band (kW).
      const drift = (Math.random() - 0.5) * 14;
      loadRef.current = Math.round(
        Math.max(430, Math.min(540, loadRef.current + drift)),
      );
      setLoad(loadRef.current);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono text-[10.5px] tracking-wide text-white/60">
      <span className="flex items-center gap-1.5 text-green-soft">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-soft opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-soft" />
        </span>
        LIVE
      </span>
      <span className="tabular text-white/80">{load} kW</span>
      <span className="hidden text-white/40 sm:inline">{time ?? "--:--:--"}</span>
    </div>
  );
}
