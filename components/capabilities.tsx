"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import type { ReactNode } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

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
        <Reveal className="max-w-2xl">
          <Eyebrow>Platform capabilities</Eyebrow>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-[44px]">
            Five tools, one source of truth for energy cost.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            Built natively for Oman&apos;s CRT framework — the platform turns
            meter data into decisions your operations, finance, and compliance
            teams can share.
          </p>
        </Reveal>

        <RevealGroup
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
        >
          {capabilities.map((c, i) => (
            <RevealItem
              key={c.title}
              className={cn(i === 0 ? "lg:row-span-2" : "")}
            >
              <CapabilityCard
                icon={c.icon}
                title={c.title}
                body={c.body}
                featured={i === 0}
                live={
                  i === 0 ? (
                    <div className="mt-auto rounded-xl border border-navy/10 bg-mist/70 p-4">
                      <p className="eyebrow text-navy/55">Live signal</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-navy/80">
                        Sub-15-minute granularity. Aggregated to circuits, sites,
                        and portfolios.
                      </p>
                    </div>
                  ) : null
                }
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

interface CapabilityCardProps {
  icon: string;
  title: string;
  body: string;
  featured?: boolean;
  live?: ReactNode;
}

function CapabilityCard({ icon, title, body, featured, live }: CapabilityCardProps) {
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(37,99,235,0.13), transparent 55%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <motion.article
      onMouseMove={handleMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-navy/10 bg-white p-6 shadow-[var(--shadow-card)] transition-colors hover:border-blue/30",
        featured && "lg:p-8",
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div className="relative">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-mist transition-colors group-hover:bg-blue/10">
          <Image
            src={icon}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]"
          />
        </div>
      </div>
      <div className="relative">
        <h3 className="text-[17px] font-semibold tracking-tight text-navy">
          {title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-gray">{body}</p>
      </div>
      {live}
    </motion.article>
  );
}
