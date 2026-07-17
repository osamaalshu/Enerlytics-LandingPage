import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

/**
 * From anomaly to OMR — the proof-of-power section. One worked example of
 * the chain that defines the product: an anomaly detected in the data, a
 * physics diagnosis of the cause, and the cost priced in OMR at the
 * facility's actual tariff. Numbers are labelled illustrative; amber is
 * reserved site-wide for money, and this is where it earns that rule.
 */

const steps = [
  {
    tag: "DETECTED",
    color: "#13315c",
    title: "The data flags an anomaly",
    body: "Chiller approach temperature trending up week over week — efficiency drifting below the site's own performance curve.",
    spark: true,
  },
  {
    tag: "DIAGNOSED",
    color: "#1d4e89",
    title: "Physics finds the cause",
    body: "Condenser fouling — graded as an engineering diagnosis, not a guess, with the evidence attached to the finding.",
  },
  {
    tag: "PRICED",
    color: "#f59e0b",
    money: true,
    title: "OMR 340",
    body: "Priced at your actual tariff — band, season, and voltage class included. Now it's a decision, not a report.",
  },
];

/** Tiny rising drift line — the anomaly, drawn in data-ink. */
function Sparkline() {
  return (
    <svg viewBox="0 0 120 32" className="mt-4 h-8 w-full" aria-hidden>
      <polyline
        points="0,22 14,21 28,23 42,20 56,21 70,18 84,17 98,13 112,9 120,7"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polyline
        points="0,23 120,20"
        fill="none"
        stroke="rgba(16,35,59,0.25)"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
      <circle cx="112" cy="9" r="3" fill="#3b82f6" />
    </svg>
  );
}

export function FindingExample() {
  return (
    <section id="finding" className="bg-paper py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center text-teal">
            What a finding looks like
          </span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-[44px]">
            From anomaly to OMR.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            We don&apos;t hand you charts and wish you luck. Every inefficiency
            is detected in the data, diagnosed to its physical cause, and
            priced in rials — so you know exactly what fixing it is worth.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-5xl">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
            {steps.map((s, i) => (
              <FragmentStep key={s.tag} step={s} showArrow={i < steps.length - 1} />
            ))}
          </div>
          <p className="mt-6 text-center font-mono text-[11px] tracking-wide text-navy/35">
            Illustrative example — the method is real. Every finding carries
            its evidence, confidence grade, and price.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FragmentStep({
  step,
  showArrow,
}: {
  step: (typeof steps)[number];
  showArrow: boolean;
}) {
  return (
    <>
      {step.money ? (
        <article className="hover-lift relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber/20 bg-navy p-6 text-white shadow-[var(--shadow-soft)]">
          {/* warm glow rising behind the figure — the finding, made visible */}
          <div
            className="pointer-events-none absolute -bottom-16 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(closest-side, #f59e0b, transparent)" }}
            aria-hidden
          />
          <span className="inline-flex w-fit items-center rounded-full bg-amber px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-navy">
            {step.tag}
          </span>
          <p className="relative mt-5 font-mono text-[10px] tracking-[0.2em] text-white/45">
            THIS ONE FAULT
          </p>
          <div className="relative mt-1 flex items-baseline gap-2">
            <span className="tabular font-mono text-[38px] font-bold leading-none tracking-tight text-amber">
              {step.title}
            </span>
            <span className="font-mono text-sm text-white/50">/ month</span>
          </div>
          <p className="relative mt-2 text-[13px] font-medium text-white/85">
            Left alone, that&apos;s{" "}
            <span className="text-amber">≈ OMR 4,100 a year</span> — gone
            quietly.
          </p>
          <p className="relative mt-3 text-[12.5px] leading-relaxed text-white/60">
            {step.body}
          </p>
        </article>
      ) : (
        <article className="hover-lift relative flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-[var(--shadow-card)]">
          <span
            className="inline-flex w-fit items-center rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-white"
            style={{ background: step.color }}
          >
            {step.tag}
          </span>
          <h3 className="mt-4 text-[17px] font-semibold tracking-tight text-navy">
            {step.title}
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-gray">
            {step.body}
          </p>
          {step.spark && <Sparkline />}
        </article>
      )}
      {showArrow && (
        <div className="hidden items-center justify-center lg:flex" aria-hidden>
          <ArrowRight size={20} className="text-navy/30" />
        </div>
      )}
    </>
  );
}
