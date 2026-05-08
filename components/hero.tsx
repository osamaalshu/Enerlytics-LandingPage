"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { DashboardMock } from "@/components/dashboard-mock";
import { TiltCard } from "@/components/tilt-card";
import { easeOutExpo } from "@/lib/motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-navy pt-28 pb-24 text-white sm:pt-32 lg:pb-36"
    >
      <AuroraBackground />
      <div className="absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-navy"
        aria-hidden
      />

      <CursorSpotlight tone="blue" intensity={0.22} size={600} className="container-narrow">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.09 } } }}
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur"
            >
              <motion.span
                animate={{ rotate: [0, 14, -14, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-blue-soft"
              >
                <Sparkles size={12} />
              </motion.span>
              Built natively for Oman&apos;s CRT framework
              <span className="ml-2 hidden text-white/45 sm:inline">·</span>
              <span className="hidden tabular text-white/55 sm:inline">
                <Live />
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              className="mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[68px]"
            >
              Smarter Buildings.
              <br />
              <span className="bg-gradient-to-r from-white via-blue-fg to-white bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
                Lower Costs.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.65, ease: easeOutExpo }}
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
              transition={{ duration: 0.55, ease: easeOutExpo }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button href="#contact" size="lg" className="group">
                Book a Demo
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Button>
              <Button href="#preview" size="lg" variant="secondary">
                See the platform
              </Button>
            </motion.div>

            <motion.dl
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.05, ease: easeOutExpo }}
              className="mt-12 grid max-w-md grid-cols-3 gap-6"
            >
              <Stat label="ROI in year one" suffix=":1" to={3} delay={0.4} />
              <Stat
                label="Peak surcharge avoided"
                prefix="+"
                suffix="%"
                to={72}
                delay={0.55}
              />
              <Stat label="Live load visibility" to={24} suffix="/7" delay={0.7} />
            </motion.dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.85, ease: easeOutExpo, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[36px] bg-blue/15 blur-3xl" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <TiltCard max={6} lift={20} sheen className="rounded-[28px]">
                <DashboardMock />
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </CursorSpotlight>
    </section>
  );
}

interface StatProps {
  label: string;
  to: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

function Stat({ label, to, prefix, suffix, delay = 0 }: StatProps) {
  return (
    <div>
      <dt className="tabular text-2xl font-bold text-white">
        <AnimatedCounter
          to={to}
          prefix={prefix}
          suffix={suffix}
          duration={1.4}
          delay={delay}
        />
      </dt>
      <dd className="mt-1 text-[12px] leading-snug text-white/55">{label}</dd>
    </div>
  );
}

function Live() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-green"
          animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
      </span>
      Pilot live · OQ Accelerator
    </span>
  );
}

