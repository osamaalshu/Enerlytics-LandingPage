const partners = [
  "OQ Alternative Energy",
  "OQ RPI",
  "Al Hilal Plastic Factory",
  "OQ Accelerator",
  "Imperial College London",
  "Association of Energy Engineers",
];

export function TrustStrip() {
  const row = [...partners, ...partners];
  return (
    <section
      aria-label="Validated by partners and pilots"
      className="border-y border-navy/[0.06] bg-mist/60 py-10"
    >
      <div className="container-narrow">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/45">
          Trusted across pilots and institutional partners
        </p>

        <div className="relative mt-6 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-mist to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-mist to-transparent"
            aria-hidden
          />
          <div className="group flex w-max animate-marquee items-center gap-12 whitespace-nowrap [animation-play-state:running] hover:[animation-play-state:paused]">
            {row.map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="text-[15px] font-semibold tracking-tight text-navy/55 transition-colors hover:text-navy"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
