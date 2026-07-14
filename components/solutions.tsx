"use client";

import { Building2, GraduationCap, HeartPulse, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

/**
 * Solutions by building type — shows a first-time visitor "this is for a place
 * like mine." Each card names the sector, the pain that sector feels under the
 * Cost-Reflective Tariff, and the outcome Enerlytics targets there.
 */
const solutions = [
  {
    icon: GraduationCap,
    sector: "Universities & campuses",
    pain: "Sprawling, mixed-use loads with no single owner for the energy bill.",
    outcome: "Per-building accountability",
  },
  {
    icon: HeartPulse,
    sector: "Hospitals & healthcare",
    pain: "24/7 critical load where peak surcharges can't be switched off casually.",
    outcome: "Safe peak mitigation",
  },
  {
    icon: ShoppingBag,
    sector: "Malls & retail",
    pain: "Cooling-driven evening peaks that line up exactly with the costly tariff window.",
    outcome: "Shifted cooling load",
  },
  {
    icon: Building2,
    sector: "Government & offices",
    pain: "Portfolios of buildings audited to a standard no spreadsheet can keep up with.",
    outcome: "Audit-ready governance",
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="bg-mist/40 py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-blue">Solutions</span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-navy sm:text-5xl">
            Built for every
            <br />
            institutional building.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            The Cost-Reflective Tariff hits every sector differently. Enerlytics
            adapts to how your buildings actually run — not the other way around.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {solutions.map((s) => (
            <RevealItem key={s.sector}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-[var(--shadow-card)] transition-colors hover:border-blue/30"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue/10 text-blue transition-colors group-hover:bg-blue group-hover:text-white">
                  <s.icon size={22} strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-navy">
                  {s.sector}
                </h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-gray">
                  {s.pain}
                </p>
                <p className="mt-4 border-t border-navy/8 pt-3 font-mono text-[11px] tracking-wide text-green">
                  → {s.outcome}
                </p>
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
