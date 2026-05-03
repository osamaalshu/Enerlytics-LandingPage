import Image from "next/image";
import { Eyebrow } from "@/components/ui/eyebrow";

const capabilities = [
  {
    icon: "/brand/icons/insights.png",
    title: "Real-time load dashboard",
    body: "Live energy monitoring with TOU (time-of-use) cost breakdown — see every kilowatt as it lands on the bill.",
  },
  {
    icon: "/brand/icons/energy.png",
    title: "Peak risk alerts",
    body: "Predictive alerts for the May–July summer peak surcharge windows, with clear mitigation paths.",
  },
  {
    icon: "/brand/icons/building.png",
    title: "Tariff-aware baseline",
    body: "Tracking actuals against Oman-specific regulatory baselines, calibrated to each site and tariff schedule.",
  },
  {
    icon: "/brand/icons/optimization.png",
    title: "Anomaly detection",
    body: "AI-driven issue triage and fault detection diagnostics — find the kilowatts you should not be paying for.",
  },
  {
    icon: "/brand/icons/cost_down.png",
    title: "Audit-ready reporting",
    body: "Automated APSR-grade compliance reports for institutional governance, board reviews, and CRT audits.",
  },
];

export function Capabilities() {
  return (
    <section id="platform" className="bg-mist/40 py-24 sm:py-28">
      <div className="container-narrow">
        <div className="max-w-2xl">
          <Eyebrow>Platform capabilities</Eyebrow>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-[44px]">
            Five tools, one source of truth for energy cost.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            Built natively for Oman&apos;s CRT framework — the platform turns
            meter data into decisions your operations, finance, and compliance
            teams can share.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <article
              key={c.title}
              className={`group relative flex flex-col gap-4 rounded-2xl border border-navy/10 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-blue/30 ${
                i === 0 ? "lg:row-span-2 lg:p-8" : ""
              }`}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-mist transition-colors group-hover:bg-blue/10">
                <Image
                  src={c.icon}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold tracking-tight text-navy">
                  {c.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray">
                  {c.body}
                </p>
              </div>

              {i === 0 && (
                <div className="mt-auto rounded-xl border border-navy/10 bg-mist/70 p-4">
                  <p className="eyebrow text-navy/55">Live signal</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-navy/80">
                    Sub-15-minute granularity. Aggregated to circuits, sites,
                    and portfolios.
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
