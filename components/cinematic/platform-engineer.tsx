import { BadgeCheck, Cpu, PenLine } from "lucide-react";
import { SectionFrame, ChapterHead } from "@/components/cinematic/section-frame";
import { InView } from "@/components/cinematic/in-view";
import { cn } from "@/lib/cn";

/**
 * 06 · Platform × engineer.
 *
 * The credibility boundary, made visual: software on the left does the
 * high-volume analysis; engineers on the right decide and sign where
 * accountability matters. The six stages run down the middle so a visitor
 * reads exactly where the handoff happens (brief §7.06; claims register:
 * no "fully automated" anything involving engineering judgement).
 */
const STAGES = [
  { n: 1, name: "Collect", software: "Validates meters, bills and plant data — the bill reconstructed to the baisa.", engineer: null },
  { n: 2, name: "Understand", software: "Builds baselines, benchmarks and cost decomposition in OMR.", engineer: null },
  { n: 3, name: "Diagnose", software: "Physics-based detection across cooling, electrical, process, solar and storage; findings priced per hour.", engineer: "Grades confidence on every finding." },
  { n: 4, name: "Improve", software: "Holds the evidence, the owner and the expected effect.", engineer: "Inspects, decides, signs the action." },
  { n: 5, name: "Verify", software: "IPMVP-aligned calculation against the frozen baseline.", engineer: "Approves the savings." },
  { n: 6, name: "Report", software: "Assembles the evidence pack with a full audit trail.", engineer: "Certification stays with accredited bodies." },
];

export function PlatformEngineer() {
  return (
    <SectionFrame id="platform" tone="ink" className="overflow-hidden">
      <div className="container-narrow relative">
        <ChapterHead
          eyebrow="The platform"
          title={
            <>
              The analysis is software.
              <br />
              The judgment is human.
            </>
          }
          lede="The platform does the repetitive, high-volume work across every meter and system. Certified energy professionals make the calls a person must own — and sign them. Engineer-reviewed audits, retro-commissioning and IPMVP-aligned measurement and verification are how they do it."
        />

        <div className="mt-14 hidden grid-cols-[1fr_56px_1fr] items-end gap-x-6 lg:grid">
          <p className="instrument flex items-center gap-2 text-teal-soft"><Cpu size={14} /> Software · automated</p>
          <span />
          <p className="instrument flex items-center gap-2 text-white/80"><PenLine size={14} /> Engineer · decides & signs</p>
        </div>

        <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {STAGES.map((s, i) => (
            <InView as="li" key={s.n} delay={i * 0.05} className="grid gap-3 py-5 lg:grid-cols-[1fr_56px_1fr] lg:items-center lg:gap-x-6">
              <div className="flex items-start gap-4">
                <span className="tabular mt-0.5 font-mono text-[11px] font-semibold tracking-widest text-teal-soft">0{s.n}</span>
                <div>
                  <p className="text-[16px] font-semibold tracking-tight lg:hidden">{s.name}</p>
                  <p className="text-[14px] leading-relaxed text-white/72">{s.software}</p>
                </div>
              </div>
              <div className="hidden items-center justify-center lg:flex" aria-hidden>
                <span className={cn("h-px w-full", s.engineer ? "bg-gradient-to-r from-teal-soft to-white/70" : "bg-white/12")} />
              </div>
              <div className="pl-8 lg:pl-0">
                <p className="hidden text-[16px] font-semibold tracking-tight lg:block">{s.name}</p>
                {s.engineer ? (
                  <p className="flex items-start gap-2 text-[14px] leading-relaxed text-white">
                    <BadgeCheck size={16} className="mt-0.5 shrink-0 text-white/70" aria-hidden />
                    {s.engineer}
                  </p>
                ) : (
                  <p className="instrument text-[9.5px] text-white/35">No decision needed — automated</p>
                )}
              </div>
            </InView>
          ))}
        </ol>

        <p className="mt-8 max-w-2xl text-[13.5px] leading-relaxed text-white/50">
          Enerlytics never writes a setpoint and never replaces a professional
          certification. Decision support with engineer-graded confidence —
          that boundary is the product, not a limitation of it.
        </p>
      </div>
    </SectionFrame>
  );
}
