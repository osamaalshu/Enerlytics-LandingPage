"use client";

import { useRef, useState, type ReactNode } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useCinematicOk } from "@/lib/scroll";
import { cn } from "@/lib/cn";

/**
 * PinnedChapter — the reusable scroll-progress wrapper for a "pinned scene +
 * changing states" sequence (brief §9.1 / §12.2). One implementation, used by
 * every pinned chapter, instead of hand-coded listeners per section.
 *
 * Desktop with motion allowed: the outer element is `steps` viewports tall,
 * the inner stage is sticky, and `step` advances with scroll. A thin progress
 * rail on the right gives a sense of progress (§9.2: cue if a pinned
 * sequence lasts more than one viewport).
 *
 * Mobile / reduced motion / no JS: no pinning, no scroll-jacking. The same
 * stage renders once with an explicit stepper (tap to advance) — the
 * information is identical and always reachable (§14, §15).
 */
export function PinnedChapter({
  steps,
  labels,
  className,
  stageClassName,
  children,
  ariaLabel,
}: {
  steps: number;
  /** short labels for the progress rail / stepper (one per step) */
  labels: string[];
  className?: string;
  stageClassName?: string;
  ariaLabel: string;
  children: (ctx: { step: number; progress: number; pinned: boolean }) => ReactNode;
}) {
  const ok = useCinematicOk();
  const outer = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!ok) return;
    setProgress(p);
    const s = Math.min(steps - 1, Math.max(0, Math.floor(p * steps)));
    if (s !== step) setStep(s);
  });

  return (
    <div
      ref={outer}
      className={cn("relative", className)}
      style={ok ? { height: `${steps * 100}vh` } : undefined}
      aria-label={ariaLabel}
      role="region"
    >
      <div className={cn(ok ? "sticky top-0 h-screen overflow-hidden" : "relative", stageClassName)}>
        {children({ step, progress: ok ? progress : step / Math.max(1, steps - 1), pinned: ok })}

        {ok ? (
          <ol
            className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-2 lg:flex"
            aria-hidden
          >
            {labels.map((l, i) => (
              <li key={l} className="flex items-center justify-end gap-2">
                <span
                  className={cn(
                    "instrument text-[9px] transition-opacity duration-300",
                    i === step ? "text-white/80 opacity-100" : "opacity-0",
                  )}
                >
                  {l}
                </span>
                <span
                  className={cn(
                    "block h-6 w-px transition-colors duration-300",
                    i <= step ? "bg-teal-soft" : "bg-white/20",
                  )}
                />
              </li>
            ))}
          </ol>
        ) : (
          <Stepper steps={steps} labels={labels} step={step} onStep={setStep} />
        )}
      </div>
    </div>
  );
}

function Stepper({
  steps,
  labels,
  step,
  onStep,
}: {
  steps: number;
  labels: string[];
  step: number;
  onStep: (s: number) => void;
}) {
  return (
    <div className="container-narrow relative z-10 mt-6 flex flex-wrap items-center gap-2 pb-8">
      {Array.from({ length: steps }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onStep(i)}
          aria-pressed={i === step}
          className={cn(
            "instrument rounded-full border px-3 py-1.5 text-[10px] transition-colors",
            i === step
              ? "border-teal-soft bg-teal/20 text-white"
              : "border-white/15 text-white/60 hover:border-white/40 hover:text-white",
          )}
        >
          {i + 1} · {labels[i]}
        </button>
      ))}
    </div>
  );
}
