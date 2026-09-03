import { cn } from "@/lib/cn";

/**
 * ChapterMarker — a slim film-chapter rule instead of a full black title
 * card (the cards made the page read like a slide deck). Numeral, title,
 * one line, a hairline. ~20vh. The chapter's own composition does the rest.
 */
export function ChapterMarker({
  numeral,
  title,
  line,
  id,
  tone = "ink",
}: {
  numeral: string;
  title: string;
  line?: string;
  id?: string;
  tone?: "ink" | "paper";
}) {
  const dark = tone === "ink";
  return (
    <div id={id} className={cn("relative", dark ? "bg-ink text-white" : "bg-paper text-navy")}>
      <div className="container-narrow flex flex-col gap-4 border-t border-current/15 py-10 sm:flex-row sm:items-baseline sm:gap-10 sm:py-14">
        <span className={cn("instrument shrink-0 text-[11px]", dark ? "text-teal-soft" : "text-teal-deep")}>
          Chapter {numeral}
        </span>
        <h2 className="text-[34px] font-black leading-none tracking-[-0.04em] sm:text-[44px]">{title}</h2>
        {line && (
          <p className={cn("max-w-md text-[15px] leading-relaxed sm:ml-auto sm:text-right", dark ? "text-white/60" : "text-gray")}>
            {line}
          </p>
        )}
      </div>
    </div>
  );
}
