import type { Metadata } from "next";
import { Playfair_Display, Space_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const monoFont = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HH Goa 2026 — Builder ID & Frame Generator",
  description: "Generate your official HH Goa 2026 builder badge and overlay graphic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${monoFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
