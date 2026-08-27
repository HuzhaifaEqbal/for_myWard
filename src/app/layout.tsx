import type { Metadata } from "next";
import { Geist, Literata } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "cyrillic"], // Literata has good serif support
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "Aetheris Dashboard",
  description: "Spiritual and Cosmic Tracker Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
      </head>
      <body
        className={`${geistSans.variable} ${literata.variable} antialiased bg-background text-on-background`}
      >
        {children}
      </body>
    </html>
  );
}
