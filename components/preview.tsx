import { DashboardMock } from "@/components/dashboard-mock";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
import { Eyebrow } from "@/components/ui/eyebrow";

const callouts = [
  {
    title: "Sub-15-minute granularity",
    body: "Stream meter and submeter data into a single, normalized model — circuits to portfolios.",
  },
  {
    title: "TOU & CRT decomposed",
    body: "Every cost driver labelled — energy, demand, surcharge, fuel pass-through, fixed charges.",
  },
  {
    title: "Action, not dashboards",
    body: "Each anomaly ships with the mitigation: load shed, schedule, or maintenance ticket.",
  },
];

export function Preview() {
  return (
    <section id="preview" className="relative bg-paper py-24 sm:py-28">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <Reveal className="max-w-md">
            <Eyebrow>Live preview</Eyebrow>
            <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-[42px]">
              Your bill, decoded — to the kilowatt.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-gray">
              A glance at the operator&apos;s view: real-time load against
              tariff-aware baseline, peak risk windows highlighted, and
              one-click mitigation when the CRT threshold is breached.
            </p>

            <RevealGroup as="ul" className="mt-8 space-y-5" stagger={0.08}>
              {callouts.map((c) => (
                <RevealItem as="li" key={c.title} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue"
                  />
                  <div>
                    <p className="text-[15px] font-semibold tracking-tight text-navy">
                      {c.title}
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-gray">
                      {c.body}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>

          <Reveal y={32} duration={0.9} className="relative">
            <div
              className="absolute -inset-x-6 -inset-y-10 -z-10 rounded-[40px] bg-gradient-to-br from-blue/15 via-blue/5 to-transparent blur-2xl"
              aria-hidden
            />
            <TiltCard max={5} lift={14} sheen className="rounded-[28px]">
              <DashboardMock variant="framed" />
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
