"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

/**
 * Projects / pilots — proof the company is real and already in the field. Each
 * card is a deployment with its sector, status, and the headline metric. Figures
 * are from in-progress pilots and are illustrative pending verification.
 */
const projects = [
  {
    name: "Al Hilal Tower",
    sector: "Commercial · Muscat",
    status: "Live pilot",
    statusTone: "green" as const,
    blurb: "Evening cooling peak shifted out of the costly tariff window across a mixed-use institutional tower.",
    metric: "−31%",
    metricLabel: "peak demand",
  },
  {
    name: "OQ Gas Network",
    sector: "Industrial · Compression station",
    status: "Deploying",
    statusTone: "blue" as const,
    blurb: "Physics-based anomaly detection on natural-gas compression trains, flagging avoidable energy loss in real time.",
    metric: "24/7",
    metricLabel: "live diagnostics",
  },
  {
    name: "OQ Accelerator cohort",
    sector: "Programme · Portfolio",
    status: "Partner",
    statusTone: "blue" as const,
    blurb: "Selected into Oman's flagship accelerator to standardise CRT-native energy governance across partner sites.",
    metric: "Multi-site",
    metricLabel: "rollout",
  },
];

export function Projects() {
  return (
    <section id="projects" className="bg-paper py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-blue">Projects</span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-navy sm:text-5xl">
            Already in the field.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            Enerlytics is running on real institutional and industrial sites
            across Oman today — not slideware.
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
          Pilot figures are illustrative pending independent verification.
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
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(37,99,235,0.1), transparent 55%)`;
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const tone =
    statusTone === "green"
      ? "bg-green/12 text-green"
      : "bg-blue/12 text-blue";

  return (
    <motion.article
      onMouseMove={onMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white p-7 shadow-[var(--shadow-card)] transition-colors hover:border-blue/30"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div className="relative flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] ${tone}`}>
          {status}
        </span>
        <ArrowUpRight size={18} className="text-navy/25 transition-colors group-hover:text-blue" />
      </div>

      <div className="relative mt-6">
        <span className="tabular text-4xl font-bold tracking-tight text-navy">{metric}</span>
        <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.12em] text-navy/45">
          {metricLabel}
        </span>
      </div>

      <h3 className="relative mt-6 text-[19px] font-semibold tracking-tight text-navy">
        {name}
      </h3>
      <p className="relative mt-0.5 font-mono text-[11px] tracking-wide text-navy/45">
        {sector}
      </p>
      <p className="relative mt-3 text-[14px] leading-relaxed text-gray">{blurb}</p>
    </motion.article>
  );
}
