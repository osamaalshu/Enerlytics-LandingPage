"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  to: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
  formatter?: (value: number) => string;
}

function defaultFormat(value: number, decimals: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Renders a number that ticks from `from` → `to` when the element scrolls into
 * view. SSR renders the final value (good for SEO/social previews) — once
 * hydration completes, the component resets to `from` and animates up.
 */
export function AnimatedCounter({
  to,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  delay = 0,
  className,
  formatter,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const format = formatter ?? ((v: number) => defaultFormat(v, decimals));
  const [hasMounted, setHasMounted] = useState(false);
  const [value, setValue] = useState<number>(to);

  useEffect(() => {
    setHasMounted(true);
    setValue(reduced ? to : from);
  }, [from, to, reduced]);

  useEffect(() => {
    if (!hasMounted || reduced || !inView) return;
    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return controls.stop;
  }, [hasMounted, reduced, inView, from, to, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the final value once; the ticking digits would
          otherwise be announced as a stream of changing text. */}
      <span aria-hidden="true">
        {prefix}
        {format(value)}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {format(to)}
        {suffix}
      </span>
    </span>
  );
}
