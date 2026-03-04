import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
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
      <body className={`${manrope.variable} ${sora.variable} font-sans antialiased bg-[#F7FAFD] text-[#111827] w-full overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
