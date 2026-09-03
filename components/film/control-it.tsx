import { ChapterMarker } from "@/components/film/chapter-marker";
import { PvBessScene } from "@/components/cinematic/pv-bess-scene";

/** V · Control it — solar, storage, facility and grid as one decision. */
export function ControlIt() {
  return (
    <>
      <ChapterMarker
        id="control"
        numeral="V"
        title="Control it."
        line="Solar, storage, the facility and the grid — one energy system, one decision every fifteen minutes, priced at your tariff."
      />
      <PvBessScene />
    </>
  );
}
