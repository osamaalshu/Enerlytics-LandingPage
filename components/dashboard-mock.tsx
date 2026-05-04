"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, TriangleAlert, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const W = 720;
const H = 220;
const POINTS = 24;
const TICK_MS = 1600;

const initialActual = [
  280, 290, 305, 295, 310, 340, 380, 430, 470, 510, 540, 560, 580, 590, 600,
  610, 590, 560, 520, 482, 450, 420, 390, 360,
];
const initialBaseline = [
  300, 305, 310, 315, 320, 330, 350, 380, 400, 420, 440, 460, 480, 490, 500,
  500, 490, 470, 450, 430, 410, 395, 380, 360,
];

function buildPath(series: number[], min: number, max: number) {
  const range = max - min || 1;
  const stepX = W / (series.length - 1);
  return series
    .map((v, i) => {
      const px = i * stepX;
      const py = H - ((v - min) / range) * H;
      return `${i === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`;
    })
    .join(" ");
}

function buildArea(series: number[], min: number, max: number) {
  return `${buildPath(series, min, max)} L ${W} ${H} L 0 ${H} Z`;
}

interface DashboardMockProps {
  className?: string;
  variant?: "hero" | "framed";
}

export function DashboardMock({ className, variant = "hero" }: DashboardMockProps) {
  const reduced = useReducedMotion();
  const [actual, setActual] = useState<number[]>(initialActual);
  const [baseline] = useState<number[]>(initialBaseline);
  const [warning, setWarning] = useState(true);
  const [efficiency, setEfficiency] = useState(95.2);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) return;
    const tick = () => {
      setActual((prev) => {
        const last = prev[prev.length - 1] ?? 480;
        const drift = (Math.random() - 0.5) * 28;
        const trend = Math.sin(Date.now() / 14000) * 6;
        const next = Math.max(260, Math.min(640, last + drift + trend));
        return [...prev.slice(1), next];
      });
      setEfficiency(94 + Math.sin(Date.now() / 9000) * 1.2);
    };
    tickRef.current = setInterval(tick, TICK_MS);
    const warnTimer = setInterval(() => setWarning((w) => !w), 5400);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      clearInterval(warnTimer);
    };
  }, [reduced]);

  // Domain — keep stable so the line breathes inside a fixed range.
  const min = 260;
  const max = 640;

  const actualPath = useMemo(() => buildPath(actual, min, max), [actual]);
  const baselinePath = useMemo(() => buildPath(baseline, min, max), [baseline]);
  const areaPath = useMemo(() => buildArea(actual, min, max), [actual]);

  const currentLoad = actual[actual.length - 1] ?? 480;
  const previous = actual[actual.length - 2] ?? currentLoad;
  const delta = ((currentLoad - previous) / Math.max(previous, 1)) * 100;
  const peakForecast = (Math.max(...actual) * 1.95) / 1000; // MW
  const surcharge = 60 + Math.round((Math.max(...actual) - 500) / 4);

  const dotX = (POINTS - 1) * (W / (POINTS - 1));
  const dotY = H - ((currentLoad - min) / (max - min)) * H;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0e1a44] via-[#0a1330] to-[#070d22] text-white shadow-[var(--shadow-soft)]",
        variant === "framed" && "ring-1 ring-navy/5",
        className,
      )}
    >
      {/* Top chrome */}
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] tracking-wide text-white/45">
            app.enerlytics.om/dashboard
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/70">
          <span className="relative flex h-1.5 w-1.5">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-green"
              animate={
                reduced
                  ? undefined
                  : { scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }
              }
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
          </span>
          LIVE
        </span>
      </div>

      <div className="space-y-5 p-5">
        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiTile
            label="Current load"
            value={currentLoad}
            decimals={0}
            unit="kW"
            delta={`${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`}
            deltaPositive={delta < 0}
            deltaUp={delta > 0}
          />
          <KpiTile
            label="Peak forecast"
            value={peakForecast}
            decimals={1}
            unit="MW"
            delta="in 15 min"
            deltaPositive={false}
            deltaUp
          />
          <KpiTile
            label="CRT surcharge"
            value={surcharge}
            decimals={0}
            unit="%"
            prefix="+"
            delta="vs baseline"
            deltaPositive={false}
            deltaUp
          />
          <KpiTile
            label="Efficiency"
            value={efficiency}
            decimals={1}
            unit="%"
            delta="1.8%"
            deltaPositive
            deltaUp
          />
        </div>

        {/* Chart card */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="eyebrow text-white/45">
                Real-time power · Actual vs Baseline
              </p>
              <p className="mt-1 text-[13px] text-white/65">
                Last 24 hours · TOU bands shown
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-full bg-blue" />
                Actual
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-px w-3 bg-white/40" />
                Baseline
              </span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-44 w-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* horizontal grid */}
            {[0.25, 0.5, 0.75].map((p) => (
              <line
                key={p}
                x1="0"
                x2={W}
                y1={H * p}
                y2={H * p}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="2 4"
              />
            ))}

            {/* peak window highlight */}
            <rect
              x={(W / 24) * 14}
              y="0"
              width={(W / 24) * 4}
              height={H}
              fill="rgba(245, 158, 11, 0.08)"
            />

            <motion.path
              d={areaPath}
              fill="url(#chartFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, d: areaPath }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d={baselinePath}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.25"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            <motion.path
              d={actualPath}
              fill="none"
              stroke="url(#chartStroke)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, d: actualPath }}
              transition={{
                pathLength: { duration: 1.4, ease: "easeOut" },
                d: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
              }}
            />

            {/* current point with breathing halo */}
            <motion.circle
              cx={dotX}
              cy={dotY}
              r={6}
              fill="#3b82f6"
              opacity="0.35"
              animate={
                reduced
                  ? { r: 6, opacity: 0.35 }
                  : { r: [6, 14, 6], opacity: [0.45, 0, 0.45] }
              }
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.circle
              cx={dotX}
              cy={dotY}
              r={4.5}
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
              animate={{ cx: dotX, cy: dotY }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </div>

        {/* Peak warning */}
        <AnimatePresence mode="wait" initial={false}>
          {warning ? (
            <motion.div
              key="warning"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/[0.08] p-4"
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/20 text-amber">
                <TriangleAlert size={16} />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-white">
                  Peak warning · CRT threshold exceeded
                </p>
                <p className="mt-0.5 text-[12px] text-white/65">
                  Predicted load exceeds contractual capacity in 15 minutes.
                </p>
              </div>
              <button
                type="button"
                className="hidden shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-navy hover:bg-white/90 sm:inline-flex"
              >
                <Zap size={12} /> Mitigate
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3 rounded-2xl border border-green/25 bg-green/[0.08] p-4"
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/20 text-green-soft">
                <Zap size={16} />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-white">
                  Mitigation applied · 312 kW shed
                </p>
                <p className="mt-0.5 text-[12px] text-white/65">
                  Load shifted from chiller bank A. CRT exposure resolved.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface KpiTileProps {
  label: string;
  value: number;
  decimals: number;
  unit: string;
  prefix?: string;
  delta: string;
  deltaPositive: boolean;
  deltaUp: boolean;
}

function KpiTile({
  label,
  value,
  decimals,
  unit,
  prefix,
  delta,
  deltaPositive,
  deltaUp,
}: KpiTileProps) {
  return (
    <motion.div
      layout
      className="rounded-2xl border border-white/8 bg-white/[0.04] p-4"
    >
      <p className="eyebrow text-white/45">{label}</p>
      <div className="mt-2 flex items-baseline gap-1.5">
        <SmoothNumber
          value={value}
          decimals={decimals}
          prefix={prefix}
          className="tabular text-[26px] font-bold leading-none"
        />
        <span className="text-xs font-medium text-white/55">{unit}</span>
      </div>
      <div
        className={cn(
          "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium",
          deltaPositive
            ? "bg-green/15 text-green-soft"
            : "bg-amber/15 text-amber",
        )}
      >
        {deltaUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
        {delta}
      </div>
    </motion.div>
  );
}

interface SmoothNumberProps {
  value: number;
  decimals: number;
  prefix?: string;
  className?: string;
}

/**
 * Smoothly tweens between numeric values. Used for live KPIs that update on
 * the dashboard tick — feels analog instead of teleporting.
 */
function SmoothNumber({ value, decimals, prefix, className }: SmoothNumberProps) {
  const [shown, setShown] = useState(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    let raf = 0;
    const start = shown;
    const target = value;
    const startTime = performance.now();
    const duration = 800;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(start + (target - start) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // we intentionally only re-run when target value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);

  return (
    <span className={className}>
      {prefix}
      {shown.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}
