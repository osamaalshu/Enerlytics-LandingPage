"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

const tiers = [
  {
    name: "Monitor",
    headline: "Understand your energy cost exposure",
    price: 250,
    scale: "0.1 – 1.5 GWh / yr · 3–5% of bill",
    features: [
      "Bill normalization and TOU breakdown",
      "Demand visibility reporting",
      "CRT risk flags",
      "Email alerts for peak windows",
    ],
    cta: "Start with Monitor",
  },
  {
    name: "Analyse",
    headline: "Identify and quantify avoidable costs",
    price: 500,
    scale: "1.5 – 5 GWh / yr · 3:1 ROI in year one",
    features: [
      "Everything in Monitor",
      "Oman-specific baselines and diagnostics",
      "AI anomaly detection and alerts",
      "Load shifting and peak mitigation",
      "APSR audit-ready reporting",
    ],
    cta: "Talk to sales",
    popular: true,
  },
  {
    name: "Govern",
    headline: "Control and optimize cost at scale",
    price: 1050,
    scale: "5+ GWh / yr · multi-site portfolios",
    features: [
      "Everything in Analyse",
      "Fault detection and diagnostics",
      "Portfolio benchmarking",
      "Predictive maintenance",
      "Success fee on verified savings",
    ],
    cta: "Request a partnership",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-paper py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Pricing</Eyebrow>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-[44px]">
            Three tiers. One transparent path to lower energy cost.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            Pricing scales with consumption and risk exposure. ROI is benchmarked
            from real institutional pilots in Oman.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3" stagger={0.1}>
          {tiers.map((t, i) => (
            <RevealItem
              key={t.name}
              className={cn("h-full", t.popular && "lg:-translate-y-3")}
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border bg-white p-8 transition-colors",
                  t.popular
                    ? "border-blue/40 shadow-[0_24px_60px_-20px_rgba(37,99,235,0.35)]"
                    : "border-navy/10 shadow-[var(--shadow-card)]",
                )}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]">
                    Most popular
                  </span>
                )}

                <div className="flex items-baseline justify-between">
                  <h3 className="text-[22px] font-semibold tracking-tight text-navy">
                    {t.name}
                  </h3>
                  {t.popular && (
                    <span className="rounded-full bg-blue/10 px-2.5 py-1 text-[10.5px] font-medium text-blue">
                      3:1 ROI
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-gray">
                  {t.headline}
                </p>

                <div className="mt-7 flex items-baseline gap-1.5">
                  <span className="tabular text-[44px] font-bold leading-none text-navy">
                    <AnimatedCounter
                      to={t.price}
                      duration={1.6}
                      delay={0.2 + i * 0.1}
                    />
                  </span>
                  <span className="text-sm font-medium text-navy/60">
                    OMR / mo
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] text-navy/55">{t.scale}</p>

                <ul className="mt-7 space-y-3">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-[14px] text-navy/80"
                    >
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/12 text-green">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Button
                    href="#contact"
                    variant={t.popular ? "primary" : "outline"}
                    className="w-full"
                  >
                    {t.cta}
                  </Button>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
