"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, TriangleAlert } from "lucide-react";

/**
 * The hero's signature: a live cost monitor that combines the original
 * dashboard's substance (peak demand, peak forecast, CRT surcharge %, baseline
 * vs actual, peak alert) with a calm, always-moving live feed. The visitor sees
 * their building spending in real OMR while a streaming load line tracks against
 * its expected baseline and the tariff flips between off-peak and the costly
 * evening peak.
 *
 * Figures are an illustrative live simulation, not a real meter. The chart
 * updates via direct DOM writes in one rAF loop (no per-frame React renders);
 * KPIs refresh on a calm 2.2s cadence; the first frame is deterministic so SSR
 * matches the client.
 */

const W = 860;
const H = 132;
const TOP = 14;
const BOT = 14;
const WIN = 64;
const DX = 0.22;
const PLOT_H = H - TOP - BOT;
const SCROLL = 0.0065; // calm scroll speed
const COST_ACCEL = 0.25; // calm OMR ticking

function wave(i: number) {
  const v =
    0.55 +
    0.18 * Math.sin(i * 0.2) +
    0.1 * Math.sin(i * 0.53 + 1.3) +
    0.07 * Math.sin(i * 0.11 + 0.5) +
    0.045 * Math.sin(i * 1.6 + 2.1);
  return Math.max(0.12, Math.min(0.98, v));
}
// Expected baseline: flatter, calmer reference the actual is measured against.
function baseWave(i: number) {
  return Math.max(0.2, Math.min(0.85, 0.5 + 0.09 * Math.sin(i * 0.18 + 0.4) + 0.04 * Math.sin(i * 0.4)));
}

const cx = (k: number) => (k / (WIN - 1)) * W;
const cy = (v: number) => TOP + (1 - v) * PLOT_H;
const toKw = (v: number) => Math.round(360 + v * 220);

function pts(off: number, fn: (i: number) => number) {
  const a: { x: number; y: number; v: number }[] = [];
  for (let k = 0; k < WIN; k++) {
    const v = fn(off + k * DX);
    a.push({ x: cx(k), y: cy(v), v });
  }
  return a;
}
function line(p: { x: number; y: number }[]) {
  let d = `M ${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    d += ` C ${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)}, ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}
const area = (d: string) => `${d} L ${W} ${H - BOT} L 0 ${H - BOT} Z`;

const I_ACT = pts(0, wave);
const I_BASE = pts(0, baseWave);
const I_LINE = line(I_ACT);
const I_AREA = area(I_LINE);
const I_BASELINE = line(I_BASE);
const I_LAST = I_ACT[WIN - 1];

const fmt2 = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function LiveDashboard() {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);
  const costRef = useRef<HTMLSpanElement>(null);
  const kwRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  const [peak, setPeak] = useState(false);
  const [hover, setHover] = useState<{ x: number; y: number; v: number } | null>(null);
  const [kpi, setKpi] = useState({ peakKw: 540, forecast: 1.06, surcharge: 16, baseKw: 430 });
  const st = useRef({ off: 0, cost: 1284, paused: false, peak: false, kw: I_LAST.v, peakKw: toKw(I_LAST.v) });

  // One rAF loop: scroll the feed, redraw, accrue cost.
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const s = st.current;
      if (!s.paused) s.off += dt * SCROLL;
      const act = pts(s.off, wave);
      const d = line(act);
      lineRef.current?.setAttribute("d", d);
      areaRef.current?.setAttribute("d", area(d));
      baseRef.current?.setAttribute("d", line(pts(s.off, baseWave)));
      const lp = act[WIN - 1];
      dotRef.current?.setAttribute("cx", lp.x.toFixed(1));
      dotRef.current?.setAttribute("cy", lp.y.toFixed(1));
      haloRef.current?.setAttribute("cx", lp.x.toFixed(1));
      haloRef.current?.setAttribute("cy", lp.y.toFixed(1));
      const kw = toKw(lp.v);
      s.kw = lp.v;
      s.peakKw = Math.max(s.peakKw, kw);
      if (kwRef.current) kwRef.current.textContent = String(kw);
      const rate = s.peak ? 0.067 : 0.022;
      s.cost += kw * rate * (dt / 1000) * COST_ACCEL;
      if (costRef.current) costRef.current.textContent = fmt2(s.cost);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  // Clock, KPI refresh, and the slow peak/off-peak cycle.
  useEffect(() => {
    const clock = () => {
      if (clockRef.current)
        clockRef.current.textContent = new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
    };
    const refresh = () => {
      const s = st.current;
      const winMax = Math.max(...pts(s.off, wave).map((p) => p.v));
      const baseKw = toKw(baseWave(s.off + (WIN - 1) * DX));
      const kw = toKw(s.kw);
      setKpi({
        peakKw: s.peakKw,
        forecast: Math.round((winMax * 220 + 360) * 1.9) / 1000,
        surcharge: Math.max(0, Math.round(((kw - baseKw) / baseKw) * 100)),
        baseKw,
      });
    };
    clock();
    refresh();
    const c = setInterval(clock, 1000);
    const k = setInterval(refresh, 2200);
    const p = setInterval(() => {
      setPeak((prev) => {
        const next = !prev;
        st.current.peak = next;
        return next;
      });
    }, 13000);
    return () => {
      clearInterval(c);
      clearInterval(k);
      clearInterval(p);
    };
  }, []);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const vx = ((e.clientX - rect.left) / rect.width) * W;
    const k = Math.max(0, Math.min(WIN - 1, Math.round((vx / W) * (WIN - 1))));
    st.current.paused = true;
    const p = pts(st.current.off, wave)[k];
    setHover({ x: p.x, y: p.y, v: p.v });
  };
  const onLeave = () => {
    st.current.paused = false;
    setHover(null);
  };

  const accent = peak ? "#f59e0b" : "#22c55e";

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[var(--shadow-soft)] backdrop-blur">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
        <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-white/60">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-soft opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-soft" />
          </span>
          YOUR BUILDING · LIVE
          <span ref={clockRef} className="ml-1 hidden text-white/35 sm:inline">--:--:--</span>
        </span>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] transition-colors ${
            peak ? "border-amber/40 bg-amber/10 text-amber" : "border-green-soft/30 bg-green-soft/10 text-green-soft"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${peak ? "bg-amber" : "bg-green-soft"}`} />
          {peak ? "PEAK RATE · 0.067" : "OFF-PEAK · 0.022"} <span className="text-white/40">OMR/kWh</span>
        </span>
      </div>

      {/* hero metric */}
      <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] text-white/45">SPENT ON POWER TODAY</div>
          <div className="tabular mt-1 font-mono text-3xl font-bold leading-none text-white sm:text-[40px]">
            <span className="text-white/45">OMR </span>
            <span ref={costRef}>{fmt2(1284)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] tracking-[0.16em] text-white/45">LOAD NOW</div>
          <div className="tabular mt-1 font-mono text-2xl font-semibold leading-none" style={{ color: accent }}>
            <span ref={kwRef}>{toKw(I_LAST.v)}</span>
            <span className="ml-1 text-sm font-medium text-white/45">kW</span>
          </div>
        </div>
      </div>

      {/* KPI grid — the substance from the original */}
      <div className="mt-4 grid grid-cols-2 gap-px border-y border-white/8 bg-white/8 sm:grid-cols-4">
        <Kpi label="PEAK DEMAND" value={`${kpi.peakKw}`} unit="kW" note="today" />
        <Kpi label="PEAK FORECAST" value={kpi.forecast.toFixed(2)} unit="MW" note="next 15 min" up />
        <Kpi label="CRT SURCHARGE" value={`+${kpi.surcharge}`} unit="%" note="vs baseline" tone={peak ? "amber" : "muted"} up />
        <Kpi label="BASELINE" value={`${kpi.baseKw}`} unit="kW" note="expected" />
      </div>

      {/* streaming chart: actual vs baseline */}
      <div className="px-2 pb-1 pt-3 sm:px-3">
        <div className="mb-1.5 flex items-center justify-end gap-4 px-2 font-mono text-[10px] text-white/45">
          <span className="flex items-center gap-1.5"><span className="h-[3px] w-3 rounded-full" style={{ background: accent }} />Actual</span>
          <span className="flex items-center gap-1.5"><span className="h-px w-3 bg-white/40" />Baseline</span>
        </div>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-none"
          preserveAspectRatio="none"
          role="img"
          aria-label="Live stream of building load against its expected baseline."
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <defs>
            <linearGradient id="ld-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.26" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          {peak && <rect x={0} y={0} width={W} height={H} fill="#f59e0b" opacity={0.05} />}
          {[0.33, 0.66].map((g) => (
            <line key={g} x1={0} x2={W} y1={cy(g)} y2={cy(g)} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 5" />
          ))}
          <path ref={areaRef} d={I_AREA} fill="url(#ld-area)" />
          <path ref={baseRef} d={I_BASELINE} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.25} strokeDasharray="4 4" />
          <path ref={lineRef} d={I_LINE} fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <circle ref={haloRef} cx={I_LAST.x} cy={I_LAST.y} r={9} fill={accent} opacity={0.18} />
          <circle ref={dotRef} cx={I_LAST.x} cy={I_LAST.y} r={4} fill={accent} stroke="#0a1330" strokeWidth={2} />
          {hover && (
            <g>
              <line x1={hover.x} x2={hover.x} y1={TOP} y2={H - BOT} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
              <circle cx={hover.x} cy={hover.y} r={4} fill="#fff" />
              <g transform={`translate(${Math.min(Math.max(hover.x - 38, 2), W - 78)}, 2)`}>
                <rect width="76" height="20" rx="6" fill="#0a1330" stroke="rgba(255,255,255,0.16)" />
                <text x="38" y="14" textAnchor="middle" className="fill-white font-mono" fontSize="11" fontWeight="600">
                  {toKw(hover.v)} kW
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* peak alert strip — syncs with the tariff state */}
      <div
        className={`flex items-center gap-3 border-t px-5 py-3 transition-colors ${
          peak ? "border-amber/20 bg-amber/[0.06]" : "border-green/20 bg-green/[0.06]"
        }`}
      >
        <span
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            peak ? "bg-amber/20 text-amber" : "bg-green/20 text-green-soft"
          }`}
        >
          {peak ? <TriangleAlert size={14} /> : <ShieldCheck size={14} />}
        </span>
        <p className="text-[12.5px] leading-tight text-white/80">
          {peak ? (
            <>
              <span className="font-semibold text-white">Peak warning · CRT threshold approaching.</span> Forecast load exceeds your baseline — shift now to avoid the surcharge.
            </>
          ) : (
            <>
              <span className="font-semibold text-white">Mitigation applied · 312 kW shed.</span> Load shifted off the evening peak. Surcharge exposure resolved.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  unit,
  note,
  up,
  tone = "default",
}: {
  label: string;
  value: string;
  unit: string;
  note: string;
  up?: boolean;
  tone?: "default" | "amber" | "muted";
}) {
  const valColor = tone === "amber" ? "text-amber" : "text-white";
  return (
    <div className="bg-navy px-4 py-3">
      <div className="font-mono text-[9.5px] tracking-[0.12em] text-white/40">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`tabular font-mono text-xl font-semibold ${valColor}`}>{value}</span>
        <span className="text-[11px] font-medium text-white/45">{unit}</span>
      </div>
      <div className="mt-1 flex items-center gap-1 font-mono text-[9.5px] text-white/40">
        {up && <ArrowUpRight size={10} className={tone === "amber" ? "text-amber" : "text-white/40"} />}
        {note}
      </div>
    </div>
  );
}
