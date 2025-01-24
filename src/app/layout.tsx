"use client";

import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { adjustScale } from "./_utils/adjustScale";

const freesentationFont = localFont({
  src: "../../public/fonts/FreesentationVf.ttf",
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
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
