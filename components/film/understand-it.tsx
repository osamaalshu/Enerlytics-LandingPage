"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChapterMarker } from "@/components/film/chapter-marker";
import { PlateStory, Statement } from "@/components/film/plate-story";

/**
 * III · Understand it — it knows what normal looks like.
 * One drawing: expected vs actual across a facility-day, the tariff window
 * shaded (amber, because it is money). Then the cycle — the company's
 * operating model — as six words and one sentence, not six cards.
 */
const BASE = [380, 370, 360, 355, 360, 400, 520, 640, 720, 780, 820, 840, 860, 870, 860, 840, 800, 720, 620, 540, 480, 440, 410, 390];
const ACT = [390, 375, 365, 360, 365, 410, 560, 700, 820, 900, 980, 1040, 1120, 1180, 1160, 1100, 1010, 840, 680, 570, 500, 450, 420, 400];
const W = 720, H = 220, L = 8, R = 8, T = 16, B = 24;
const x = (h: number) => L + (h / 23) * (W - L - R);
const y = (kw: number) => T + (1 - kw / 1300) * (H - T - B);
const path = (a: number[]) => a.map((v, i) => `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

function NormalCurve() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const on = reduced || inView;
  return (
    <div ref={ref} className="mt-8 max-w-2xl">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="A facility-day of load: the expected curve dashed, the actual curve rising above it through the afternoon tariff window.">
        <rect x={x(13)} y={T} width={x(17) - x(13)} height={H - T - B} fill="#f59e0b" opacity={0.1} />
        <text x={x(13) + 6} y={T + 11} className="fill-amber font-mono" fontSize="9" letterSpacing="0.12em">PEAK WINDOW</text>
        <path d={path(BASE)} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.25} strokeDasharray="4 4" />
        <motion.path d={path(ACT)} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: reduced ? 0 : 2, ease: [0.4, 0, 0.2, 1] }} />
        {[0, 6, 12, 18, 23].map((h) => (
          <text key={h} x={x(h)} y={H - 6} textAnchor={h === 0 ? "start" : h === 23 ? "end" : "middle"} className="fill-white/40 font-mono" fontSize="9">{String(h).padStart(2, "0")}:00</text>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] tracking-wide text-white/50">
        <span><span className="mr-2 inline-block h-[3px] w-4 bg-blue-soft align-middle" />Actual</span>
        <span><span className="mr-2 inline-block h-px w-4 bg-white/60 align-middle" />Expected — this site, this climate, this tariff</span>
        <span className="text-white/35">Illustrative</span>
      </div>
    </div>
  );
}


export function UnderstandIt() {
  return (
    <>
      <ChapterMarker
        id="understand"
        numeral="III"
        title="Understand it."
        line="Monitoring shows you a number. Understanding tells you whether the number is right."
      />
      <PlateStory
        plate="h10"
        alt="Macro of an industrial power meter and busbars inside a switchboard"
        focal="25% 50%"
        align="right"
        strength={0.02}
        beats={[
          <Statement key="1" kicker="Baselines" line="For your site, your climate, your production and your tariff — expected behaviour is built from your own data, then held to account.">
            It knows what normal looks like.
          </Statement>,
          <div key="2" className="text-left">
            <Statement kicker="Then it sees what is wrong" line="Drift from the expected curve is not an alert. It is evidence — graded by confidence, attached to a cause, priced in rials.">
              Normal is the baseline. Everything else is a finding.
            </Statement>
            <NormalCurve />
          </div>,
        ]}
      />
    </>
  );
}
