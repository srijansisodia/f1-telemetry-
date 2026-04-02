import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "F1 Telemetry Experience",
    template: "%s — F1 DNA",
  },
  description:
    "Explore F1 performance data like never before — driver DNA, teammate battles, and sector analysis.",
  openGraph: {
    title: "F1 Telemetry Experience",
    description: "Driver DNA. Teammate Battles. Sector Analysis.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="bg-bg-base text-text-primary font-body min-h-screen overflow-x-hidden">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10 pt-16">{children}</main>
      </body>
    </html>
  );
}
