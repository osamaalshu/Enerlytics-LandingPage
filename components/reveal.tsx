import type { ReactNode } from "react";

/**
 * Reveal — HARD RULE after the blank-page incident: content is NEVER hidden
 * behind JavaScript. These wrappers render fully visible, always. Motion on
 * this site is decoration (hover, the loop ring, counters) — never a gate in
 * front of content. The animation-related props are accepted and ignored so
 * existing call sites keep working.
 */

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

export function Reveal({ children, as = "div", className, id }: RevealProps) {
  const Component = as;
  return (
    <Component className={className} id={id}>
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

export function RevealGroup({ children, as = "div", className }: RevealGroupProps) {
  const Component = as;
  return <Component className={className}>{children}</Component>;
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  as?: "div" | "li" | "article";
}

export function RevealItem({ children, as = "div", className }: RevealItemProps) {
  const Component = as;
  return <Component className={className}>{children}</Component>;
}
