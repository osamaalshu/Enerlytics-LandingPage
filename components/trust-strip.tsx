import Image from "next/image";

const partners = [
  { type: "oq-wordmark", key: "oq-ae", suffix: "AE" },
  { type: "oq-wordmark", key: "oq-rpi", suffix: "RPI" },
  { type: "oq-wordmark", key: "oq-accelerator", suffix: "Accelerator" },
  {
    type: "logo",
    key: "aee",
    src: "/brand/logos/aee-logo-transparent.png",
    alt: "Association of Energy Engineers",
    width: 174,
    height: 44,
    imageClassName: "max-h-9",
  },
  {
    type: "logo",
    key: "aljabr",
    src: "/brand/logos/aljabr-logo-transparent.png",
    alt: "Aljabr",
    width: 220,
    height: 72,
    imageClassName: "max-h-12",
  },
] as const;

export function TrustStrip() {
  return (
    <section
      aria-label="Validated by partners and pilots"
      className="border-y border-navy/[0.06] bg-mist/60 py-10"
    >
      <div className="container-narrow">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/60">
          Trusted across pilots and institutional partners
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:flex-nowrap md:gap-x-8">
          {partners.map((p) => {
            if (p.type === "oq-wordmark") {
              return (
                <span
                  key={p.key}
                  className="inline-flex h-12 min-w-[150px] items-center justify-center text-[38px] font-semibold tracking-tight text-navy/80 transition-colors hover:text-navy sm:text-[40px]"
                >
                  <span className="text-[#f68b1f]">OQ</span>
                  <span className="ml-1">{p.suffix}</span>
                </span>
              );
            }

            return (
              <span
                key={p.key}
                className="inline-flex h-12 min-w-[150px] items-center justify-center opacity-80 transition-opacity hover:opacity-100"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  className={`${p.imageClassName} w-auto object-contain`}
                />
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
