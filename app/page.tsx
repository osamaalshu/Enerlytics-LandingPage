import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ColdOpen } from "@/components/film/cold-open";
import { WhyNow } from "@/components/film/why-now";
import { SeeIt } from "@/components/film/see-it";
import { UnderstandIt } from "@/components/film/understand-it";
import { CycleScene } from "@/components/film/cycle-scene";
import { PriceIt } from "@/components/film/price-it";
import { ControlIt } from "@/components/film/control-it";
import { ProveIt } from "@/components/film/prove-it";
import { EveryFacility } from "@/components/film/every-facility";
import { Company } from "@/components/film/company";

/**
 * The film (docs/TREATMENT_v2.md):
 *   00 cold open · I the cost you cannot see · II see it · III understand it
 *   IV price it · V control it · VI prove it · VII every facility · VIII the company
 */
export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <ColdOpen />
        <WhyNow />
        <SeeIt />
        <UnderstandIt />
        <CycleScene />
        <PriceIt />
        <ControlIt />
        <ProveIt />
        <EveryFacility />
        <Company />
      </main>
      <Footer />
    </>
  );
}
