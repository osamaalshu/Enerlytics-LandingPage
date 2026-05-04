"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CursorSpotlightProps {
  children: ReactNode;
  className?: string;
  /** Tailwind-friendly tone — controls the spotlight color. */
  tone?: "blue" | "white";
  /** Spotlight diameter. */
  size?: number;
  /** Opacity of the spotlight gradient. */
  intensity?: number;
}

/**
 * A wrapper that renders a soft radial gradient that tracks the cursor inside
 * the element. Typed for keyboard-only / reduced-motion users (no follow).
 */
export function CursorSpotlight({
  children,
  className,
  tone = "blue",
  size = 520,
  intensity = 0.18,
}: CursorSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(-size);
  const y = useMotionValue(-size);
  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left - size / 2);
      y.set(e.clientY - r.top - size / 2);
    };
    const onLeave = () => {
      x.set(-size);
      y.set(-size);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, size, x, y]);

  const color =
    tone === "white"
      ? `rgba(255,255,255,${intensity})`
      : `rgba(59,130,246,${intensity})`;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full blur-3xl"
          style={{
            width: size,
            height: size,
            x: sx,
            y: sy,
            background: `radial-gradient(circle at center, ${color} 0%, transparent 65%)`,
          }}
        />
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
