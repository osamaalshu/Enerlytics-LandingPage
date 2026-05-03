"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMock } from "@/components/dashboard-mock";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-navy pt-28 pb-24 text-white sm:pt-32 lg:pb-36"
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-dotgrid opacity-60" aria-hidden />
      <div
        className="absolute -top-40 left-1/2 h-[640px] w-[1100px] -translate-x-1/2 glow-blue"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-navy"
        aria-hidden
      />

      <div className="container-narrow relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur"
            >
              <Sparkles size={12} className="text-blue-soft" />
              Built natively for Oman&apos;s CRT framework
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[68px]"
            >
              Smarter Buildings.{" "}
              <span className="text-white/90">Lower Costs.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/70"
            >
              Enerlytics turns fragmented utility data into{" "}
              <span className="font-medium text-white">
                live cost intelligence
              </span>
              . Cut energy spend, comply with tariff reform, and operate every
              kilowatt-hour with confidence.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button href="#contact" size="lg">
                Book a Demo
                <ArrowRight size={16} />
              </Button>
              <Button href="#preview" size="lg" variant="secondary">
                See the platform
              </Button>
            </motion.div>

            <motion.dl
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-12 grid max-w-md grid-cols-3 gap-6"
            >
              {[
                { v: "3:1", l: "ROI in year one" },
                { v: "+72%", l: "Peak surcharge avoided" },
                { v: "24/7", l: "Live load visibility" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="tabular text-2xl font-bold text-white">
                    {s.v}
                  </dt>
                  <dd className="mt-1 text-[12px] leading-snug text-white/55">
                    {s.l}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[36px] bg-blue/15 blur-3xl" />
            <DashboardMock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
