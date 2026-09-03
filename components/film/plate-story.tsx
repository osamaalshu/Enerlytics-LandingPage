import type { ReactNode } from "react";
import { DepthPlate } from "@/components/cinematic/depth-plate";
import { InView } from "@/components/cinematic/in-view";
import { cn } from "@/lib/cn";

/**
 * PlateStory — the film's workhorse layout: a plate stays pinned (CSS
 * sticky, no scroll-jacking) while a column of large statements scrolls
 * over it. Each beat is one idea. The plate parallaxes through the depth
 * shader as the beats pass. Mobile: same, narrower, plate shorter.
 */
export function PlateStory({
  id,
  plate,
  alt,
  focal,
  beats,
  align = "left",
  overlay,
  strength,
  className,
  children,
}: {
  id?: string;
  plate: string;
  alt: string;
  focal?: string;
  /** each beat = one screen of scroll */
  beats: ReactNode[];
  align?: "left" | "right" | "center";
  /** extra content layered over the plate (callouts) */
  overlay?: ReactNode;
  strength?: number;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={cn("grain relative isolate bg-ink text-white", className)}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <DepthPlate id={plate} alt={alt} focal={focal} strength={strength} />
        <div className="scrim-b absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-ink/45 lg:hidden" aria-hidden />
        <div className={cn("absolute inset-0 hidden lg:block", align === "right" ? "scrim-l rotate-180" : "scrim-l")} aria-hidden />
        <div className="absolute inset-x-0 top-0 h-[2vh] bg-black" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-[2vh] bg-black" aria-hidden />
        {overlay}
      </div>
      <div className="relative z-10 -mt-[100svh]">
        {beats.map((b, i) => (
          <div
            key={i}
            className={cn(
              "container-narrow flex min-h-[100svh] items-end pb-[14vh] sm:items-center sm:pb-0",
              align === "right" && "justify-end text-right",
              align === "center" && "justify-center text-center",
            )}
          >
            <InView className="max-w-3xl">{b}</InView>
          </div>
        ))}
        {children}
      </div>
    </section>
  );
}

/** Big statement inside a beat. */
export function Statement({
  kicker,
  children,
  line,
  size = "lg",
}: {
  kicker?: string;
  children: ReactNode;
  line?: ReactNode;
  size?: "lg" | "xl";
}) {
  return (
    <>
      {kicker && <span className="instrument text-teal-fg/80">{kicker}</span>}
      <h3
        className={cn(
          "mt-4 text-balance font-black leading-[0.94] tracking-[-0.04em]",
          size === "xl" ? "text-[44px] sm:text-[72px] lg:text-[96px]" : "text-[36px] sm:text-[56px] lg:text-[72px]",
        )}
      >
        {children}
      </h3>
      {line && <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-white/68 sm:text-[19px]">{line}</p>}
    </>
  );
}
