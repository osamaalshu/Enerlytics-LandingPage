import { Capabilities } from "@/components/capabilities";
import { Contact } from "@/components/contact";
import { EnergyHeatmap } from "@/components/energy-heatmap";
import { Engagement } from "@/components/engagement";
import { FindingExample } from "@/components/finding-example";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Preview } from "@/components/preview";
import { Problem } from "@/components/problem";
import { Services } from "@/components/services";
import { Solutions } from "@/components/solutions";
import { Team } from "@/components/team";
import { TheLoop } from "@/components/the-loop";
import { TrustStrip } from "@/components/trust-strip";

/**
 * Narrative order (docs/business_model): hook → proof of context → problem →
 * THE LOOP (the business model, the signature) → the platform (software
 * layers) → services (human layers) → see it → who it's for → field proof →
 * how to engage → who we are → talk to us.
 */
export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <TrustStrip />
        <Problem />
        <TheLoop />
        <FindingExample />
        <Capabilities />
        <Services />
        <Preview />
        <EnergyHeatmap />
        <Solutions />
        <Engagement />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
