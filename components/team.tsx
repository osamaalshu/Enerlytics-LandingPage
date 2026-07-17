"use client";

import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

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
];

export function Team() {
  return (
    <section id="team" className="bg-mist/40 py-24 sm:py-28">
      <div className="container-narrow">
        <Reveal className="max-w-2xl">
          <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-[44px]">
            Energy operators, engineers, and AI builders.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray">
            Built by people who have run the audits, written the algorithms, and
            negotiated the bills.
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.07}
        >
          {team.map((m) => (
            <RevealItem as="li" key={m.name}>
              <div className="hover-lift group flex h-full flex-col gap-4 rounded-2xl border border-navy/10 bg-white p-6 shadow-[var(--shadow-card)] hover:border-teal/35">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="tabular flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-[14px] font-semibold tracking-tight text-white"
                  >
                    {m.initials}
                  </span>
                  <div>
                    <p className="text-[15.5px] font-semibold tracking-tight text-navy">
                      {m.name}
                    </p>
                    <p className="text-[12.5px] font-medium uppercase tracking-[0.12em] text-teal">
                      {m.role}
                    </p>
                  </div>
                </div>
                <p className="text-[13.5px] leading-relaxed text-gray">{m.bio}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
