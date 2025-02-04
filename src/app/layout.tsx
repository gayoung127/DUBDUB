"use client";

import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { adjustScale } from "./_utils/adjustScale";

const freesentationFont = localFont({
  src: "../../public/fonts/FreesentationVF.ttf",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const cleanup = adjustScale();
    return cleanup; // 컴포넌트 언마운트 시 정리
  }, []);

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
