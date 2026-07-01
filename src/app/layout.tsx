import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "CutoutStuff — Life-Size Custom Foam-Board Cutouts",
  description:
    "Turn any photo into a premium life-size foam-board cutout. Upload, approve your preview, and checkout securely. Real stands included, printed in the USA.",
  keywords: [
    "custom cutouts",
    "life-size cutout",
    "cardboard cutout",
    "foam-board cutout",
    "party props",
    "custom standee",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
