"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Activity, Gauge, ShieldCheck } from "lucide-react";
import { AuroraBackground } from "@/components/aurora-background";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

const steps = [
  {
    icon: Activity,
    title: "Monitor",
    description:
      "Connect meters and bills. We normalize every charge, decompose TOU, and surface CRT risk in one live view.",
    outcome: "Bill normalization · TOU breakdown · CRT flags",
  },
  {
    icon: Gauge,
    title: "Analyse",
    description:
      "Oman-specific baselines and AI diagnostics quantify avoidable cost — anomaly by anomaly, asset by asset.",
    outcome: "AI anomalies · Load shifting · Peak mitigation",
  },
  {
    icon: ShieldCheck,
    title: "Govern",
    description:
      "Roll it up to the portfolio. Predictive maintenance, benchmarks, and audit-ready reporting keep your verified savings durable.",
    outcome: "Fault detection · Benchmarking · Success-fee savings",
  },
];

export function HowItWorks() {
  const reduced = useReducedMotion();

  return (
    <section
      id="how"
      className="relative overflow-hidden bg-navy py-24 text-white sm:py-28"
    >
      <AuroraBackground className="opacity-50" />
      <div className="absolute inset-0 bg-dotgrid opacity-30" aria-hidden />
      <CursorSpotlight tone="white" intensity={0.08} size={580} className="container-narrow">
        <Reveal className="max-w-2xl">
          <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-[44px]">
            Monitor. Analyse. Govern.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/65">
            One operating system for energy cost — engineered to grow with you,
            from a single building to a national portfolio.
          </p>
        </Reveal>

        <div className="relative mt-14">
          {/* Connecting line */}
          <div className="pointer-events-none absolute inset-x-12 top-9 hidden h-px lg:block">
            <motion.div
              className="h-full w-full origin-left bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </div>

          <RevealGroup as="ol" className="grid gap-6 lg:grid-cols-3" stagger={0.14}>
            {steps.map((s, i) => (
              <RevealItem
                as="li"
                key={s.title}
                className="relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="tabular text-xs font-semibold tracking-widest text-white/55">
                    STEP 0{i + 1}
                  </span>
                  <motion.span
                    aria-hidden
                    whileHover={reduced ? undefined : { rotate: 12, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-blue-soft"
                  >
                    <s.icon size={18} strokeWidth={1.75} />
                  </motion.span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-white/70">
                  {s.description}
                </p>
                <p className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] text-white/65">
                  {s.outcome}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </CursorSpotlight>
    </section>
  );
}
