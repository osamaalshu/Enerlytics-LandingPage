import { Activity, Gauge, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";

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
  return (
    <section id="how" className="relative bg-navy py-24 text-white sm:py-28">
      <div className="absolute inset-0 bg-dotgrid opacity-40" aria-hidden />
      <div className="container-narrow relative">
        <div className="max-w-2xl">
          <Eyebrow tone="white">How it works</Eyebrow>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-[44px]">
            Monitor. Analyse. Govern.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/65">
            One operating system for energy cost — engineered to grow with you,
            from a single building to a national portfolio.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <span className="tabular text-xs font-semibold tracking-widest text-white/40">
                  STEP 0{i + 1}
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-blue-soft">
                  <s.icon size={18} strokeWidth={1.75} />
                </span>
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
