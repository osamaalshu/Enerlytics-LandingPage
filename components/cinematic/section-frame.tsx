import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * SectionFrame — the one spacing / theme / text-width contract for every
 * chapter, so the page reads as a single authored system (brief §12.2).
 *
 * tone   ink   — deepest cinematic ground (media chapters)
 *        navy  — brand dark (instrument chapters)
 *        paper — calm commercial chapters after the cinema (services, team)
 *        mist  — light alternate
 * pad    "none" for full-bleed scenes that manage their own height.
 */
const tones = {
  ink: "bg-ink text-white",
  navy: "bg-navy text-white",
  paper: "bg-paper text-navy",
  mist: "bg-mist/50 text-navy",
} as const;

export function SectionFrame({
  id,
  tone = "navy",
  pad = "default",
  className,
  children,
  as: Component = "section",
}: {
  id?: string;
  tone?: keyof typeof tones;
  pad?: "default" | "none";
  className?: string;
  children: ReactNode;
  as?: "section" | "div" | "footer";
}) {
  return (
    <Component
      id={id}
      className={cn(
        "relative",
        tones[tone],
        pad === "default" && "py-24 sm:py-32",
        className,
      )}
    >
      {children}
    </Component>
  );
}

/**
 * ChapterHead — eyebrow + display headline + one lede. Large negative space,
 * left-aligned by default (brief §5.1: do not centre everything).
 */
export function ChapterHead({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "instrument",
            dark ? "text-teal-soft" : "text-teal",
            align === "center" && "block",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-4 text-balance text-4xl font-bold leading-[1.02] tracking-[-0.025em] sm:text-5xl lg:text-[56px]",
          dark ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-6 text-pretty text-[16px] leading-relaxed sm:text-[17px]",
            dark ? "text-white/62" : "text-gray",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
