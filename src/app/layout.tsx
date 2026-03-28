import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import TrackingPixels from "@/components/analytics/TrackingPixels";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Lidera Treinamentos",
  description: "Plataforma de Alta Performance B2B",
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
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} ${dmSerif.variable} font-sans antialiased bg-[#F7FAFD] text-[#111827] w-full overflow-x-hidden`}>
        <TrackingPixels />
        {children}
      </body>
    </html>
  );
}
