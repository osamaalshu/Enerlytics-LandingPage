"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DepthPlate } from "@/components/cinematic/depth-plate";
import { PinnedChapter } from "@/components/cinematic/scroll-scene";
import { cn } from "@/lib/cn";

/**
 * How we do it — the six-stage cycle as the site's signature object.
 *
 * The company's business model is one closed cycle: Collect → Understand →
 * Diagnose → Improve → Verify → Report → back into Understand. Here it is a
 * large instrument over the facility: the wheel turns as you scroll so the
 * active stage sits at the top, the arcs light in order, and at stage six
 * the feedback arc closes the ring. Left: the stage, its question, what it
 * produces and who owns it. Mobile: the same wheel with a tap stepper.
 *
 * Customer-facing name is "How we do it" / "cycle" — never "loop".
 */
const STAGES = [
  { n: 1, name: "Collect", q: "What is actually happening?", body: "Meters, bills and plant data come in — validated once, at the edge. Your tariff bill is reconstructed and checked line by line, exact to the baisa.", out: "Validated data · exact bill", who: "Platform — automated", color: "#3d5a80" },
  { n: 2, name: "Understand", q: "How are we performing?", body: "Baselines, benchmarks and cost decomposition put your numbers in context — every one of them in OMR, at your actual tariff.", out: "Cost baseline & benchmarks", who: "Platform — automated", color: "#4a6fa5" },
  { n: 3, name: "Diagnose", q: "Why is this happening?", body: "Physics-based detection finds the cause — a cooling plant off its curve, equipment idling at full power, a costly start-up pattern — and prices the waste per hour.", out: "Priced findings", who: "Platform + engineer-graded confidence", color: "#1d4e89" },
  { n: 4, name: "Improve", q: "What should we do?", body: "Prioritised fixes with payback attached: engineer-reviewed, data-assisted audits and retro-commissioning support. People decide; evidence backs them.", out: "Actions, decided & owned", who: "Engineers decide and sign", color: "#2a6f97" },
  { n: 5, name: "Verify", q: "Did it work?", body: "IPMVP-aligned measurement proves the savings against a frozen baseline — and keeps watching, so drift is caught instead of quietly eating the gains.", out: "Verified savings", who: "Engineer-approved savings", color: "#168aad" },
  { n: 6, name: "Report", q: "Can we prove it?", body: "Executive evidence with a full audit trail, ready for boards, auditors and carbon reporting. Then the cycle starts again — from a higher floor.", out: "Evidence pack · new baseline", who: "Certification stays with accredited bodies", color: "#34a0a4" },
];

const R = 200;
const C = 250;
const SPAN = 52;
const GAP = 8;
const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: Math.round((C + r * Math.cos(a)) * 100) / 100, y: Math.round((C + r * Math.sin(a)) * 100) / 100 };
};
const arc = (i: number, r = R) => {
  const s = i * 60 - SPAN / 2;
  const p1 = polar(s, r);
  const p2 = polar(s + SPAN, r);
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`;
};
const feedback = () => {
  const p1 = polar(300 + SPAN / 2 + GAP, R + 30);
  const p2 = polar(360 + 60 - SPAN / 2 - GAP, R + 30);
  return `M ${p1.x} ${p1.y} A ${R + 30} ${R + 30} 0 0 1 ${p2.x} ${p2.y}`;
};

function Wheel({ step }: { step: number }) {
  const reduced = useReducedMotion();
  const s = STAGES[step];
  return (
    <svg viewBox="0 0 500 500" className="mx-auto h-auto w-full max-w-[560px]" role="img"
      aria-label={`How we do it: six stages in one cycle. Stage ${s.n}, ${s.name}: ${s.q}`}>
      <motion.g
        initial={false}
        animate={{ rotate: -step * 60 }}
        transition={{ type: "spring", stiffness: 60, damping: 18, duration: reduced ? 0 : undefined }}
        style={{ originX: "250px", originY: "250px" }}
      >
        {STAGES.map((st, i) => (
          <g key={st.n}>
            <path d={arc(i)} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={14} strokeLinecap="round" />
            <motion.path d={arc(i)} fill="none" stroke={st.color} strokeWidth={14} strokeLinecap="round"
              initial={false} animate={{ pathLength: i <= step ? 1 : 0, opacity: i <= step ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.5, ease: [0.4, 0, 0.2, 1] }} />
            {(() => {
              const p = polar(i * 60, R - 34);
              return (
                <g transform={`translate(${p.x} ${p.y}) rotate(${step * 60})`}>
                  <circle r={13} fill={i === step ? st.color : "transparent"} stroke={i <= step ? st.color : "rgba(255,255,255,0.2)"} />
                  <text textAnchor="middle" dominantBaseline="central" className="font-mono" fontSize="11" fill={i === step ? "#fff" : i <= step ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)"}>{st.n}</text>
                </g>
              );
            })()}
          </g>
        ))}
        {/* feedback: stage six back into stage two */}
        <motion.path d={feedback()} fill="none" stroke="#34a0a4" strokeWidth={2} strokeDasharray="5 6"
          className={step >= 5 ? "dash-flow" : undefined}
          initial={false} animate={{ pathLength: step >= 5 ? 1 : 0, opacity: step >= 5 ? 0.9 : 0 }}
          transition={{ duration: reduced ? 0 : 1, ease: [0.4, 0, 0.2, 1] }} />
      </motion.g>
      {/* active arc flow (fixed at top) */}
      <path d={arc(0)} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={3} strokeLinecap="round" strokeDasharray="2 10" className="dash-flow" />
      {/* centre readout */}
      <motion.g key={s.n} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <text x={C} y={C - 40} textAnchor="middle" className="font-mono" fontSize="10" letterSpacing="0.22em" fill="rgba(255,255,255,0.5)">STAGE 0{s.n} / 06</text>
        <text x={C} y={C + 6} textAnchor="middle" fontSize="40" fontWeight="800" letterSpacing="-0.03em" fill="#fff">{s.name}</text>
        <text x={C} y={C + 38} textAnchor="middle" fontSize="13" fontStyle="italic" fill="rgba(255,255,255,0.6)">{s.q}</text>
      </motion.g>
    </svg>
  );
}

export function CycleScene() {
  return (
    <section id="how" className="grain relative isolate bg-ink text-white" aria-labelledby="how-title">
      <h2 id="how-title" className="sr-only">How we do it: six stages, one continuous cycle</h2>
      <PinnedChapter steps={6} labels={STAGES.map((s) => s.name)} ariaLabel="How we do it — six stages" stageClassName="relative">
        {({ step, pinned }) => {
          const s = STAGES[step];
          return (
            <div className={cn("relative", pinned ? "h-full" : "min-h-[100svh]")}>
              <div className="absolute inset-0">
                <DepthPlate id="h06" alt="The facility from high above at night" focal="45% 60%" strength={0.015} />
                <div className="absolute inset-0 bg-ink/55" aria-hidden />
                <div className="scrim-b absolute inset-0" aria-hidden />
              </div>
              <div className={cn("container-narrow relative z-10 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16", pinned ? "h-full py-20" : "py-20")}>
                <div>
                  <span className="instrument text-teal-fg/80">How we do it</span>
                  <p className="mt-4 text-balance text-[34px] font-black leading-[0.96] tracking-[-0.04em] sm:text-[48px]">
                    Six stages. One cycle that never stops.
                  </p>
                  <div className="mt-10 border-l-2 pl-6" style={{ borderColor: s.color }}>
                    <div className="flex items-baseline gap-4">
                      <span className="tabular font-mono text-[13px] font-semibold tracking-widest" style={{ color: s.color }}>0{s.n}</span>
                      <motion.h3 key={s.n} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="text-[30px] font-bold tracking-tight">
                        {s.name}
                      </motion.h3>
                      <span className="ml-auto hidden font-mono text-[11px] italic text-white/45 sm:inline">{s.q}</span>
                    </div>
                    <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-white/72">{s.body}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <span className="instrument inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] text-white/90" style={{ borderColor: s.color }}>
                        <span className="text-white/45">OUT</span>{s.out}
                      </span>
                      <span className="font-mono text-[10.5px] tracking-wide text-white/50">{s.who}</span>
                    </div>
                  </div>
                  <p className="instrument mt-8 text-[9px] text-white/40">Verified results become the new baseline · every cycle raises the floor</p>
                </div>
                <Wheel step={step} />
              </div>
            </div>
          );
        }}
      </PinnedChapter>
    </section>
  );
}
