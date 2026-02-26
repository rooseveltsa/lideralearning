import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
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
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased bg-[#FFFFFF] text-[#111827] w-full overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
