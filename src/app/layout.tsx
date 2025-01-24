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
  useEffect(() => {
    const cleanup = adjustScale();
    return cleanup;
  }, []);

  return (
    <html lang="ko">
      <body className={`${freesentationFont.className} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
