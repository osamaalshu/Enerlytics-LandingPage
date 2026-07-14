"use client";

import { BadgeCheck, ClipboardList, Compass, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { cn } from "@/lib/cn";

/**
 * Services — the professional services Enerlytics offers alongside the platform,
 * named the way established energy firms (Schneider, JCI, Siemens, Trane) brand
 * them so the offering reads as industry-standard:
 *   - Energy Audits at all three ASHRAE levels
 *   - Consulting & Advisory
 *   - Measurement & Verification (M&V, IPMVP)
 *   - Retro-Commissioning (RCx)
 */
const auditLevels = [{ tier: 1 }, { tier: 2 }, { tier: 3 }];

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
            rung <= level ? "bg-blue" : "bg-navy/10",
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
    body: "Energy strategy, tariff optimization, and decarbonization roadmaps.",
  },
  {
    icon: BadgeCheck,
    name: "Measurement & Verification",
    tag: "M&V",
    body: "IPMVP-based savings verification — proof the savings are real.",
  },
  {
    icon: Wrench,
    name: "Retro-Commissioning",
    tag: "RCx",
    body: "Tune existing buildings back to peak performance — no capital rebuild.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-white py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-blue">Services</span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-navy sm:text-5xl">
            Energy services,
            <br />
            end to end.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            Beyond the platform, our team delivers the full engineering service
            stack — from standards-based audits to verified savings.
          </p>
        </Reveal>

        {/* Featured: Energy Audits with the three ASHRAE levels */}
        <Reveal className="mt-14">
          <div className="rounded-2xl border border-navy/10 bg-mist/40 p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue/10 text-blue">
                <ClipboardList size={22} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-[19px] font-semibold tracking-tight text-navy">
                  Energy Audits
                </h3>
                <p className="text-[13.5px] leading-relaxed text-gray">
                  ASHRAE Level 1–3 — from a quick walk-through to an
                  investment-grade study.
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
                    <span className="font-mono text-[11px] tracking-widest text-blue">
                      LEVEL {a.tier}
                    </span>
                    <DepthMeter level={a.tier} />
                  </div>
                  <p className="mt-3 text-[15px] font-semibold tracking-tight text-navy">
                    Energy Audit — Level {a.tier}
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
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-[var(--shadow-card)] transition-colors hover:border-blue/30"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue/10 text-blue transition-colors group-hover:bg-blue group-hover:text-white">
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
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
