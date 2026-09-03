import { ChapterMarker } from "@/components/film/chapter-marker";
import { PlateStory, Statement } from "@/components/film/plate-story";
import { PlatformEngineer } from "@/components/cinematic/platform-engineer";
import { Services } from "@/components/services";

/**
 * VI · Prove it — the credibility boundary.
 * The engineer on the roof; then the software/engineer handoff table.
 */
export function ProveIt() {
  return (
    <>
      <ChapterMarker
        id="prove"
        numeral="VI"
        title="Prove it."
        line="The analysis is software. The judgment is human. Every saving is measured against a frozen baseline and signed by a person who is accountable for it."
      />
      <PlateStory
        plate="h02"
        alt="Rows of switchgear panels with meters and cable trays inside the plant electrical room"
        focal="30% 50%"
        align="right"
        strength={0.02}
        beats={[
          <Statement key="1" size="xl" line="Software finds and prices the opportunity. Certified energy professionals inspect, decide and sign. That boundary is the product.">
            Software finds it. <span className="text-white/45">People sign it.</span>
          </Statement>,
        ]}
      />
      <PlatformEngineer />
      <Services />
    </>
  );
}
