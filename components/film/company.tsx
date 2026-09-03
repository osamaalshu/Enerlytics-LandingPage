import { ChapterMarker } from "@/components/film/chapter-marker";
import { DepthPlate } from "@/components/cinematic/depth-plate";
import { InView } from "@/components/cinematic/in-view";
import { Contact } from "@/components/contact";
import { TrustStrip } from "@/components/trust-strip";
import { Team } from "@/components/team";
import { Engagement } from "@/components/engagement";

/**
 * VIII · The company — for the investor and the buyer.
 * Dawn over the same site: the vision line, then the people, the partners,
 * the engagement, and the one conversion path. Quiet.
 */
export function Company() {
  return (
    <>
      <ChapterMarker
        id="company"
        numeral="VIII"
        title="The company."
        line="We are building the operating intelligence layer for physical energy in the Gulf."
      />
      <section className="grain relative isolate overflow-hidden bg-ink text-white" aria-labelledby="vision-title">
        <div className="relative min-h-[100svh]">
          <DepthPlate id="h11" alt="The facility at first light, solar field and battery yard under a pale dawn sky" focal="50% 60%" strength={0.018} />
          <div className="scrim-b absolute inset-0" aria-hidden />
          <div className="container-narrow relative z-10 flex min-h-[100svh] flex-col justify-end pb-[12vh]">
            <InView className="max-w-3xl">
              <span className="instrument text-teal-fg/80">Why it is defensible</span>
              <h3 id="vision-title" className="mt-4 text-balance text-[36px] font-black leading-[0.94] tracking-[-0.04em] sm:text-[52px] lg:text-[64px]">
                Built for a region where every hour is priced and every saving must be proven.
              </h3>
            </InView>
            <InView delay={0.1} className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/10 sm:grid-cols-3">
              {[
                ["The tariff, exactly", "Bills reconstructed to the baisa under the cost-reflective tariff — the local wedge nobody generic can copy."],
                ["Physics and standards", "Expected behaviour from first principles; audits, commissioning and M&V consistent with ASHRAE, ISO 50001 and IPMVP."],
                ["Verified, then compounding", "Every saving measured against a frozen baseline and signed by a person. Results become the next baseline — the cycle raises the floor."],
              ].map(([t, b], i) => (
                <div key={t} className="bg-ink/80 p-6 backdrop-blur-sm">
                  <span className="tabular font-mono text-[10px] tracking-widest text-teal-soft">0{i + 1}</span>
                  <p className="mt-3 text-[19px] font-bold tracking-tight">{t}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white/62">{b}</p>
                </div>
              ))}
            </InView>
          </div>
        </div>
      </section>
      <div id="team">
        <Team />
      </div>
      <TrustStrip />
      <Engagement />
      <section
        id="contact"
        className="grain relative isolate overflow-hidden bg-ink py-24 text-white sm:py-32"
        aria-labelledby="contact-title"
      >
        <DepthPlate id="h01b" alt="The facility at nightfall under a wide dark sky" focal="70% 70%" strength={0.015} />
        <div className="absolute inset-0 bg-ink/55" aria-hidden />
        <div className="scrim-b absolute inset-0" aria-hidden />
        <div className="scrim-t absolute inset-0" aria-hidden />
        <Contact />
      </section>
    </>
  );
}
