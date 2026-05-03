import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "navy" | "blue" | "white";
}

export function Eyebrow({
  className,
  tone = "blue",
  children,
  ...rest
}: EyebrowProps) {
  const toneClass =
    tone === "navy"
      ? "text-navy/70"
      : tone === "white"
        ? "text-white/70"
        : "text-blue";
  return (
    <span className={cn("eyebrow", toneClass, className)} {...rest}>
      <span
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          tone === "navy"
            ? "bg-navy/40"
            : tone === "white"
              ? "bg-white/60"
              : "bg-blue",
        )}
        aria-hidden
      />
      {children}
    </span>
  );
}
