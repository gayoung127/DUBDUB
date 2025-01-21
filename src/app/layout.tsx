import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";

const freesentationFont = localFont({
  src: "../../public/fonts/FreesentationVf.ttf",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DUBDUB",
  description: "성우지망생과 일반인을 위한 실시간 더빙 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${freesentationFont.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
