import { ChapterMarker } from "@/components/film/chapter-marker";
import { InView } from "@/components/cinematic/in-view";
import { SiteMap, type Site } from "@/components/film/site-map";
import { Factory, Hotel, Hospital, Server, GraduationCap, Flame, RadioTower, Landmark } from "lucide-react";

/**
 * VII · Every facility — one model, many places.
 * The map replaces the list of names: real locations, different sectors,
 * different assets, one ranking of what matters most across the estate.
 */
const SITES: Site[] = [
  { name: "Sohar", lon: 56.71, lat: 24.35, kind: "Factory · process + cooling", read: "1.42 MW", note: "kWh per tonne tracked", state: "NORMAL" },
  { name: "Muscat", lon: 58.41, lat: 23.59, kind: "Hotel · cooling-driven peaks", read: "OMR 4,120", note: "this month, peak-band share 38 %", state: "WARNING" },
  { name: "Nizwa", lon: 57.53, lat: 22.93, kind: "Campus · 14 buildings", read: "0.61 MW", note: "per-building accountability", state: "NORMAL" },
  { name: "Duqm", lon: 57.70, lat: 19.65, kind: "Data centre · dry coolers", read: "PUE 1.46", note: "mechanical overhead drifting", state: "WARNING" },
  { name: "Salalah", lon: 54.09, lat: 17.02, kind: "Hospital · 24/7 critical", read: "0.88 MW", note: "resilience untouched", state: "NORMAL" },
  { name: "Ibri", lon: 56.52, lat: 23.23, kind: "Solar + storage site", read: "184 kW", note: "expected 190 · SoC 62 %", state: "GENERATING" },
  { name: "Sur", lon: 59.53, lat: 22.57, kind: "Oil & gas · compression", read: "2.1 MW", note: "utility baselines", state: "NORMAL" },
];

const KINDS = [
  { icon: Factory, name: "Factories", line: "Cooling, compressed air, process — priced per unit made." },
  { icon: Hotel, name: "Hotels & resorts", line: "Cooling-driven evening peaks, comfort untouched." },
  { icon: Hospital, name: "Hospitals", line: "24/7 critical load; savings without touching resilience." },
  { icon: Server, name: "Data centres", line: "Mechanical overhead drift, found and priced." },
  { icon: GraduationCap, name: "Campuses & schools", line: "Many buildings, one owner of the bill." },
  { icon: Flame, name: "Oil & gas", line: "Compression, pumping and utilities on a baseline." },
  { icon: RadioTower, name: "Telecom", line: "Hundreds of small sites, solar and storage, one view." },
  { icon: Landmark, name: "Government", line: "Audit-ready governance for estates that never switch off." },
];

export function EveryFacility() {
  return (
    <>
      <ChapterMarker id="solutions" numeral="VII" title="Every facility." line="Factories, hotels, hospitals, data centres, campuses, oil & gas — different places, different assets, one model." />
      <section className="relative bg-ink pb-24 text-white sm:pb-32" aria-labelledby="every-title">
        <div className="container-narrow">
          <InView className="max-w-3xl">
            <h3 id="every-title" className="text-balance text-[40px] font-black leading-[0.94] tracking-[-0.04em] sm:text-[56px] lg:text-[72px]">
              One site. Then every site.
            </h3>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/68">
              Each facility keeps what makes it specific — its tariff, its climate, its plant. Findings rank
              across the whole estate, so the money decides what gets attention first, wherever it is.
            </p>
          </InView>
          <InView delay={0.1} className="mt-12">
            <SiteMap
              sites={SITES}
              title="Portfolio · 7 sites · ranked by what matters"
              total={[
                { label: "Sites", value: "7", note: "5 sectors" },
                { label: "Open findings", value: "11", note: "2 priced above OMR 500 / mo" },
                { label: "Verified savings", value: "OMR 38k", note: "year to date · illustrative" },
              ]}
            />
          </InView>
          <InView delay={0.1} className="mt-12">
            <p className="instrument text-white/55">Who we build for</p>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {KINDS.map((k) => (
                <li key={k.name} className="group rounded-2xl border border-white/10 bg-navy/50 p-5 transition-colors hover:border-teal/40">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-ink text-teal-soft transition-colors group-hover:bg-teal group-hover:text-white">
                    <k.icon size={22} strokeWidth={1.6} aria-hidden />
                  </span>
                  <p className="mt-4 text-[16px] font-semibold tracking-tight">{k.name}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">{k.line}</p>
                </li>
              ))}
            </ul>
          </InView>
        </div>
      </section>
    </>
  );
}
