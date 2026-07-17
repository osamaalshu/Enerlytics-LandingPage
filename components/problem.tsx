import { AnimatedCounter } from "@/components/animated-counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Card } from "@/components/ui/card";

const problems = [
  {
    statNode: (
      <>
        +<AnimatedCounter to={70} duration={1.4} /> to{" "}
        <AnimatedCounter to={140} suffix="%" duration={1.6} delay={0.1} />
      </>
    ),
    title: "Unexplained bills",
    body: "Cost structure is a black box. Operators have no foundation for financial or operational decisions when summer peak surcharges hit.",
  },
  {
    statNode: (
      <>
        <AnimatedCounter to={23} duration={1.3} /> –{" "}
        <AnimatedCounter to={40} suffix="%" duration={1.5} delay={0.1} />
      </>
    ),
    title: "Cost concentration",
    body: "A disproportionate share of annual energy spend lands in a 13-week window. Without visibility, that becomes risk you cannot price.",
  },
  {
    statNode: (
      <>
        Up to <AnimatedCounter to={4} duration={1.2} suffix="×" />
      </>
    ),
    title: "Fragmented decisions",
    body: "Operations, finance, compliance and reporting each see different data. EUI varies up to 4× between similar institutions — no one knows what normal looks like.",
  },
];

export function Problem() {
  return (
    <section className="bg-paper py-24 sm:py-28">
      <div className="container-narrow">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <Reveal>
            <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-[44px]">
              The reform is live.
              <br />
              <span className="accent-underline">Your bills are not ready.</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-gray">
              Oman&apos;s energy reform has introduced structural risk into
              every facility&apos;s energy cost. Three problems compound every
              billing cycle.
            </p>
          </Reveal>

          <RevealGroup className="grid gap-4 sm:grid-cols-3" stagger={0.12}>
            {problems.map((p) => (
              <RevealItem key={p.title}>
                <Card className="flex h-full flex-col">
                  <span className="tabular text-3xl font-bold leading-none text-navy">
                    {p.statNode}
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-navy">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray">
                    {p.body}
                  </p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
