import type { Metadata, Viewport } from "next";
import { ScrollProgress } from "@/components/scroll-progress";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.enerlytics.om"),
  title: {
    default: "Enerlytics — Energy intelligence for GCC facilities.",
    template: "%s · Enerlytics",
  },
  description:
    "Enerlytics is the industrial energy-intelligence platform for GCC facilities. Loads, solar and battery storage in one live model: validated data, diagnosed causes, priced in OMR at your tariff, verified savings.",
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
    "PV monitoring",
    "battery energy storage",
    "BESS",
    "M&V",
    "energy audit",
  ],
  authors: [{ name: "Enerlytics" }],
  creator: "Enerlytics",
  openGraph: {
    type: "website",
    title: "Enerlytics — Energy intelligence for GCC facilities.",
    description:
      "Loads, solar and storage in one live model. Validated data, diagnosed causes, priced fixes, verified savings — for GCC facilities.",
    url: "https://www.enerlytics.om",
    siteName: "Enerlytics",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enerlytics — Energy intelligence for GCC facilities.",
    description:
      "Validated data, diagnosed causes, priced fixes, verified savings — for GCC facilities.",
  },
  icons: {
    icon: [
      { url: "/brand/favicon_app.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: "/brand/favicon_app.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#06090f",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Enerlytics",
  url: "https://www.enerlytics.om",
  logo: "https://www.enerlytics.om/brand/logos/horizontal.png",
  email: "info@enerlytics.om",
  description:
    "Industrial energy-intelligence platform for GCC facilities: loads, PV and battery storage in one model — collect, understand, diagnose, improve, verify, report.",
  areaServed: ["OM", "GCC"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-navy antialiased">
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          precedence="default"
        />
        {/* Hero poster is the LCP element — fetch it before the CSS/JS chain. */}
        <link
          rel="preload"
          as="image"
          type="image/avif"
          imageSrcSet="/media/h01-960.avif 960w, /media/h01-1920.avif 1920w"
          imageSizes="100vw"
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
