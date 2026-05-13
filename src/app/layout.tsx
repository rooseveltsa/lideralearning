import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import TrackingPixels from "@/components/analytics/TrackingPixels";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
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
      <body className={`${inter.variable} ${jakarta.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground w-full overflow-x-hidden`}>
        <TrackingPixels />
        {children}
      </body>
    </html>
  );
}
