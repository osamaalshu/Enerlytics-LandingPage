"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { StateChip } from "@/components/cinematic/metric-overlay";

/**
 * EnergyFlow — the site energy system as a small live diagram: PV above,
 * grid left, loads right, battery below, all meeting at the site bus.
 *
 * Direction is explicit (dashes march from source to sink; the battery edge
 * reverses when charging) and every quantity carries a unit and a text
 * state. Stroke width scales with power so the visitor reads the balance
 * before reading a number. Reused by the PV + BESS chapter; the asset graph
 * uses the fuller topology.
 */
export type FlowState = {
  pvKw: number;
  pvExpectedKw: number;
  gridKw: number; // + import, − export
  bessKw: number; // + discharging to bus, − charging from bus
  loadKw: number;
  soc: number;
  /** which edges are drawn (0 none … 4 all) — the chapter reveals them in order */
  reveal: number;
  /** highlighted node, if any */
  focus?: "pv" | "bess" | "grid" | "load" | null;
  peak?: boolean;
};

const W = 420;
const H = 360;
const C = { x: W / 2, y: H / 2 };
const PV = { x: W / 2, y: 46 };
const BESS = { x: W / 2, y: H - 46 };
const GRID = { x: 70, y: H / 2 };
const LOAD = { x: W - 70, y: H / 2 };

const width = (kw: number) => Math.max(1.5, Math.min(9, Math.abs(kw) / 110));

export function EnergyFlow({ s, className }: { s: FlowState; className?: string }) {
  const reduced = useReducedMotion();
  const edges = [
    { id: "pv", from: PV, to: C, kw: s.pvKw, color: "#34a0a4", reverse: false, step: 1 },
    { id: "grid", from: GRID, to: C, kw: s.gridKw, color: "#cbd5e1", reverse: s.gridKw < 0, step: 2 },
    { id: "load", from: C, to: LOAD, kw: s.loadKw, color: "#3b82f6", reverse: false, step: 2 },
    { id: "bess", from: BESS, to: C, kw: s.bessKw, color: "#22c55e", reverse: s.bessKw < 0, step: 3 },
  ];
  const bessState = s.bessKw > 5 ? "DISCHARGING" : s.bessKw < -5 ? "CHARGING" : "NORMAL";
  const pvGap = s.pvExpectedKw - s.pvKw;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={`Site energy flow. Solar ${s.pvKw} kW of ${s.pvExpectedKw} expected. Grid ${s.gridKw >= 0 ? "import" : "export"} ${Math.abs(s.gridKw)} kW. Battery ${bessState.toLowerCase()} at ${Math.abs(s.bessKw)} kW, ${s.soc} percent state of charge. Site load ${s.loadKw} kW.`}
    >
      <defs>
        <radialGradient id="ef-bus" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34a0a4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#34a0a4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {s.peak && <rect x={0} y={0} width={W} height={H} fill="#f59e0b" opacity={0.04} rx={16} />}

      {edges.map((e) => {
        const on = s.reveal >= e.step;
        const d = `M ${e.from.x} ${e.from.y} L ${e.to.x} ${e.to.y}`;
        const active = Math.abs(e.kw) > 5;
        return (
          <g key={e.id}>
            <motion.path
              d={d}
              fill="none"
              stroke={e.color}
              strokeOpacity={0.28}
              initial={false}
              animate={{ pathLength: on ? 1 : 0, strokeWidth: width(e.kw) + 2 }}
              transition={{ duration: reduced ? 0 : 0.9, ease: [0.4, 0, 0.2, 1] }}
            />
            {on && active && (
              <motion.path
                d={d}
                fill="none"
                stroke={e.color}
                strokeLinecap="round"
                className="flow"
                initial={false}
                animate={{ strokeWidth: width(e.kw), opacity: 1 }}
                style={{ animationDirection: e.reverse ? "reverse" : "normal" }}
              />
            )}
          </g>
        );
      })}

      {/* site bus */}
      <circle cx={C.x} cy={C.y} r={54} fill="url(#ef-bus)" />
      <circle cx={C.x} cy={C.y} r={26} fill="#0a1330" stroke="rgba(255,255,255,0.25)" />
      <text x={C.x} y={C.y - 3} textAnchor="middle" className="fill-white/60 font-mono" fontSize="8" letterSpacing="0.14em">SITE BUS</text>
      <text x={C.x} y={C.y + 10} textAnchor="middle" className="fill-white font-mono" fontSize="11" fontWeight="600">
        {s.loadKw} kW
      </text>

      <Node at={PV} label="Solar" color="#34a0a4" focus={s.focus === "pv"} on={s.reveal >= 1} above chip={s.pvKw > 5 ? "GENERATING" : "OFFLINE"}>
        <Value v={s.pvKw} unit="kW" />
        <Sub text={`expected ${s.pvExpectedKw} kW${pvGap > 8 ? ` · −${pvGap}` : ""}`} warn={pvGap > 8} />
      </Node>
      <Node at={GRID} label="Grid" color="#cbd5e1" focus={s.focus === "grid"} on={s.reveal >= 2} side="left">
        <Value v={Math.abs(s.gridKw)} unit="kW" />
        <Sub text={s.gridKw >= 0 ? (s.peak ? "import · peak rate" : "import") : "export"} warn={!!s.peak} />
      </Node>
      <Node at={LOAD} label="Facility" color="#3b82f6" focus={s.focus === "load"} on={s.reveal >= 2} side="right">
        <Value v={s.loadKw} unit="kW" />
        <Sub text="cooling · electrical · process" />
      </Node>
      <Node at={BESS} label="Storage" color="#22c55e" focus={s.focus === "bess"} on={s.reveal >= 3} chip={bessState}>
        <Value v={Math.abs(s.bessKw)} unit="kW" />
        <Sub text={`${s.soc} % SoC`} />
      </Node>
    </svg>
  );
}

type ChipState = React.ComponentProps<typeof StateChip>["state"];

function Node({
  at, label, color, focus, on, above, side, chip, children,
}: {
  at: { x: number; y: number }; label: string; color: string; focus: boolean; on: boolean;
  above?: boolean; side?: "left" | "right"; chip?: ChipState; children: React.ReactNode;
}) {
  const w = 128;
  const h = 62;
  const x = side === "left" ? at.x - w / 2 - 6 : side === "right" ? at.x - w / 2 + 6 : at.x - w / 2;
  const y = above ? at.y - h / 2 - 4 : at.y - h / 2;
  return (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0.15 }} transition={{ duration: 0.5 }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#0a1330" stroke={focus ? color : "rgba(255,255,255,0.16)"} strokeWidth={focus ? 1.5 : 1} />
      <circle cx={x + 12} cy={y + 13} r={3} fill={color} />
      <text x={x + 20} y={y + 16.5} className="fill-white" fontSize="11" fontWeight="600">{label}</text>
      <g transform={`translate(${x + 12}, ${y + 36})`}>{children}</g>
      {chip && (
        <foreignObject x={x + w - 92} y={y - 9} width={96} height={18}>
          <StateChip state={chip} className="bg-ink" />
        </foreignObject>
      )}
    </motion.g>
  );
}
/** SVG-safe count: a tspan whose text is tweened when the value changes. */
function Value({ v, unit }: { v: number; unit: string }) {
  const ref = useRef<SVGTSpanElement>(null);
  const reduced = useReducedMotion();
  const prev = useRef(v);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = String(v);
      prev.current = v;
      return;
    }
    const c = animate(prev.current, v, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => {
        el.textContent = String(Math.round(x));
      },
      onComplete: () => {
        prev.current = v;
      },
    });
    return () => c.stop();
  }, [v, reduced]);
  return (
    <text className="fill-white font-mono" fontSize="15" fontWeight="600">
      <tspan ref={ref}>{v}</tspan>
      <tspan className="fill-white/50" fontSize="9" dx="3">{unit}</tspan>
    </text>
  );
}
function Sub({ text, warn }: { text: string; warn?: boolean }) {
  return (
    <text y={15} className={warn ? "fill-amber font-mono" : "fill-white/50 font-mono"} fontSize="8.5">{text}</text>
  );
}
