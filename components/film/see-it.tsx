import { ChapterMarker } from "@/components/film/chapter-marker";
import { MediaSource } from "@/components/cinematic/media-source";
import { StateChip } from "@/components/cinematic/metric-overlay";
import { InView } from "@/components/cinematic/in-view";
import { cn } from "@/lib/cn";

/**
 * II · See it — the assets, as a filmstrip.
 *
 * Five systems, five frames from the same site, each with one live reading
 * and a state. An editorial contact sheet, not a card grid: tall frames,
 * staggered, big word on each. Systems language (cooling, electrical, solar,
 * storage, grid), never part numbers.
 */
const ASSETS = [
  { id: "h03", name: "Cooling", read: "612 kW", note: "2.1 K off its curve", state: "WARNING", focal: "18% 50%" },
  { id: "h10", name: "Electrical", read: "1.42 MW", note: "main intake · peak band", state: "NORMAL", focal: "20% 50%" },
  { id: "h04", name: "Solar", read: "184 kW", note: "expected 190", state: "GENERATING", focal: "35% 55%" },
  { id: "h05", name: "Storage", read: "62 % SoC", note: "140 kW out", state: "DISCHARGING", focal: "70% 50%" },
  { id: "h09", name: "Grid", read: "OMR 1,284", note: "spent today", state: "NORMAL", focal: "30% 60%" },
] as const;

export function SeeIt() {
  return (
    <>
      <ChapterMarker id="see" numeral="II" title="See it." line="Your facility, made legible — every system that uses, makes or stores energy, in one live picture." />
      <section className="grain relative isolate overflow-hidden bg-ink pb-24 text-white sm:pb-32" aria-labelledby="see-title">
        <div className="container-narrow">
          <InView className="max-w-3xl">
            <h3 id="see-title" className="text-balance text-[40px] font-black leading-[0.94] tracking-[-0.04em] sm:text-[64px] lg:text-[84px]">
              Everything that uses, makes or stores energy.
            </h3>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/68">
              Meters, bills, plant systems, inverters and batteries read in one model. Every asset
              has a state. Every state has a cost. Read-only — we never touch your controls.
            </p>
          </InView>
        </div>

        <ul className="rail mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[max(1.5rem,calc((100vw-76rem)/2+1.5rem))] pb-6 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-[max(1.5rem,calc((100vw-76rem)/2+1.5rem))]" aria-label="Systems we see">
          {ASSETS.map((a, i) => (
            <li key={a.id} className={cn("w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-auto", i % 2 === 1 && "lg:mt-16")}>
              <InView delay={i * 0.06}>
                <figure className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-navy">
                  <MediaSource id={a.id} alt={`${a.name} — one of the systems Enerlytics reads`} focal={a.focal} className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
                  <div className="scrim-b absolute inset-0" aria-hidden />
                  <div className="absolute left-3 top-3"><StateChip state={a.state} className="bg-ink/80" /></div>
                  <figcaption className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[30px] font-black leading-none tracking-[-0.035em]">{a.name}<span className="text-teal-soft">.</span></p>
                    <p className="tabular mt-2 font-mono text-[15px] font-semibold text-white/95">{a.read}</p>
                    <p className="font-mono text-[10px] tracking-wide text-white/55">{a.note}</p>
                  </figcaption>
                </figure>
              </InView>
            </li>
          ))}
        </ul>
        <p className="container-narrow instrument mt-2 text-[9px] text-white/40">Illustrative readings · one site, one evening</p>
      </section>
    </>
  );
}
