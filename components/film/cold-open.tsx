"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepthPlate } from "@/components/cinematic/depth-plate";
import { Callout } from "@/components/cinematic/metric-overlay";

/**
 * 00 · Cold open.
 *
 * A film, not a landing page. Black. One sentence. Then the world fades in
 * beneath it and the promise takes the frame. The whole opening is a pure
 * CSS timeline (no JavaScript needed for the first ten seconds); scroll
 * then parallaxes the plate through the depth shader and lifts the copy.
 *
 * Retune ANCHORS after changing the hero frame (% of the plate).
 */
const ANCHORS = {
  cooling: { x: 62, y: 49 },
  solar: { x: 90, y: 58 },
  storage: { x: 64, y: 71 },
} as const;

export function ColdOpen() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.85]);
  const lift = useTransform(scrollYProgress, [0, 0.6], [0, -90]);
  const fade = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="grain relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-black text-white"
      aria-label="Enerlytics — watch your facility spend in real time"
    >
      {/* the world, fading in beneath the first line */}
      <div className="open-world absolute inset-0">
        <DepthPlate
          id="h01"
          alt="Industrial facility at blue hour with rooftop solar, a ground-mount PV field, battery containers and a substation"
          focal="62% 55%"
          priority
        />
        <div className="scrim-b absolute inset-0" aria-hidden />
        <div className="scrim-l absolute inset-0" aria-hidden />
      </div>
      <motion.div className="absolute inset-0 bg-black" style={{ opacity: reduced ? 0 : dim }} aria-hidden />

      {/* letterbox */}
      <div className="open-bar absolute inset-x-0 top-0 h-[6vh] bg-black" aria-hidden />
      <div className="open-bar absolute inset-x-0 bottom-0 h-[6vh] bg-black" aria-hidden />

      {/* beat 1 — the sentence on black */}
      <div className="open-line pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
        <p className="max-w-3xl text-balance text-[26px] font-medium leading-[1.2] tracking-[-0.02em] text-white/85 sm:text-[38px]">
          The largest cost in your facility is the one nobody can see.
        </p>
      </div>

      {/* beat 2 — anchored instruments on the world (desktop) */}
      <div className="open-copy absolute inset-0 hidden lg:block" aria-hidden>
        <Callout {...ANCHORS.cooling} dx={130} dy={-70} label="Cooling plant" value={612} unit="kW" tone="load" delay={1} />
        <Callout {...ANCHORS.solar} dx={-150} dy={-60} label="Solar" value={184} unit="kW" note="expected 190" tone="pv" delay={2} />
        <Callout {...ANCHORS.storage} dx={120} dy={-56} label="Storage" value={62} unit="% SoC" note="DISCHARGING" tone="bess" delay={3} />
      </div>

      {/* beat 2 — the promise */}
      <motion.div
        className="open-copy container-narrow relative z-10 flex h-full flex-col justify-end pb-[12vh]"
        style={reduced ? undefined : { y: lift, opacity: fade }}
      >
        <div className="max-w-3xl">
          <span className="instrument text-teal-fg/80">The operating intelligence layer for physical energy</span>
          <h1 className="mt-5 text-balance text-[48px] font-black leading-[0.94] tracking-[-0.04em] sm:text-[80px] lg:text-[108px]">
            Watch your facility spend in real time.
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="#contact" size="lg" className="group">
              Book a demo
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
            <a href="#see" className="instrument text-white/60 transition hover:text-white">
              Watch the film ↓
            </a>
          </div>
        </div>
      </motion.div>

      <style>{`
        .open-world { opacity: 0; animation: open-world 2.2s ease-out 1.3s forwards; }
        .open-line  { opacity: 0; animation: open-line 3.4s ease-in-out 0.3s forwards; }
        .open-copy  { opacity: 0; animation: open-copy 1.4s cubic-bezier(.16,1,.3,1) 3.9s forwards; }
        .open-bar   { transform: scaleY(1); transform-origin: center; animation: open-bar 1.2s cubic-bezier(.16,1,.3,1) 4.6s forwards; }
        @keyframes open-world { to { opacity: 1; } }
        @keyframes open-line  { 0% { opacity: 0; transform: translateY(12px); } 18% { opacity: 1; transform: none; } 78% { opacity: 1; } 100% { opacity: 0; transform: translateY(-14px); } }
        @keyframes open-copy  { to { opacity: 1; } }
        @keyframes open-bar   { to { transform: scaleY(0.35); } }
        @media (prefers-reduced-motion: reduce) {
          .open-world, .open-copy { opacity: 1; animation: none; }
          .open-line { display: none; }
          .open-bar { animation: none; transform: scaleY(0.35); }
        }
      `}</style>
    </section>
  );
}
