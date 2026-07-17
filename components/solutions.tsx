"use client";

import { Building2, Factory, GraduationCap, Hotel } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

/**
 * Who it's for — every facility that pays the CRT: factories, hotels,
 * schools and campuses, government estates. Each card: the sector, its
 * specific CRT pain, the outcome.
 */
const solutions = [
  {
    icon: Factory,
    sector: "Factories & plants",
    pain: "Energy is a production cost — chillers, compressors and changeovers hide waste that never gets itemized.",
    outcome: "Priced waste, per machine",
  },
  {
    icon: Hotel,
    sector: "Hotels & resorts",
    pain: "Cooling-driven evening peaks land exactly inside the costly tariff window — while guests expect comfort untouched.",
    outcome: "Comfort kept, peaks tamed",
  },
  {
    icon: GraduationCap,
    sector: "Schools & campuses",
    pain: "Sprawling, mixed-use estates where no single owner answers for the energy bill.",
    outcome: "Per-building accountability",
  },
  {
    icon: Building2,
    sector: "Government & critical facilities",
    pain: "Portfolios audited to a standard no spreadsheet can keep up with — and 24/7 loads that can't just switch off.",
    outcome: "Audit-ready governance",
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="bg-paper py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-teal">Who it&apos;s for</span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-navy sm:text-5xl">
            Built for every facility
            <br />
            that pays the tariff.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            The Cost-Reflective Tariff hits every operation differently.
            Enerlytics adapts to how your facility actually runs — factory
            floor, hotel tower, campus, or government estate.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {solutions.map((s) => (
            <RevealItem key={s.sector}>
              <article className="hover-lift group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-[var(--shadow-card)] hover:border-teal/35">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal transition-colors duration-200 group-hover:bg-teal group-hover:text-white">
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
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
