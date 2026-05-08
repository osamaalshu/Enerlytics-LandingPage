"use client";

import { animate, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ReceiptText, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const billRows = [
  {
    month: "Jun",
    kwh: 32384,
    energy: 970.83,
    capacity: 431.08,
    supply: 4.17,
    vat: 70.3,
    total: 1476.37,
    rate: [0.026, 0.024, 0.006, 0.019, 0.017, 0.028, 0.031, 0.021],
    peak: { coincident: 580, nonCoincident: 640 },
    detail: ["OP: 22,419 kWh · 538.05 OMR", "NP: 3,412 kWh · 174.03 OMR", "WDP: 5,311 kWh · 217.74 OMR", "DC: 311 kW · DNC: 364 kW"],
  },
  {
    month: "Jul",
    kwh: 34733,
    energy: 996.2,
    capacity: 546.46,
    supply: 4.17,
    vat: 77.34,
    total: 1624.17,
    rate: [0.021, 0.024, 0.022, 0.018, 0.025, 0.029, 0.027, 0.019],
    peak: { coincident: 635, nonCoincident: 710 },
    detail: ["OP: 24,918 kWh · 571.42 OMR", "NP: 3,866 kWh · 197.18 OMR", "WDP: 5,949 kWh · 227.60 OMR", "CPR: 214.31 · NCPR: 61.22"],
  },
  {
    month: "Aug",
    kwh: 5679,
    energy: 127.81,
    capacity: 665.54,
    supply: 4.17,
    vat: 39.88,
    total: 837.39,
    rate: [0.018, 0.017, 0.02, 0.023, 0.027, 0.032, 0.03, 0.026],
    peak: { coincident: 710, nonCoincident: 760 },
    detail: ["OP: 3,822 kWh · 82.14 OMR", "NP: 610 kWh · 28.73 OMR", "WDP: 1,247 kWh · 16.94 OMR", "DC: 402 kW · DNC: 401 kW"],
  },
  {
    month: "Sep",
    kwh: 78624,
    energy: 1951.09,
    capacity: 528.04,
    supply: 4.17,
    vat: 124.07,
    total: 2606.39,
    rate: [0.019, 0.021, 0.024, 0.028, 0.025, 0.022, 0.02, 0.023],
    peak: { coincident: 560, nonCoincident: 600 },
    detail: ["OP: 51,205 kWh · 1,081.62 OMR", "NP: 12,009 kWh · 386.84 OMR", "WDP: 15,410 kWh · 482.63 OMR", "CGR: 175.76"],
  },
  {
    month: "Oct",
    kwh: 162670,
    energy: 2765.39,
    capacity: 847.58,
    supply: 4.17,
    vat: 180.86,
    total: 3797.99,
    rate: [0.022, 0.024, 0.029, 0.031, 0.026, 0.025, 0.023, 0.028],
    peak: { coincident: 930, nonCoincident: 820 },
    detail: ["OP: 98,420 kWh · 1,656.40 OMR", "NP: 28,114 kWh · 602.01 OMR", "WDP: 36,136 kWh · 506.98 OMR", "DC: 611 kW · DNC: 590 kW"],
  },
  {
    month: "Nov",
    kwh: 148799,
    energy: 2529.58,
    capacity: 772.49,
    supply: 4.17,
    vat: 170.31,
    total: 3576.54,
    rate: [0.02, 0.019, 0.021, 0.024, 0.027, 0.026, 0.022, 0.025],
    peak: { coincident: 820, nonCoincident: 700 },
    detail: ["OP: 92,006 kWh · 1,524.11 OMR", "NP: 24,081 kWh · 516.34 OMR", "WDP: 32,712 kWh · 489.13 OMR", "CPR: 199.53 · NCPR: 55.78"],
  },
];

function format(value: number, decimals = 0) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function buildRatePath(points: number[]) {
  const w = 620;
  const h = 116;
  const min = 0.004;
  const max = 0.034;

  return points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * w;
      const y = h - ((value - min) / (max - min)) * h;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function TariffBreakdownMock({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(1);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected = billRows[selectedIndex];
  const ratePath = useMemo(() => buildRatePath(selected.rate), [selected]);
  const visibleBars = useMemo(() => {
    const start = Math.max(0, Math.min(selectedIndex - 1, billRows.length - 4));
    return billRows.slice(start, start + 4);
  }, [selectedIndex]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setSelectedIndex((current) => (current + 1) % billRows.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    const container = detailsRef.current;
    const row = rowRefs.current[selectedIndex];

    if (!container || !row) return;

    container.scrollTo({
      top: row.offsetTop - 32,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [selectedIndex, reduced]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0e1a44] via-[#0a1330] to-[#070d22] text-white shadow-[var(--shadow-soft)] ring-1 ring-navy/5",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 hidden text-[11px] tracking-wide text-white/45 sm:inline">
            app.enerlytics.om/tariffs
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green/10 px-2.5 py-1 text-[10px] font-semibold text-green-soft">
          <span className="relative flex h-1.5 w-1.5">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-green"
              animate={reduced ? undefined : { scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
          </span>
          live bill feed
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
          <Metric label="Period" textValue={selected.month} />
          <Metric label="Energy cost" value={selected.energy} suffix="OMR" decimals={2} />
          <Metric label="Capacity" value={selected.capacity} suffix="OMR" decimals={2} tone="blue" />
          <Metric label="Supply + VAT" value={selected.supply + selected.vat} suffix="OMR" decimals={2} tone="amber" />
          <Metric label="Total bill" value={selected.total} suffix="OMR" decimals={2} strong />
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold tracking-tight">Effective tariff rate</p>
                <p className="mt-1 text-[11.5px] text-white/50">OMR / kWh, selected month</p>
              </div>
              <span className="rounded-full bg-amber/12 px-2 py-1 text-[10px] font-semibold text-amber">
                {selected.month}
              </span>
            </div>
            <svg viewBox="0 0 620 136" className="h-30 w-full" preserveAspectRatio="none" aria-hidden>
              {[0.25, 0.5, 0.75].map((line) => (
                <line
                  key={line}
                  x1="0"
                  x2="620"
                  y1={line * 116 + 8}
                  y2={line * 116 + 8}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="2 4"
                />
              ))}
              <motion.path
                key={selected.month}
                d={ratePath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0.65 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.85, ease: "easeOut" }}
                transform="translate(0 8)"
              />
              {selected.rate.map((value, pointIndex) => {
                const x = (pointIndex / (selected.rate.length - 1)) * 620;
                const y = 116 - ((value - 0.004) / (0.034 - 0.004)) * 116 + 8;
                return <circle key={pointIndex} cx={x} cy={y} r="2.5" fill="#f59e0b" opacity="0.9" />;
              })}
            </svg>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold tracking-tight">Monthly peak demand</p>
                <p className="mt-1 text-[11.5px] text-white/50">Coincident vs non-coincident</p>
              </div>
              <span className="rounded-full bg-blue/12 px-2 py-1 text-[10px] font-semibold text-blue-fg">
                Live
              </span>
            </div>
            <div className="flex h-30 items-end gap-3 px-1">
              {visibleBars.map((bar) => {
                const max = 1800;
                const active = bar.month === selected.month;
                return (
                  <button
                    key={bar.month}
                    type="button"
                    onClick={() => setSelectedIndex(billRows.findIndex((item) => item.month === bar.month))}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className={cn("flex h-24 w-full max-w-14 flex-col justify-end overflow-hidden rounded-t-xl bg-white/8 transition", active && "ring-2 ring-amber/40")}>
                      <motion.div
                        className="bg-indigo-400/90"
                        initial={false}
                        animate={{ height: `${(bar.peak.nonCoincident / max) * 100}%` }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                      />
                      <motion.div
                        className="bg-cyan-400/90"
                        initial={false}
                        animate={{ height: `${(bar.peak.coincident / max) * 100}%` }}
                        transition={{ duration: 0.65, delay: 0.05, ease: "easeOut" }}
                      />
                    </div>
                    <span className={cn("text-[10px]", active ? "text-amber" : "text-white/45")}>{bar.month}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold tracking-tight">Bill details</p>
                <p className="mt-1 text-[11.5px] text-white/50">Auto-scrolls. Click a month to inspect.</p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full bg-amber/12 px-2.5 py-1 text-[10px] font-semibold text-amber sm:inline-flex">
                <TriangleAlert size={12} />
                {selected.month} selected
              </span>
            </div>

            <div
              ref={detailsRef}
              className="max-h-[150px] overflow-auto rounded-xl border border-white/8 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent]"
            >
              <div className="sticky top-0 z-10 grid grid-cols-[0.8fr_1fr_1fr_1fr_1fr] bg-[#172144] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/38">
                <span>Month</span>
                <span>kWh</span>
                <span>Energy</span>
                <span>Capacity</span>
                <span className="text-right">Total</span>
              </div>
              {billRows.map((row, rowIndex) => (
                <button
                  key={row.month}
                  ref={(node) => {
                    rowRefs.current[rowIndex] = node;
                  }}
                  type="button"
                  onClick={() => setSelectedIndex(rowIndex)}
                  className={cn(
                    "grid w-full grid-cols-[0.8fr_1fr_1fr_1fr_1fr] border-t border-white/8 px-3 py-2.5 text-left text-[11px] transition",
                    rowIndex === selectedIndex ? "bg-amber/[0.1] text-white" : "text-white/62 hover:bg-white/[0.04]",
                  )}
                >
                  <span className="font-semibold">{row.month}</span>
                  <span className="tabular">{format(row.kwh)}</span>
                  <span className="tabular text-green-soft">{format(row.energy, 2)}</span>
                  <span className="tabular text-blue-fg">{format(row.capacity, 2)}</span>
                  <span className="tabular text-right font-semibold">{format(row.total, 2)}</span>
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={selected.month}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5"
          >
            <p className="text-[13px] font-semibold tracking-tight">{selected.month} tariff lines</p>
            <div className="mt-3 space-y-2 border-t border-white/8 pt-3">
              {selected.detail.map((line) => (
                <p key={line} className="text-[11.5px] leading-snug text-white/62">
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/[0.08] p-3.5">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/20 text-amber">
            <ReceiptText size={16} />
          </span>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-white">
              Tariff insight · {selected.month} capacity charge selected
            </p>
            <p className="mt-0.5 text-[12px] text-white/65">
              Month-by-month charges animate into view so finance and operations can trace what changed.
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-navy sm:inline-flex">
            <ArrowUpRight size={12} />
            Explain
          </span>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  textValue,
  suffix,
  tone = "white",
  decimals = 0,
  strong = false,
}: {
  label: string;
  value?: number;
  textValue?: string;
  suffix?: string;
  tone?: "white" | "blue" | "amber";
  decimals?: number;
  strong?: boolean;
}) {
  const color =
    tone === "blue" ? "text-blue-fg" : tone === "amber" ? "text-amber" : "text-white";

  return (
    <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.04] p-3.5">
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-white/38">
        {label}
      </p>
      <div className="mt-2 flex min-w-0 items-baseline gap-1.5">
        {typeof value === "number" ? (
          <AnimatedMetric
            value={value}
            decimals={decimals}
            className={cn("tabular text-[17px] font-bold leading-none", color, strong && "text-[19px]")}
          />
        ) : (
          <motion.span
            key={textValue}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className={cn("tabular text-[17px] font-bold leading-none", color, strong && "text-[19px]")}
          >
            {textValue}
          </motion.span>
        )}
        {suffix && <span className="shrink-0 text-[9px] font-semibold text-white/45">{suffix}</span>}
      </div>
    </div>
  );
}

function AnimatedMetric({
  value,
  decimals,
  className,
}: {
  value: number;
  decimals: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }

    const controls = animate(shown, value, {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setShown,
    });

    return controls.stop;
    // Use the previous rendered value as animation origin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);

  return <span className={className}>{format(shown, decimals)}</span>;
}
