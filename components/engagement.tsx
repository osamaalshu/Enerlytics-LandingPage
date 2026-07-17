"use client";

import { Check } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Button } from "@/components/ui/button";

/**
 * Engagement — replaces published tier pricing. Company decision
 * (docs/business_model): one managed engagement while pilots prove the loop;
 * tiered packaging only after real willingness-to-pay exists. Pricing scales
 * with consumption, sites and scope — set in conversation, not on a card.
 */

const included = [
  "Bill validation and CRT cost decomposition — exact to the baisa",
  "Benchmarks, baselines and monthly performance context in OMR",
  "Physics-based diagnostics on your energy-intensive equipment",
  "Engineer-reviewed findings — graded, priced, prioritized",
  "IPMVP-aligned verification of what your fixes actually saved",
  "Executive reporting with a full audit trail",
];

const scales = [
  { k: "Annual consumption", v: "GWh / yr" },
  { k: "Sites & meters", v: "count" },
  { k: "Equipment systems", v: "chillers · compressors · pumps · AHUs" },
  { k: "Engineering scope", v: "audit · RCx · M&V depth" },
];

export function Engagement() {
  return (
    <section id="engagement" className="bg-paper py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center text-teal">Working with us</span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-[44px]">
            One engagement. The whole cycle.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            We don&apos;t sell feature tiers. Every client runs the full cycle —
            platform plus our engineers — scoped to your facility. Start on one
            site; expand when the results prove themselves.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[var(--shadow-card)]">
            <div className="grid lg:grid-cols-[1.3fr_1fr]">
              {/* what's included */}
              <div className="p-8 sm:p-10">
                <h3 className="text-[22px] font-semibold tracking-tight text-navy">
                  Managed engagement
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray">
                  Everything below, on your data, with our engineers — from
                  first bill to first verified saving.
                </p>
                <RevealGroup as="ul" className="mt-7 space-y-3" stagger={0.05}>
                  {included.map((f) => (
                    <RevealItem
                      as="li"
                      key={f}
                      className="flex items-start gap-2.5 text-[14px] text-navy/80"
                    >
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/12 text-green">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {f}
                    </RevealItem>
                  ))}
                </RevealGroup>
                <div className="mt-9">
                  <Button href="#contact" size="lg">
                    Start the conversation
                  </Button>
                </div>
              </div>

              {/* how pricing scales */}
              <div className="border-t border-navy/8 bg-mist/50 p-8 sm:p-10 lg:border-l lg:border-t-0">
                <p className="eyebrow text-navy/45">How pricing scales</p>
                <p className="mt-4 text-[14px] leading-relaxed text-gray">
                  A monthly fee sized to your facility — no surprises, no
                  per-seat games. It moves with:
                </p>
                <ul className="mt-6 space-y-4">
                  {scales.map((s) => (
                    <li
                      key={s.k}
                      className="flex items-baseline justify-between gap-4 border-b border-navy/8 pb-3"
                    >
                      <span className="text-[14px] font-medium text-navy">
                        {s.k}
                      </span>
                      <span className="text-right font-mono text-[11px] tracking-wide text-navy/50">
                        {s.v}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[12.5px] leading-relaxed text-navy/55">
                  Professional work — audits, retro-commissioning, M&V — is
                  scoped and priced explicitly. We never promise unlimited
                  engineering under a flat fee, and you never pay for depth you
                  don&apos;t use.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
