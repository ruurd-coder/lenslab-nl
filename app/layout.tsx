import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LensLab — Vind een fotograaf of videograaf in Nederland",
    template: "%s | LensLab",
  },
  description:
    "Vind de beste fotografen en videografen in jouw regio. Bekijk portfolio's en neem direct contact op.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://lenslab.nl"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
