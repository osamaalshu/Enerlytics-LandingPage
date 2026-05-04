"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
  /** Z-axis lift on hover (px). */
  lift?: number;
  /** Adds a soft sheen that follows the cursor. */
  sheen?: boolean;
}

export function TiltCard({
  children,
  className,
  max = 8,
  lift = 0,
  sheen = false,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const z = useMotionValue(0);
  const px = useMotionValue(50);
  const py = useMotionValue(50);

  const sRx = useSpring(rx, { stiffness: 180, damping: 18, mass: 0.4 });
  const sRy = useSpring(ry, { stiffness: 180, damping: 18, mass: 0.4 });
  const sZ = useSpring(z, { stiffness: 180, damping: 18, mass: 0.4 });
  const sPx = useSpring(px, { stiffness: 180, damping: 24 });
  const sPy = useSpring(py, { stiffness: 180, damping: 24 });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      const nx = (cx / r.width) * 2 - 1;
      const ny = (cy / r.height) * 2 - 1;
      ry.set(nx * max);
      rx.set(-ny * max);
      z.set(lift);
      px.set((cx / r.width) * 100);
      py.set((cy / r.height) * 100);
    };

    const onLeave = () => {
      rx.set(0);
      ry.set(0);
      z.set(0);
      px.set(50);
      py.set(50);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, max, lift, rx, ry, z, px, py]);

  const sheenBg = useMotionTemplate`radial-gradient(420px circle at ${sPx}% ${sPy}%, rgba(255,255,255,0.12), transparent 55%)`;

  return (
    <motion.div
      ref={ref}
      className={cn("relative will-change-transform", className)}
      style={{
        rotateX: sRx,
        rotateY: sRy,
        z: sZ,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
      {sheen && !reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-70 mix-blend-overlay"
          style={{ background: sheenBg }}
        />
      )}
    </motion.div>
  );
}
