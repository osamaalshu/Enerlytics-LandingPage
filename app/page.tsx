import { Capabilities } from "@/components/capabilities";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Nav } from "@/components/nav";
import { Preview } from "@/components/preview";
import { Pricing } from "@/components/pricing";
import { Problem } from "@/components/problem";
import { Services } from "@/components/services";
import { Team } from "@/components/team";
import { TrustStrip } from "@/components/trust-strip";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <TrustStrip />
        <Problem />
        <Capabilities />
        <Preview />
        <HowItWorks />
        <Services />
        <Pricing />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
