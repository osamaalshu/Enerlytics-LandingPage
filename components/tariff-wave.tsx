"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The signature element: an *interactive* 24-hour building-load instrument.
 *
 * One curve. The visitor drags the slider from "Unmanaged" → "With Enerlytics"
 * and watches the costly evening peak melt down in real time — the line recolors
 * blue → green, the savings bracket grows, and the headline number ticks toward
 * −31%. Moving the pointer across the chart scrubs any hour and reads out its
 * load, like a real dashboard. The visitor performs the product's whole value
 * with their own hand. Data is an illustrative reference curve, not a customer
 * figure.
 */

const W = 880;
const H = 320;
const PAD_X = 30;
const PAD_TOP = 44;
const PAD_BOTTOM = 40;
const PLOT_W = W - PAD_X * 2;
const PLOT_H = H - PAD_TOP - PAD_BOTTOM;

// Hourly, normalised 0..1. Institutional building: quiet overnight, morning
// ramp, midday plateau, sharp evening occupancy + cooling peak, then decline.
const RAW = [
  0.3, 0.27, 0.25, 0.24, 0.26, 0.32, 0.45, 0.58, 0.66, 0.7, 0.72, 0.74, 0.73,
  0.71, 0.7, 0.72, 0.8, 0.9, 0.97, 0.93, 0.82, 0.66, 0.5, 0.38,
];
// Same building under Enerlytics: pre-cooling + load-shifting shaves the peak.
const OPT = [
  0.3, 0.28, 0.26, 0.25, 0.27, 0.35, 0.49, 0.6, 0.66, 0.69, 0.7, 0.71, 0.7,
  0.69, 0.68, 0.68, 0.69, 0.69, 0.67, 0.66, 0.63, 0.56, 0.46, 0.37,
];

const N = RAW.length;
const PEAK_START = 16; // 16:00
const PEAK_END = 21; //   21:00
const PEAK_HOUR = 18; // sharpest point of the unmanaged peak

const px = (i: number) => PAD_X + (i / (N - 1)) * PLOT_W;
const py = (v: number) => PAD_TOP + (1 - v) * PLOT_H;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Catmull-Rom → cubic bezier for a smooth, deterministic path. */
function smooth(values: number[]) {
  const pts = values.map((v, i) => ({ x: px(i), y: py(v) }));
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

const peakX1 = px(PEAK_START);
const peakX2 = px(PEAK_END);
const baseY = PAD_TOP + PLOT_H;

const TICKS = [
  { i: 0, label: "00" },
  { i: 6, label: "06" },
  { i: 12, label: "12" },
  { i: 18, label: "18" },
  { i: 23, label: "24" },
];

export function TariffWave() {
  const reduce = useReducedMotion();
  // t = 0 → unmanaged, t = 1 → fully optimised. Visitor controls this.
  const [t, setT] = useState(0);
  const [touched, setTouched] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // One-time auto-demo: flatten the peak on its own, then hand control over.
  useEffect(() => {
    if (reduce) {
      setT(1);
      return;
    }
    if (touched) return;
    let raf = 0;
    let start = 0;
    const dur = 1900;
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / dur, 1);
      setT(ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const hold = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 450);
    return () => {
      clearTimeout(hold);
      cancelAnimationFrame(raf);
    };
  }, [reduce, touched]);

  const cur = RAW.map((v, i) => lerp(v, OPT[i], t));
  const linePath = smooth(cur);
  const areaPath = `${linePath} L ${px(N - 1).toFixed(2)} ${baseY.toFixed(2)} L ${PAD_X.toFixed(2)} ${baseY.toFixed(2)} Z`;
  const pct = Math.round(((RAW[PEAK_HOUR] - cur[PEAK_HOUR]) / RAW[PEAK_HOUR]) * 100);

  const bracketTop = py(RAW[PEAK_HOUR]);
  const bracketBottom = py(cur[PEAK_HOUR]);
  const bracketX = px(PEAK_HOUR);
  const showBracket = bracketBottom - bracketTop > 6;

  const handlePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const vx = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((vx - PAD_X) / PLOT_W) * (N - 1));
    setHover(Math.max(0, Math.min(N - 1, idx)));
  };

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label="Interactive 24-hour building load. Unmanaged it spikes into the costly evening peak; with Enerlytics the peak flattens by about 31 percent."
        preserveAspectRatio="xMidYMid meet"
        onPointerMove={handlePointer}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="tw-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t > 0.5 ? "#22c55e" : "#3b82f6"} stopOpacity="0.26" />
            <stop offset="100%" stopColor={t > 0.5 ? "#22c55e" : "#3b82f6"} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tw-peakband" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* baseline grid */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={py(g)}
            y2={py(g)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* peak window band — danger fades as the peak is flattened */}
        <rect
          x={peakX1}
          y={PAD_TOP}
          width={peakX2 - peakX1}
          height={PLOT_H}
          fill="url(#tw-peakband)"
          opacity={0.35 + 0.65 * (1 - t)}
        />
        <text
          x={(peakX1 + peakX2) / 2}
          y={PAD_TOP - 14}
          textAnchor="middle"
          className="fill-amber font-mono"
          fontSize="10.5"
          letterSpacing="2"
          opacity={0.45 + 0.55 * (1 - t)}
        >
          PEAK HOURS · 16–21
        </text>

        {/* filled area under the live curve */}
        <path d={areaPath} fill="url(#tw-area)" />

        {/* the live curve — crossfades blue (unmanaged) → green (optimised) */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" opacity={1 - t} />
        <path d={linePath} fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" opacity={t} />

        {/* ghost of the original unmanaged peak, for reference */}
        <path d={smooth(RAW)} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.25} strokeDasharray="3 5" opacity={0.5 * t} />

        {/* savings bracket: the demand removed at the peak */}
        {showBracket && (
          <g>
            <line x1={bracketX} x2={bracketX} y1={bracketTop} y2={bracketBottom} stroke="#22c55e" strokeWidth={1.5} />
            <line x1={bracketX - 5} x2={bracketX + 5} y1={bracketTop} y2={bracketTop} stroke="#22c55e" strokeWidth={1.5} />
            <line x1={bracketX - 5} x2={bracketX + 5} y1={bracketBottom} y2={bracketBottom} stroke="#22c55e" strokeWidth={1.5} />
            <text
              x={bracketX - 12}
              y={(bracketTop + bracketBottom) / 2 + 5}
              textAnchor="end"
              className="fill-green-soft font-mono"
              fontSize="15"
              fontWeight="600"
            >
              −{pct}%
            </text>
          </g>
        )}

        {/* hover scrubber */}
        {hover !== null && (
          <g>
            <line x1={px(hover)} x2={px(hover)} y1={PAD_TOP} y2={baseY} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
            <circle cx={px(hover)} cy={py(cur[hover])} r={4} fill={t > 0.5 ? "#22c55e" : "#3b82f6"} stroke="#0a1330" strokeWidth={2} />
            <g transform={`translate(${Math.min(px(hover), W - 96)}, ${PAD_TOP + 2})`}>
              <rect width="92" height="34" rx="7" fill="#0a1330" stroke="rgba(255,255,255,0.14)" />
              <text x="10" y="14" className="fill-white/55 font-mono" fontSize="9" letterSpacing="0.5">
                {String(hover).padStart(2, "0")}:00
              </text>
              <text x="10" y="27" className="fill-white font-mono" fontSize="11" fontWeight="600">
                {Math.round(cur[hover] * 100)}% load
              </text>
            </g>
          </g>
        )}

        {/* hour axis */}
        {TICKS.map((tk) => (
          <text key={tk.i} x={px(tk.i)} y={H - 22} textAnchor="middle" className="fill-white/35 font-mono" fontSize="10">
            {tk.label}
          </text>
        ))}
      </svg>

      {/* The control: visitor flattens the peak themselves. */}
      <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-5">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] tracking-[0.12em] text-white/45">
            <span>UNMANAGED</span>
            <span className="text-green-soft/80">WITH ENERLYTICS</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(t * 100)}
            onChange={(e) => {
              setTouched(true);
              setT(Number(e.target.value) / 100);
            }}
            aria-label="Flatten the evening peak: drag from unmanaged to with Enerlytics"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-green-soft outline-none focus-visible:ring-2 focus-visible:ring-green-soft/60"
            style={{
              background: `linear-gradient(to right, var(--color-green-soft) 0%, var(--color-green-soft) ${t * 100}%, rgba(255,255,255,0.15) ${t * 100}%, rgba(255,255,255,0.15) 100%)`,
            }}
          />
          <p className="mt-2.5 font-mono text-[11px] text-white/40">
            ⇠ drag to flatten the evening peak
          </p>
        </div>

        <div className="shrink-0 border-white/10 sm:border-l sm:pl-6">
          <div className="font-mono text-[10px] tracking-[0.14em] text-white/45">
            PEAK DEMAND
          </div>
          <div className="tabular bg-gradient-to-r from-green-soft to-green bg-clip-text font-mono text-4xl font-bold leading-none text-transparent">
            −{pct}%
          </div>
        </div>
      </div>
    </div>
  );
}
