import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import NeuralGrid from "@/components/ui/NeuralGrid";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SECTOR 7 // ADVANCED TACTICAL GEAR",
  description: "High-performance techwear and urban tactical equipment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen cursor-none`}
      >
        <CustomCursor />
        <SmoothScroll />
        <NoiseOverlay />
        <NeuralGrid />
        {children}
        <Footer />
      </body>
    </html>
  );
}
