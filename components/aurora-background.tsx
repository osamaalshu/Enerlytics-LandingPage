"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLiteAnimations } from "@/lib/use-lite-animations";

interface AuroraBackgroundProps {
  className?: string;
}

/**
 * Two slow-drifting gradient orbs that paint a soft aurora on dark sections.
 * The orbs render statically on touch devices and for reduced-motion users —
 * endlessly animating large blurred layers is a major GPU cost on phones.
 */
export function AuroraBackground({ className }: AuroraBackgroundProps) {
  const reduced = useReducedMotion();
  const lite = useLiteAnimations();
  const still = reduced || lite;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      <motion.div
        className="absolute -top-40 -left-32 h-[640px] w-[640px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.45), transparent 60%)",
        }}
        animate={
          still
            ? undefined
            : { x: [0, 80, -40, 0], y: [0, -30, 30, 0], opacity: [0.55, 0.8, 0.55] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-44 -right-24 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.30), transparent 60%)",
        }}
        animate={
          still
            ? undefined
            : { x: [0, -60, 40, 0], y: [0, 40, -20, 0], opacity: [0.45, 0.7, 0.45] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.20), transparent 60%)",
        }}
        animate={
          still
            ? undefined
            : { x: [-40, 40, -40], y: [-20, 30, -20], opacity: [0.3, 0.55, 0.3] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
