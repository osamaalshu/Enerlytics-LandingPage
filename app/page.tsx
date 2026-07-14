import { Capabilities } from "@/components/capabilities";
import { Contact } from "@/components/contact";
import { EnergyHeatmap } from "@/components/energy-heatmap";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Nav } from "@/components/nav";
import { Preview } from "@/components/preview";
import { Pricing } from "@/components/pricing";
import { Problem } from "@/components/problem";
import { Projects } from "@/components/projects";
import { Services } from "@/components/services";
import { Solutions } from "@/components/solutions";
import { Team } from "@/components/team";
import { TrustStrip } from "@/components/trust-strip";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <EnergyHeatmap />
        <TrustStrip />
        <Problem />
        <Capabilities />
        <Solutions />
        <Services />
        <Preview />
        <HowItWorks />
        <Projects />
        <Pricing />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
