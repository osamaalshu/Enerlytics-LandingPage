"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { easeOutExpo } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
  as?: "div" | "section" | "article" | "li" | "ul" | "ol" | "header";
  className?: string;
  id?: string;
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.75,
  amount = 0.25,
  as = "div",
  className,
  id,
}: RevealProps) {
  const reduced = useReducedMotion();
  const variants: Variants = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, delay, ease: easeOutExpo },
        },
      };

  const Component = motion[as];

  return (
    <Component
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
      className={className}
      id={id}
    >
      {children}
    </Component>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
  as?: "div" | "ul" | "ol" | "section";
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  amount = 0.2,
  as = "div",
}: RevealGroupProps) {
  const reduced = useReducedMotion();
  const variants: Variants = reduced
    ? { hidden: {}, show: {} }
    : {
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      };

  const Component = motion[as];

  return (
    <Component
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
      className={className}
    >
      {children}
    </Component>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  as?: "div" | "li" | "article";
}

export function RevealItem({
  children,
  className,
  y = 22,
  duration = 0.7,
  as = "div",
}: RevealItemProps) {
  const reduced = useReducedMotion();
  const variants: Variants = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: easeOutExpo },
        },
      };

  const Component = motion[as];

  return (
    <Component variants={variants} className={className}>
      {children}
    </Component>
  );
}
