import type { Metadata } from "next";
import { Schibsted_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

// Display / UI — README §Typography
const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-schibsted",
  display: "swap",
});

// Mono / labels — eyebrows, metadata, IDs, table headers, chart ticks
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CutOutStuff — Premium life-size cutouts",
    template: "%s — CutOutStuff",
  },
  description:
    "CutOutStuff turns pets, people, creators, mascots, and characters into premium life-size cutouts, so anyone worth celebrating can actually be in the room.",
  keywords: [
    "life-size cutout",
    "custom cutout",
    "standee",
    "premium cutout",
    "creator collectible",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${schibsted.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
