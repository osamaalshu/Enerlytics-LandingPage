import type { Metadata, Viewport } from "next";
import { ScrollProgress } from "@/components/scroll-progress";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.enerlytics.om"),
  title: {
    default: "Enerlytics — Smarter Buildings. Lower Costs.",
    template: "%s · Enerlytics",
  },
  description:
    "Enerlytics is the CRT-native energy intelligence platform for the GCC's institutional buildings. Monitor, analyse, and govern every kilowatt-hour in real time.",
  keywords: [
    "energy intelligence",
    "CRT",
    "Cost Reflective Tariff",
    "Oman",
    "GCC",
    "energy management",
    "peak load",
    "tariff analytics",
    "building energy",
  ],
  authors: [{ name: "Enerlytics" }],
  creator: "Enerlytics",
  openGraph: {
    type: "website",
    title: "Enerlytics — Smarter Buildings. Lower Costs.",
    description:
      "Live cost intelligence for the GCC's institutional buildings. Monitor, Analyse, Govern.",
    url: "https://www.enerlytics.om",
    siteName: "Enerlytics",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enerlytics — Smarter Buildings. Lower Costs.",
    description:
      "Live cost intelligence for the GCC's institutional buildings.",
  },
  icons: {
    icon: [
      { url: "/brand/favicon_app.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: "/brand/favicon_app.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1330",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Enerlytics",
  url: "https://www.enerlytics.om",
  logo: "https://www.enerlytics.om/brand/logos/horizontal.png",
  email: "brand@enerlytics.om",
  description:
    "CRT-native energy intelligence platform for the GCC's institutional buildings. Monitor, analyse, and govern every kilowatt-hour in real time.",
  areaServed: ["OM", "GCC"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-navy antialiased">
        {/* Satoshi (per Enerlytics brand) — loaded as a parallel stylesheet
            instead of a render-blocking CSS @import chain. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
          precedence="default"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-blue focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
