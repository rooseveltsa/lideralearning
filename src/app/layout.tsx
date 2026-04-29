import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import TrackingPixels from "@/components/analytics/TrackingPixels";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Lidera Treinamentos",
  description: "A escola dos líderes que constroem times. Treinamentos, mentorias e palestras para times comerciais.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lidera",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth dark">
      <body className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased bg-background text-foreground w-full overflow-x-hidden`}>
        <TrackingPixels />
        {children}
      </body>
    </html>
  );
}
