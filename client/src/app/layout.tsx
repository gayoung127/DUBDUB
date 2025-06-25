"use client";

import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const freesentationFont = localFont({
  src: "../../public/fonts/FreesentationVF.ttf",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${freesentationFont.className} overflow-hidden antialiased`}
        style={{ cursor: "url('/images/icons/cursor-self.svg') 10 10, auto" }}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
