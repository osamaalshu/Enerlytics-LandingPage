"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Anchored instrumentation — the site's signature element.
 *
 * A `Callout` is a readout pinned to a point in the physical scene (x/y in %
 * of the plate), joined to it by a thin leader line. It is how the "digital
 * layer" attaches to equipment instead of floating as a card (brief §5.1:
 * overlays behave like instrumentation, aligned to assets).
 *
 * The leader draws with a CSS stroke animation — so it is visible with no
 * JavaScript at all — and the number counts in once on view.
 */

export type Tone = "teal" | "money" | "normal" | "fault" | "muted" | "load" | "pv" | "bess";

const toneClass: Record<Tone, { text: string; stroke: string; dot: string }> = {
  teal: { text: "text-teal-fg", stroke: "#34a0a4", dot: "bg-teal-soft" },
  money: { text: "text-amber", stroke: "#f59e0b", dot: "bg-amber" },
  normal: { text: "text-state-normal", stroke: "#22c55e", dot: "bg-state-normal" },
  fault: { text: "text-state-fault", stroke: "#ef4444", dot: "bg-state-fault" },
  muted: { text: "text-white/70", stroke: "rgba(255,255,255,0.5)", dot: "bg-white/60" },
  load: { text: "text-blue-fg", stroke: "#3b82f6", dot: "bg-flow-load" },
  pv: { text: "text-teal-fg", stroke: "#34a0a4", dot: "bg-flow-pv" },
  bess: { text: "text-state-normal", stroke: "#22c55e", dot: "bg-flow-bess" },
};

export function Callout({
  x,
  y,
  dx = 120,
  dy = -56,
  label,
  value,
  unit,
  note,
  tone = "teal",
  delay = 0,
  className,
  children,
}: {
  /** anchor point, % of the plate */
  x: number;
  y: number;
  /** readout offset from the anchor, px (negative dx puts it left) */
  dx?: number;
  dy?: number;
  label: string;
  value?: number | string;
  unit?: string;
  note?: string;
  tone?: Tone;
  /** stagger index 0–3 for the CSS trace entrance */
  delay?: 0 | 1 | 2 | 3;
  className?: string;
  children?: React.ReactNode;
}) {
  const t = toneClass[tone];
  const left = dx < 0;
  return (
    <div
      className={cn("pointer-events-none absolute", className)}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* anchor dot on the equipment */}
      <span
        className={cn("absolute -ml-1 -mt-1 h-2 w-2 rounded-full ring-2 ring-ink/70", t.dot)}
        aria-hidden
      />
      {/* leader: anchor → elbow → readout */}
      <svg
        aria-hidden
        className="absolute overflow-visible"
        style={{ left: 0, top: 0 }}
        width={1}
        height={1}
      >
        <path
          d={`M 0 0 L ${dx * 0.55} ${dy} L ${dx} ${dy}`}
          fill="none"
          stroke={t.stroke}
          strokeWidth={1}
          strokeOpacity={0.85}
          className={cn("trace", delay > 0 && `trace-${delay}`)}
        />
      </svg>
      <div
        className={cn(
          "absolute w-max rounded-md border border-white/10 bg-ink/70 px-3 py-2 backdrop-blur-md",
          "rise",
          delay > 0 && `rise-${delay}`,
        )}
        style={{
          left: left ? undefined : dx,
          right: left ? -dx : undefined,
          top: dy,
          transform: "translateY(-100%)",
          animationDelay: `${0.45 + delay * 0.3}s`,
        }}
      >
        <div className="instrument text-white/65">{label}</div>
        {value !== undefined && (
          <div className={cn("tabular mt-0.5 font-mono text-[20px] font-semibold leading-none", t.text)}>
            {typeof value === "number" ? <CountUp to={value} /> : value}
            {unit && <span className="ml-1 text-[12px] font-medium text-white/65">{unit}</span>}
          </div>
        )}
        {note && <div className="mt-1 font-mono text-[10px] tracking-wide text-white/60">{note}</div>}
        {children}
      </div>
    </div>
  );
}

/**
 * CountUp — interpolates once when it enters view (brief §9.1: number
 * interpolation for live values, never every statistic from zero). Renders
 * the final value on the server so content is never hidden.
 */
export function CountUp({
  to,
  decimals = 0,
  duration = 1.1,
  className,
}: {
  to: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useEffect(() => {
    if (!inView || reduced || done || !ref.current) return;
    const el = ref.current;
    const controls = animate(to * 0.72, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, to]);

  return (
    <span ref={ref} className={className}>
      {fmt(to)}
    </span>
  );
}

/** Legend chip for asset states — label always accompanies colour (§11.3). */
export function StateChip({
  state,
  className,
}: {
  state: "NORMAL" | "WARNING" | "FAULT" | "OFFLINE" | "CHARGING" | "DISCHARGING" | "GENERATING" | "CURTAILED";
  className?: string;
}) {
  const map: Record<typeof state, string> = {
    NORMAL: "border-state-normal/50 text-state-normal",
    GENERATING: "border-teal-soft/60 text-teal-fg",
    CHARGING: "border-state-normal/50 text-state-normal",
    DISCHARGING: "border-state-normal/50 text-state-normal",
    WARNING: "border-state-fault/40 border-dashed text-state-fault/90",
    FAULT: "border-state-fault/70 text-state-fault",
    OFFLINE: "border-white/25 text-white/50",
    CURTAILED: "border-white/40 border-dashed text-white/75",
  };
  return (
    <span
      className={cn(
        "instrument inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[9.5px]",
        map[state],
        className,
      )}
    >
      {state}
    </span>
  );
}
