"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/cn";

/**
 * HOW WE DO IT — the site's signature section and the company's business
 * model: six stages in one continuous cycle (Collect → Understand → Diagnose
 * → Improve → Verify → Report → back into Understand).
 *
 * Interactive: click any stage card or any number on the ring to light that
 * stage; scrolling the cards drives it too. At stage six the feedback arc
 * closes the ring — verified results become the next baseline.
 */

const LAYERS = [
  {
    n: 1,
    name: "Collect",
    color: "#3d5a80",
    question: "What is actually happening?",
    body: "Meters, bills and equipment data come in — validated once, at the edge. Your CRT bill is reconstructed and checked line by line, exact to the baisa.",
    who: "Platform — automated",
    out: "Validated data · exact bill",
  },
  {
    n: 2,
    name: "Understand",
    color: "#4a6fa5",
    question: "How are we performing?",
    body: "Benchmarks, baselines and cost decomposition put your numbers in context — and every one of them lands in OMR, at your actual tariff.",
    who: "Platform — automated",
    out: "Cost baseline & benchmarks",
  },
  {
    n: 3,
    name: "Diagnose",
    color: "#1d4e89",
    question: "Why is this happening?",
    body: "Physics-based fault detection finds the cause — a fouled chiller, an idle compressor, a costly startup pattern — and prices the waste per hour.",
    who: "Platform + engineer-graded confidence",
    out: "Priced fault list",
  },
  {
    n: 4,
    name: "Improve",
    color: "#2a6f97",
    question: "What should we do?",
    body: "Prioritized fixes with payback attached: engineer-reviewed, data-assisted energy audits and retro-commissioning support. People decide; evidence backs them.",
    who: "Engineers decide and sign",
    out: "Actions, decided & owned",
  },
  {
    n: 5,
    name: "Verify",
    color: "#168aad",
    question: "Did it work?",
    body: "IPMVP-aligned measurement proves the savings against a frozen baseline — and keeps watching, so drift gets caught instead of quietly eating the gains.",
    who: "Engineer-approved savings",
    out: "Verified savings",
  },
  {
    n: 6,
    name: "Report",
    color: "#34a0a4",
    question: "Can we prove it?",
    body: "Executive evidence with a full audit trail, ready for boards, auditors and carbon reporting. Then the cycle starts again — from a higher floor.",
    who: "Certification stays with accredited bodies",
    out: "Evidence pack · new baseline",
  },
] as const;

// ---------- ring geometry ----------
const R = 118;
const CENTER = 150;
const ARC_SPAN = 54;
const ARC_GAP = 6;

function polar(angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(a), y: CENTER + radius * Math.sin(a) };
}

function arcPath(i: number, radius = R) {
  const start = i * (ARC_SPAN + ARC_GAP) + ARC_GAP / 2;
  const end = start + ARC_SPAN;
  const p1 = polar(start, radius);
  const p2 = polar(end, radius);
  return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 1 ${p2.x} ${p2.y}`;
}

/** Outer dashed feedback arc: stage 6 back over the top into stage 2. */
function feedbackPath() {
  const start = 5 * 60 + 30;
  const end = 360 + 90;
  const rOut = R + 22;
  const p1 = polar(start, rOut);
  const p2 = polar(end, rOut);
  return `M ${p1.x} ${p1.y} A ${rOut} ${rOut} 0 0 1 ${p2.x} ${p2.y}`;
}

function CycleRing({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  const reduced = useReducedMotion();
  const shown = reduced ? 5 : active;
  const current = LAYERS[Math.max(0, Math.min(5, shown))];
  const arrowTip = polar(360 + 90, R + 22);

  return (
    <svg
      viewBox="0 0 300 300"
      className="mx-auto w-full max-w-[360px]"
      role="img"
      aria-label="How we do it: Collect, Understand, Diagnose, Improve, Verify, Report — feeding back into Understand"
    >
      {/* faint full track */}
      {LAYERS.map((_, i) => (
        <path
          key={`track-${i}`}
          d={arcPath(i)}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      ))}

      {/* lit arcs up to the active stage */}
      {LAYERS.map((l, i) => (
        <motion.path
          key={`arc-${i}`}
          d={arcPath(i)}
          fill="none"
          stroke={l.color}
          strokeWidth="10"
          strokeLinecap="round"
          initial={false}
          animate={{
            pathLength: i <= shown ? 1 : 0,
            opacity: i <= shown ? 1 : 0,
          }}
          transition={{ duration: reduced ? 0 : 0.55, ease: [0.4, 0, 0.2, 1] }}
        />
      ))}

      {/* directional flow marching along the active arc */}
      {active >= 0 && (
        <path
          key={`flow-${active}`}
          d={arcPath(Math.max(0, Math.min(5, shown)))}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 10"
          className="dash-flow"
        />
      )}

      {/* clickable stage numbers around the ring */}
      {LAYERS.map((l, i) => {
        const mid = i * 60 + 30;
        const p = polar(mid, R - 24);
        const lit = i <= shown;
        return (
          <g
            key={`num-${i}`}
            onClick={() => onSelect(i)}
            className="cursor-pointer"
            role="button"
            aria-label={`Show stage ${l.n}: ${l.name}`}
          >
            <circle cx={p.x} cy={p.y} r="13" fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r="10"
              fill={active === i ? l.color : "transparent"}
              stroke={lit ? l.color : "rgba(255,255,255,0.18)"}
              strokeWidth="1"
            />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="font-mono"
              fontSize="11"
              fill={active === i ? "#ffffff" : lit ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)"}
            >
              {l.n}
            </text>
          </g>
        );
      })}

      {/* feedback arc — the cycle closes */}
      <motion.path
        d={feedbackPath()}
        fill="none"
        stroke="#34a0a4"
        strokeWidth="2"
        strokeDasharray="5 6"
        className={shown >= 5 ? "dash-flow" : undefined}
        initial={false}
        animate={{ pathLength: shown >= 5 ? 1 : 0, opacity: shown >= 5 ? 0.9 : 0 }}
        transition={{ duration: reduced ? 0 : 1.1, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.path
        d={`M ${arrowTip.x - 5} ${arrowTip.y - 7} L ${arrowTip.x + 2} ${arrowTip.y} L ${arrowTip.x - 8} ${arrowTip.y + 4} Z`}
        fill="#34a0a4"
        initial={false}
        animate={{ opacity: shown >= 5 ? 0.9 : 0 }}
        transition={{ duration: 0.3, delay: reduced ? 0 : 0.9 }}
      />

      {/* center readout */}
      <motion.g
        key={current.n}
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <text
          x={CENTER}
          y={CENTER - 26}
          textAnchor="middle"
          className="font-mono"
          fontSize="10"
          letterSpacing="0.2em"
          fill="rgba(255,255,255,0.45)"
        >
          {reduced ? "HOW WE DO IT" : `STAGE ${current.n} / 6`}
        </text>
        <text
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="#ffffff"
          letterSpacing="-0.02em"
        >
          {reduced ? "Six stages" : current.name}
        </text>
        <text
          x={CENTER}
          y={CENTER + 26}
          textAnchor="middle"
          fontSize="11"
          fontStyle="italic"
          fill="rgba(255,255,255,0.55)"
        >
          {reduced ? "One continuous cycle." : current.question}
        </text>
      </motion.g>
    </svg>
  );
}

export function TheLoop() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="how"
      className="relative overflow-hidden bg-navy py-24 text-white sm:py-28"
    >
      <div className="absolute inset-0 bg-dotgrid opacity-25" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-teal/10 blur-3xl"
        aria-hidden
      />

      <div className="container-narrow relative">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-teal-soft">How we do it</span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Six stages.
            <br />
            One continuous cycle.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/60">
            An audit is a snapshot. A dashboard is a window. We run a cycle
            that never stops — each stage produces something real, and hands
            it to the next.
          </p>
          <p className="mt-4 text-[17px] font-medium leading-relaxed text-white/90">
            From facility data to verified savings —{" "}
            <span className="text-teal-soft">every cycle raises the floor.</span>
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Sticky ring (desktop) / static ring (mobile) */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <CycleRing active={active} onSelect={setActive} />
            <p className="mt-4 text-center font-mono text-[10px] tracking-[0.18em] text-white/30">
              VERIFIED RESULTS BECOME THE NEW BASELINE
            </p>
            <p className="mt-2 text-center font-mono text-[10px] tracking-wide text-white/25">
              Click a stage — or just keep scrolling
            </p>
          </div>

          {/* The six stages — clickable, each output feeding the next */}
          <ol className="flex flex-col gap-2.5">
            {LAYERS.map((l, i) => (
              <li key={l.n} className="flex flex-col gap-2.5">
                <motion.div
                  onViewportEnter={() => setActive(i)}
                  viewport={{ amount: 0.6, margin: "-15% 0px -35% 0px" }}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className={cn(
                    "relative cursor-pointer rounded-2xl border p-6 transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-soft",
                    active === i
                      ? "border-white/25 bg-white/[0.07]"
                      : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
                  )}
                >
                  <span
                    className="absolute inset-y-0 left-0 w-[3px] rounded-full transition-opacity duration-300"
                    style={{ background: l.color, opacity: active === i ? 1 : 0.35 }}
                    aria-hidden
                  />
                  <div className="flex items-baseline gap-3">
                    <span
                      className="tabular font-mono text-[11px] font-semibold tracking-widest"
                      style={{ color: l.color }}
                    >
                      0{l.n}
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {l.name}
                    </h3>
                    <span className="ml-auto hidden font-mono text-[10.5px] italic tracking-wide text-white/40 sm:inline">
                      {l.question}
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/65">
                    {l.body}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-white/85"
                      style={{ borderColor: l.color, background: "rgba(255,255,255,0.03)" }}
                    >
                      <span className="text-white/40">OUT</span>
                      {l.out}
                    </span>
                    <span className="font-mono text-[10px] tracking-wide text-white/35">
                      {l.who}
                    </span>
                  </div>
                </motion.div>

                {/* handoff — this output is the next stage's input */}
                <div
                  aria-hidden
                  className="flex items-center justify-center gap-2 font-mono text-[9.5px] tracking-[0.16em] text-white/30"
                >
                  {i < 5 ? (
                    <>
                      <span style={{ color: l.color }}>↓</span>
                      FEEDS STAGE 0{l.n + 1}
                    </>
                  ) : (
                    <>
                      <span className="text-teal-soft">↺</span>
                      VERIFIED RESULTS RETURN TO STAGE 02 — THE NEW BASELINE
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
