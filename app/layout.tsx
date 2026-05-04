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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-navy antialiased">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
