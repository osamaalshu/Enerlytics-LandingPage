"use client";

import { BadgeCheck, ClipboardList, Compass, Wrench } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { cn } from "@/lib/cn";

/**
 * Services — stages 4–5 of the loop, delivered by engineers on top of the
 * platform's evidence. Wording is claims-governed: audits are
 * "engineer-reviewed, data-assisted" (ASHRAE 211 / ISO 50002 workflow, humans
 * sign); M&V is "IPMVP-aligned"; nothing claims certification for software.
 */
const auditLevels = [
  { tier: 1, name: "Walk-through", note: "Screen the estate, find the obvious wins" },
  { tier: 2, name: "Survey & analysis", note: "Full equipment survey with costed measures" },
  { tier: 3, name: "Investment-grade", note: "Capital-decision rigor, measure by measure" },
];

/** Depth meter — encodes the real escalation of audit rigor (Level 1 → 3). */
function DepthMeter({ level }: { level: number }) {
  return (
    <span
      className="flex items-end gap-1"
      role="img"
      aria-label={`Depth level ${level} of 3`}
    >
      {[1, 2, 3].map((rung) => (
        <span
          key={rung}
          className={cn(
            "w-1.5 rounded-full transition-colors",
            rung === 1 && "h-2",
            rung === 2 && "h-3.5",
            rung === 3 && "h-5",
            rung <= level ? "bg-teal" : "bg-navy/10",
          )}
        />
      ))}
    </span>
  );
}

const services = [
  {
    icon: Compass,
    name: "Consulting & Advisory",
    body: "Energy strategy, tariff-option analysis, and decarbonization roadmaps grounded in your validated data.",
  },
  {
    icon: BadgeCheck,
    name: "Measurement & Verification",
    tag: "M&V",
    body: "IPMVP-aligned savings verification against frozen baselines — proof the savings are real, signed by qualified professionals.",
  },
  {
    icon: Wrench,
    name: "Retro-Commissioning",
    tag: "RCx",
    body: "Tune existing systems back to how they should run — guided by the platform's diagnostics, no capital rebuild.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-white py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-teal">Services · stages 4–5</span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-navy sm:text-5xl">
            Where engineers
            <br />
            take over.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            Software finds and prices the opportunity; certified energy
            professionals inspect, decide, and sign. That boundary is the
            product — not a limitation of it.
          </p>
        </Reveal>

        {/* Featured: engineer-reviewed, data-assisted energy audits */}
        <Reveal className="mt-14">
          <div className="rounded-2xl border border-navy/10 bg-mist/40 p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <ClipboardList size={22} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-[19px] font-semibold tracking-tight text-navy">
                  Engineer-reviewed, data-assisted energy audits
                </h3>
                <p className="text-[13.5px] leading-relaxed text-gray">
                  A workflow consistent with ASHRAE Level 1–3 — the platform
                  prepares the analysis; our engineers do the site work and
                  sign the findings.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {auditLevels.map((a) => (
                <div
                  key={a.tier}
                  className="rounded-xl border border-navy/10 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-widest text-teal">
                      LEVEL {a.tier}
                    </span>
                    <DepthMeter level={a.tier} />
                  </div>
                  <p className="mt-3 text-[15px] font-semibold tracking-tight text-navy">
                    {a.name}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-gray">
                    {a.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Other professional services */}
        <RevealGroup className="mt-4 grid gap-4 sm:grid-cols-3" stagger={0.08}>
          {services.map((s) => (
            <RevealItem key={s.name}>
              <article className="hover-lift group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-[var(--shadow-card)] hover:border-teal/35">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal transition-colors duration-200 group-hover:bg-teal group-hover:text-white">
                  <s.icon size={22} strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 flex items-center gap-2 text-[17px] font-semibold tracking-tight text-navy">
                  {s.name}
                  {s.tag && (
                    <span className="rounded-full bg-navy/5 px-2 py-0.5 font-mono text-[10px] tracking-wide text-navy/55">
                      {s.tag}
                    </span>
                  )}
                </h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-gray">
                  {s.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
