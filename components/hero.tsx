import { ArrowRight } from "lucide-react";
import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { LiveDashboard } from "@/components/live-dashboard";

/**
 * Hero — entrance is pure CSS (.rise) so the first screen renders even if
 * JavaScript stalls. The signature stays: the live cost monitor below.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-navy pt-32 pb-20 text-white sm:pt-36 lg:pb-28"
    >
      <AuroraBackground />
      <div className="absolute inset-0 bg-dotgrid opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-navy"
        aria-hidden
      />

      <CursorSpotlight tone="blue" intensity={0.18} size={640} className="container-narrow">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="rise text-balance text-5xl font-bold leading-[0.98] tracking-[-0.03em] sm:text-7xl lg:text-[80px]">
            Watch your facility
            <br />
            <span className="bg-gradient-to-r from-teal-fg via-teal-soft to-teal-fg bg-clip-text text-transparent">
              spend in real time.
            </span>
          </h1>

          <p className="rise rise-1 mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-white/65">
            Under Oman&apos;s Cost-Reflective Tariff, every kilowatt-hour has a
            price. Enerlytics meters the cost{" "}
            <span className="font-medium text-white">as it happens</span> — then
            finds the cause, prices the fix, and proves the savings. Month
            after month.
          </p>

          <div className="rise rise-2 mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="#contact" size="lg" className="group">
              Book a demo
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Button>
            <Button href="#how" size="lg" variant="secondary">
              See how we do it
            </Button>
          </div>
        </div>

        {/* Signature: a live cost monitor — the facility spending, right now. */}
        <div className="rise rise-3 relative mx-auto mt-16 max-w-4xl">
          <div className="absolute -inset-8 -z-10 rounded-[44px] bg-teal/10 blur-3xl" aria-hidden />
          <LiveDashboard />
          <p className="mt-3 text-center font-mono text-[10px] tracking-wide text-white/30">
            Illustrative live simulation
          </p>
        </div>
      </CursorSpotlight>
    </section>
  );
}
