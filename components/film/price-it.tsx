"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChapterMarker } from "@/components/film/chapter-marker";
import { InView } from "@/components/cinematic/in-view";
import { CountUp } from "@/components/cinematic/metric-overlay";

/**
 * IV · Price it — anomaly detection and predictive maintenance, in money.
 *
 * One drawing that quantifies the point: an asset's efficiency drifts away
 * from its own baseline; Enerlytics flags it in week 3; the amber area is
 * the money leaving every week the drift is ignored. Two numbers: what it
 * costs when caught early, what it costs when it is found at failure.
 * No ladder (that is the cycle's job), no photo (the chart is the picture).
 */
const WEEKS = 12;
const BASE = 100;
// efficiency index vs baseline, drifting down after week 2, collapsing at week 12
const EFF = [100, 99, 97, 95, 92, 90, 87, 84, 80, 76, 71, 62];
const OMR_PER_POINT_WEEK = 85; // illustrative: 1 % efficiency ≈ OMR 85 / week on this plant
const DETECT = 3; // week flagged
const cost = (upTo: number) => EFF.slice(0, upTo).reduce((a, e) => a + (BASE - e) * OMR_PER_POINT_WEEK, 0);
const EARLY = cost(DETECT);
const LATE = cost(WEEKS) + 6000; // + outage / emergency repair (illustrative)

const W = 760, H = 300, L = 44, R = 20, T = 18, B = 34;
const x = (w: number) => L + (w / (WEEKS - 1)) * (W - L - R);
const y = (e: number) => T + ((104 - e) / (104 - 60)) * (H - T - B);
const line = EFF.map((e, i) => `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(e).toFixed(1)}`).join(" ");
const area = `${line} L ${x(WEEKS - 1)} ${y(BASE)} L ${x(0)} ${y(BASE)} Z`;

function DriftChart() {
  const reduced = useReducedMotion();
  const vp = { once: true, amount: 0.3 } as const;
  return (
    <div className="rounded-2xl border border-white/10 bg-navy/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="instrument text-white/55">Cooling plant · efficiency vs its own baseline · 12 weeks</p>
        <p className="instrument text-[9px] text-white/40">Illustrative</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full" role="img"
        aria-label="Efficiency of a cooling plant drifting below its baseline over twelve weeks. Flagged in week three. The shaded area is the accumulating cost of the drift.">
        {[100, 90, 80, 70].map((e) => (
          <g key={e}>
            <line x1={L} x2={W - R} y1={y(e)} y2={y(e)} stroke="rgba(255,255,255,0.07)" />
            <text x={L - 8} y={y(e) + 3} textAnchor="end" className="fill-white/40 font-mono" fontSize="9">{e} %</text>
          </g>
        ))}
        {EFF.map((_, i) => (
          <text key={i} x={x(i)} y={H - 12} textAnchor="middle" className="fill-white/40 font-mono" fontSize="9">w{i + 1}</text>
        ))}
        {/* baseline band */}
        <rect x={L} y={y(101.5)} width={W - L - R} height={y(98.5) - y(101.5)} fill="rgba(255,255,255,0.06)" />
        <line x1={L} x2={W - R} y1={y(BASE)} y2={y(BASE)} stroke="rgba(255,255,255,0.55)" strokeDasharray="4 4" />
        <text x={W - R} y={y(BASE) - 6} textAnchor="end" className="fill-white/55 font-mono" fontSize="9" letterSpacing="0.1em">BASELINE · THIS PLANT, THIS CLIMATE</text>
        {/* money leaving */}
        <motion.path d={area} fill="#f59e0b" initial={{ opacity: reduced ? 0.22 : 0 }} whileInView={{ opacity: 0.22 }} viewport={vp} transition={{ duration: reduced ? 0 : 1.2, delay: 0.8 }} />
        <motion.path d={line} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduced ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={vp} transition={{ duration: reduced ? 0 : 2, ease: [0.4, 0, 0.2, 1] }} />
        {/* detection */}
        <motion.g initial={{ opacity: reduced ? 1 : 0 }} whileInView={{ opacity: 1 }} viewport={vp} transition={{ delay: reduced ? 0 : 0.6, duration: 0.4 }}>
          <line x1={x(DETECT - 1)} x2={x(DETECT - 1)} y1={T} y2={H - B} stroke="#ef4444" strokeWidth={1.25} />
          <circle cx={x(DETECT - 1)} cy={y(EFF[DETECT - 1])} r={5} fill="#ef4444" stroke="#06090f" strokeWidth={2} />
          <rect x={x(DETECT - 1) + 8} y={T + 2} width={196} height={30} rx={6} fill="#06090f" stroke="rgba(239,68,68,0.5)" />
          <text x={x(DETECT - 1) + 16} y={T + 14} className="fill-state-fault font-mono" fontSize="9" letterSpacing="0.12em">FLAGGED · WEEK {DETECT}</text>
          <text x={x(DETECT - 1) + 16} y={T + 26} className="fill-white/70 font-mono" fontSize="9">3 % below its curve · cause graded</text>
        </motion.g>
        {/* failure */}
        <motion.g initial={{ opacity: reduced ? 1 : 0 }} whileInView={{ opacity: 1 }} viewport={vp} transition={{ delay: reduced ? 0 : 2, duration: 0.4 }}>
          <circle cx={x(WEEKS - 1)} cy={y(EFF[WEEKS - 1])} r={5} fill="#ef4444" opacity={0.5} stroke="#06090f" strokeWidth={2} />
          <text x={x(WEEKS - 1) - 8} y={y(EFF[WEEKS - 1]) + 4} textAnchor="end" className="fill-white/55 font-mono" fontSize="9" letterSpacing="0.1em">FAILURE · OUTAGE</text>
        </motion.g>
        <text x={x(6)} y={y(93)} textAnchor="middle" className="fill-amber font-mono" fontSize="10" letterSpacing="0.14em">MONEY LEAVING</text>
      </svg>
    </div>
  );
}

export function PriceIt() {
  return (
    <>
      <ChapterMarker id="price" numeral="IV" title="Price it." line="Anomaly detection and predictive maintenance — measured in rials, not alerts." />
      <section className="relative bg-ink pb-24 text-white sm:pb-32" aria-labelledby="price-title">
        <div className="container-narrow">
          <InView className="max-w-3xl">
            <h3 id="price-title" className="text-balance text-[40px] font-black leading-[0.94] tracking-[-0.04em] sm:text-[56px] lg:text-[72px]">
              Every week a fault goes unseen, it costs more than the week before.
            </h3>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/68">
              Equipment rarely breaks. It drifts. Enerlytics knows each asset&apos;s own normal, sees the drift
              in the first weeks, names the likely cause, and prices it at your tariff — so the fix is a
              decision, not a surprise.
            </p>
          </InView>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
            <InView><DriftChart /></InView>
            <InView delay={0.1} className="flex flex-col gap-3">
              <div className="flex-1 rounded-2xl border border-amber/25 bg-navy/50 p-5">
                <p className="instrument text-white/55">Caught in week {DETECT}</p>
                <p className="tabular mt-2 font-mono text-[40px] font-semibold leading-none text-amber">OMR <CountUp to={EARLY} /></p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/60">lost before the fix — then the plant is back on its curve, verified.</p>
              </div>
              <div className="flex-1 rounded-2xl border border-white/10 bg-navy/50 p-5">
                <p className="instrument text-white/55">Found at failure · week {WEEKS}</p>
                <p className="tabular mt-2 font-mono text-[40px] font-semibold leading-none text-white/85">OMR <CountUp to={LATE} /></p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/60">in waste, emergency repair and an outage nobody planned for.</p>
              </div>
              <p className="instrument text-[9px] text-white/40">Illustrative case · the method is real · findings graded by confidence</p>
            </InView>
          </div>
        </div>
      </section>
    </>
  );
}
