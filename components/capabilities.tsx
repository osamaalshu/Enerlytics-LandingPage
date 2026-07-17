"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Wrench } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

/**
 * The platform — all six stages IN ORDER (1→6) so the sequence never breaks.
 * Stages 1–3 and 6 are software cards; stages 4–5 render as engineer-led
 * cards that point to Services. A visitor reads one straight line, no
 * arithmetic. Copy is claims-governed: physics-based, no "AI" hand-waving.
 */

const CHIP = ["#0b2545", "#13315c", "#1d4e89", "#2a6f97", "#168aad", "#34a0a4"];

type Stage = {
  n: number;
  name: string;
  title: string;
  body: string;
  icon?: string;
  engineer?: boolean;
  lucide?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const stages: Stage[] = [
  {
    n: 1,
    name: "Collect",
    icon: "/brand/icons/insights.png",
    title: "Bill truth, to the baisa",
    body: "Your CRT bill reconstructed and validated line by line — BST, TUoS, DUoS, standing charges, time-of-use bands. If the bill is wrong, you'll know exactly where.",
  },
  {
    n: 2,
    name: "Understand",
    icon: "/brand/icons/building.png",
    title: "Baselines, benchmarks & peak exposure",
    body: "Site-specific baselines and three-tier benchmarking put every month in context — and show how much of your spend concentrates in the costly peak windows.",
  },
  {
    n: 3,
    name: "Diagnose",
    icon: "/brand/icons/optimization.png",
    title: "Physics-based diagnostics",
    body: "First-principles fault detection on chillers, compressors, pumps and AHUs — each finding graded for confidence and priced in OMR per hour.",
  },
  {
    n: 4,
    name: "Improve",
    engineer: true,
    lucide: Wrench,
    title: "Audits & fixes, engineer-led",
    body: "Data-assisted energy audits and retro-commissioning — our engineers inspect, decide, and sign, working from the platform's evidence.",
  },
  {
    n: 5,
    name: "Verify",
    engineer: true,
    lucide: BadgeCheck,
    title: "Savings, proven — engineer-led",
    body: "IPMVP-aligned measurement and verification against frozen baselines. Savings are approved by qualified professionals, not assumed.",
  },
  {
    n: 6,
    name: "Report",
    icon: "/brand/icons/cost_down.png",
    title: "Evidence-grade reporting",
    body: "Board-ready reports with a full audit trail: versioned rates, cited sources, and findings separated by what's measured versus estimated.",
  },
];

export function Capabilities() {
  return (
    <section id="platform" className="bg-mist/40 py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-teal">The platform</span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-navy sm:text-5xl">
            The analysis is software.
            <br />
            The judgment is human.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            The same six stages, in order. The platform does the heavy
            analysis; our engineers make the calls that need a person — and
            sign them.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {stages.map((s) => (
            <RevealItem key={s.n}>
              {s.engineer && s.lucide ? (
                <EngineerCard n={s.n} name={s.name} lucide={s.lucide} title={s.title} body={s.body} />
              ) : (
                <SoftwareCard n={s.n} name={s.name} icon={s.icon} title={s.title} body={s.body} />
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function StageChip({ n, name }: { n: number; name: string }) {
  return (
    <span
      className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-white"
      style={{ background: CHIP[n - 1] }}
    >
      0{n} · {name.toUpperCase()}
    </span>
  );
}

function SoftwareCard({
  n,
  name,
  icon,
  title,
  body,
}: {
  n: number;
  name: string;
  icon?: string;
  title: string;
  body: string;
}) {
  return (
    <article className="hover-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white p-6 shadow-[var(--shadow-card)] hover:border-teal/35">
      <StageChip n={n} name={name} />
      <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-mist ring-1 ring-navy/8">
        {icon && (
          <Image
            src={icon}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
        )}
      </div>
      <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-navy">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-gray">{body}</p>
    </article>
  );
}

function EngineerCard({
  n,
  name,
  lucide: Icon,
  title,
  body,
}: {
  n: number;
  name: string;
  lucide: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  body: string;
}) {
  return (
    <article className="hover-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-navy/20 bg-mist/50 p-6 hover:border-teal/45">
      <StageChip n={n} name={name} />
      <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-navy text-white">
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-navy">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-gray">{body}</p>
      <Link
        href="#services"
        className="mt-4 inline-flex items-center gap-1.5 border-t border-navy/8 pt-3 font-mono text-[11px] tracking-wide text-teal transition-colors hover:text-teal-soft"
      >
        WITH OUR ENGINEERS — SEE SERVICES
        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}
