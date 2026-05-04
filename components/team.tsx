"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";

const team = [
  {
    name: "Muath Al Hinai",
    role: "Founder & CEO",
    bio: "MSc in Energy Systems. 3+ years modeling energy and financial decisions in the US, including techno-economics for solar and storage.",
    initials: "MA",
  },
  {
    name: "Osama Al Shuaili",
    role: "Co-Founder & CTO",
    bio: "MSc AI from Imperial. IoT and predictive analytics. Applied AI to medical imaging reliability before turning it on energy data.",
    initials: "OA",
  },
  {
    name: "Qusai Al Badawi",
    role: "Co-Founder & COO",
    bio: "Retro-commissioning specialist. Delivered multi-site energy projects at OQAE and HEAPY with PMP-aligned execution.",
    initials: "QA",
  },
  {
    name: "Mahdi Abuhoms",
    role: "Systems Architect",
    bio: "MSc Energy & Sustainability. CO₂ compliance and reporting consultant in Norway. Designed national-scale energy systems.",
    initials: "MH",
  },
  {
    name: "Hicham Lahmidi",
    role: "Strategic Advisor",
    bio: "PhD Engineering, 5× AEE certified. COO of Elithis Solutions (€9M). 25 years of institutional energy governance.",
    initials: "HL",
  },
];

export function Team() {
  return (
    <section id="team" className="bg-mist/40 py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="max-w-2xl">
          <Eyebrow>Team</Eyebrow>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-[44px]">
            Energy operators, engineers, and AI builders.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            Built by people who have run the audits, written the algorithms, and
            negotiated the bills.
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
        >
          {team.map((m) => (
            <RevealItem as="li" key={m.name}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-navy/10 bg-white p-6 shadow-[var(--shadow-card)] transition-colors hover:border-blue/30"
              >
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="tabular flex h-12 w-12 items-center justify-center rounded-full bg-navy text-[14px] font-semibold tracking-tight text-white transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110"
                  >
                    {m.initials}
                  </span>
                  <div>
                    <p className="text-[15.5px] font-semibold tracking-tight text-navy">
                      {m.name}
                    </p>
                    <p className="text-[12.5px] font-medium uppercase tracking-[0.12em] text-blue">
                      {m.role}
                    </p>
                  </div>
                </div>
                <p className="text-[13.5px] leading-relaxed text-gray">{m.bio}</p>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
