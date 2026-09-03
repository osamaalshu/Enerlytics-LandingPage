"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MediaSource } from "@/components/cinematic/media-source";
import { PinnedChapter } from "@/components/cinematic/scroll-scene";
import { EnergyFlow, type FlowState } from "@/components/cinematic/energy-flow";
import { Callout } from "@/components/cinematic/metric-overlay";
import { cn } from "@/lib/cn";

/**
 * 04 · PV + BESS — a first-class product chapter (brief §8).
 *
 * One pinned scene, five states, one energy system: LOADS + PV + BESS +
 * TARIFF. The plate crossfades between the PV row and the battery yard; the
 * EnergyFlow diagram on the right carries the numbers; the copy names the
 * beat. Truth guardrails (§8.6): every value is an illustrative simulation
 * and the capability is described as designed / in development — never
 * "deployed". No string-level or cell-level resolution is implied.
 */

type Beat = {
  label: string;
  plate: "h04" | "h05";
  eyebrow: string;
  title: string;
  body: string;
  flow: FlowState;
  money?: { label: string; value: string; note: string };
};

const BEATS: Beat[] = [
  {
    label: "Assets",
    plate: "h04",
    eyebrow: "Solar + storage",
    title: "Generation and storage, in the same frame as the facility.",
    body: "Solar and batteries are operating assets with behaviour of their own. Enerlytics reads them in the same economic model as everything else that uses energy on site.",
    flow: { pvKw: 184, pvExpectedKw: 190, gridKw: 288, bessKw: 140, loadKw: 612, soc: 62, reveal: 0 },
  },
  {
    label: "Trace",
    plate: "h04",
    eyebrow: "System trace",
    title: "Power has a direction. So does the money.",
    body: "Solar to the site; the site to its loads; storage in and out; the grid meter where the tariff is settled. One trace, physically plausible, always current.",
    flow: { pvKw: 184, pvExpectedKw: 190, gridKw: 288, bessKw: 140, loadKw: 612, soc: 62, reveal: 4 },
  },
  {
    label: "Solar",
    plate: "h04",
    eyebrow: "Solar",
    title: "Output against what the sun says it should be.",
    body: "Expected generation from the weather, actual from the plant. The gap is a finding — graded and priced like any other.",
    flow: { pvKw: 158, pvExpectedKw: 190, gridKw: 314, bessKw: 140, loadKw: 612, soc: 62, reveal: 4, focus: "pv" },
  },
  {
    label: "Storage",
    plate: "h05",
    eyebrow: "Storage",
    title: "A battery is a decision, made every fifteen minutes.",
    body: "State of charge, power in and out, availability — an operating asset with a state, not an icon.",
    flow: { pvKw: 158, pvExpectedKw: 190, gridKw: 314, bessKw: 140, loadKw: 612, soc: 62, reveal: 4, focus: "bess" },
  },
];

export function PvBessScene() {
  const reduced = useReducedMotion();
  return (
    <section id="pv-bess" className="bg-ink text-white" aria-labelledby="pv-bess-title">
      <h2 id="pv-bess-title" className="sr-only">Solar and storage intelligence</h2>
      <PinnedChapter
        steps={BEATS.length}
        labels={BEATS.map((b) => b.label)}
        ariaLabel="Solar and storage: five states of one site energy system"
        stageClassName="grain"
      >
        {({ step, pinned }) => {
          const b = BEATS[step];
          return (
            <div className={cn("relative", pinned ? "h-full" : "")}>
              {/* plates — both mounted, crossfaded, so the swap is instant */}
              <div className={cn("overflow-hidden", pinned ? "absolute inset-0" : "relative aspect-[16/10] sm:aspect-video lg:aspect-auto lg:h-[70vh]")}>
                {(["h04", "h05"] as const).map((id) => (
                  <motion.div
                    key={id}
                    className="absolute inset-0"
                    initial={false}
                    animate={{ opacity: b.plate === id ? 1 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.9, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <MediaSource
                      id={id}
                      alt={id === "h04" ? "Row of ground-mount PV modules at blue hour" : "Containerised battery storage unit and power-conversion cabinet at night"}
                      video
                      focal={id === "h04" ? "30% 50%" : "60% 50%"}
                    />
                  </motion.div>
                ))}
                <div className="scrim-b absolute inset-0" aria-hidden />
                <div className="scrim-l absolute inset-0 hidden lg:block" aria-hidden />

                {/* one anchored callout per beat, desktop only */}
                <div className="absolute inset-0 hidden lg:block" aria-hidden>
                  {step === 2 && <Callout key="pv" x={38} y={44} dx={150} dy={-70} label="Solar · one section" value={158} unit="kW" note="expected 190 · −17 %" tone="pv" />}
                  {step === 3 && <Callout key="bess" x={62} y={52} dx={-160} dy={-64} label="Storage" value={62} unit="% SoC" note="DISCHARGING · 140 kW · 31 °C" tone="bess" />}
                </div>
              </div>

              {/* copy + flow */}
              <div className={cn("container-narrow relative z-10", pinned ? "flex h-full items-end pb-16" : "py-10")}>
                <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-end lg:gap-12">
                  <div className="max-w-xl">
                    <span className="instrument text-teal-fg/80">{b.eyebrow}</span>
                    <motion.h3
                      key={step}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-3 text-balance text-3xl font-bold leading-[1.04] tracking-[-0.025em] sm:text-4xl lg:text-[44px]"
                    >
                      {b.title}
                    </motion.h3>
                    <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/68">{b.body}</p>
                    {b.money && (
                      <div className="mt-5 inline-flex items-baseline gap-3 rounded-lg border border-amber/25 bg-ink/70 px-4 py-3">
                        <span className="instrument text-white/50">{b.money.label}</span>
                        <span className="tabular font-mono text-[24px] font-semibold text-amber">{b.money.value}</span>
                        <span className="font-mono text-[10px] text-white/45">{b.money.note}</span>
                      </div>
                    )}
                    <p className="instrument mt-5 text-[9px] text-white/35">
                      Illustrative simulation · solar + storage intelligence is in development
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-navy/70 p-3 backdrop-blur-sm">
                    <EnergyFlow s={b.flow} className="h-auto w-full" />
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </PinnedChapter>
    </section>
  );
}
