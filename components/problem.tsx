import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";

const problems = [
  {
    stat: "+70 to 140%",
    title: "Unexplained bills",
    body: "Cost structure is a black box. Operators have no foundation for financial or operational decisions when summer peak surcharges hit.",
  },
  {
    stat: "23 – 40%",
    title: "Cost concentration",
    body: "A disproportionate share of annual energy spend lands in a 13-week window. Without visibility, that becomes risk you cannot price.",
  },
  {
    stat: "Up to 4×",
    title: "Fragmented decisions",
    body: "Operations, finance, compliance and reporting each see different data. EUI varies up to 4× between similar institutions — no one knows what normal looks like.",
  },
];

export function Problem() {
  return (
    <section className="bg-paper py-24 sm:py-28">
      <div className="container-narrow">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-[44px]">
              The reform is live.
              <br />
              <span className="accent-underline">Your bills are not ready.</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-gray">
              Oman&apos;s energy reform has introduced structural risk into
              institutional energy performance. Three problems compound every
              billing cycle.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {problems.map((p) => (
              <Card key={p.title} className="flex flex-col">
                <span className="tabular text-3xl font-bold leading-none text-navy">
                  {p.stat}
                </span>
                <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-navy">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray">
                  {p.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
