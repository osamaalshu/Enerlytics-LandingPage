"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * InView — a viewport-entrance reveal that can never hide content.
 *
 * Rule from the blank-page incident: content is not gated behind JavaScript.
 * The server render is fully visible. Only after hydration (JS provably
 * running) does the element start hidden and reveal when it enters view.
 * Reduced-motion visitors always get the static, visible version.
 */
export function InView({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article" | "p";
}) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const Tag = motion[as];
  if (!ready || reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
