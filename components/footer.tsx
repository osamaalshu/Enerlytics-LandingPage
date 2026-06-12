import Image from "next/image";
import Link from "next/link";

const cols = [
  {
    title: "Platform",
    links: [
      { href: "#platform", label: "Capabilities" },
      { href: "#preview", label: "Live preview" },
      { href: "#how", label: "Monitor / Analyse / Govern" },
      { href: "#pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#team", label: "Team" },
      { href: "#contact", label: "Contact" },
      { href: "mailto:brand@enerlytics.om", label: "Brand requests" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "mailto:Muathhinai@gmail.com", label: "Book a demo" },
      { href: "https://www.enerlytics.om", label: "enerlytics.om" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
      <div className="container-narrow relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/logos/horizontal_white.png"
              alt="Enerlytics"
              width={520}
              height={120}
              className="h-8 w-auto"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              The CRT-native energy intelligence platform for the GCC&apos;s
              institutional buildings. Monitor. Analyse. Govern.
            </p>
            <p className="mt-5 text-sm text-white/70">
              <a
                href="mailto:brand@enerlytics.om"
                className="font-medium text-white/80 transition hover:text-white"
              >
                brand@enerlytics.om
              </a>
              <span className="mx-2 text-white/30" aria-hidden>
                ·
              </span>
              <a
                href="https://www.enerlytics.om"
                className="transition hover:text-white"
              >
                www.enerlytics.om
              </a>
            </p>
          </div>

          {cols.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="eyebrow text-white/70">{col.title}</h2>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/75 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center">
          <p>© 2026 Enerlytics. All rights reserved.</p>
          <p className="tracking-wide">MONITOR · CONTROL · OPTIMIZE</p>
        </div>
      </div>
    </footer>
  );
}
