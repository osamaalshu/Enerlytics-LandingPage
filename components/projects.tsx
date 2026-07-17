"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

/**
 * Projects — proof the company is real and in the field. FACTS ONLY, per the
 * claims register: real client identities, real statuses, no invented savings
 * percentages. The credibility here is precision, not big numbers.
 */
const projects = [
  {
    name: "Al Hilal Plastics",
    sector: "Manufacturing · Nizwa",
    status: "Live pilot",
    statusTone: "green" as const,
    blurb:
      "Plastics factory pilot: bills validated against the CRT to the baisa, production-energy baselines built, chiller diagnostics wired — sensors landing on the line now.",
    metric: "~0%",
    metricLabel: "bill variance",
  },
  {
    name: "OQ Gas Networks",
    sector: "Gas infrastructure · Compression",
    status: "In design",
    statusTone: "blue" as const,
    blurb:
      "Physics-based diagnostics for natural-gas compression trains — the compressor engine is built and tested, deployment scoped with the OQ GN team.",
    metric: "24/7",
    metricLabel: "monitored trains",
  },
  {
    name: "OQ Accelerator cohort",
    sector: "Programme · Portfolio",
    status: "Partner",
    statusTone: "blue" as const,
    blurb:
      "Selected into Oman's flagship accelerator to bring CRT-native energy intelligence to partner sites across the country.",
    metric: "Multi-site",
    metricLabel: "rollout path",
  },
];

export function Projects() {
  return (
    <section id="projects" className="bg-mist/40 py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-teal">Projects</span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-navy sm:text-5xl">
            Already in the field.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            Enerlytics runs on real industrial sites in Oman today — and we only
            publish what the data can defend.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-3" stagger={0.1}>
          {projects.map((p) => (
            <RevealItem key={p.name}>
              <ProjectCard {...p} />
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 font-mono text-[11px] tracking-wide text-navy/35">
          Savings figures are published only after IPMVP-aligned verification.
        </p>
      </div>
    </section>
  );
}

function ProjectCard({
  name,
  sector,
  status,
  statusTone,
  blurb,
  metric,
  metricLabel,
}: {
  name: string;
  sector: string;
  status: string;
  statusTone: "green" | "blue";
  blurb: string;
  metric: string;
  metricLabel: string;
}) {
  const tone =
    statusTone === "green" ? "bg-green/12 text-green" : "bg-teal/12 text-teal";

  return (
    <article className="hover-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white p-7 shadow-[var(--shadow-card)] hover:border-teal/35">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] ${tone}`}
        >
          {status}
        </span>
        <ArrowUpRight
          size={18}
          className="text-navy/25 transition-colors duration-200 group-hover:text-teal"
        />
      </div>

      <div className="mt-6">
        <span className="tabular text-4xl font-bold tracking-tight text-navy">
          {metric}
        </span>
        <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.12em] text-navy/45">
          {metricLabel}
        </span>
      </div>

      <h3 className="mt-6 text-[19px] font-semibold tracking-tight text-navy">
        {name}
      </h3>
      <p className="mt-0.5 font-mono text-[11px] tracking-wide text-navy/45">
        {sector}
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-gray">{blurb}</p>
    </article>
  );
}
