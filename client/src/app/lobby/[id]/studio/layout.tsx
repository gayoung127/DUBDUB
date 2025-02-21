"use client";

import { useEffect } from "react";
import { adjustScale } from "@/app/_utils/adjustScale";

export default function StudioPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const cleanup = adjustScale();
    return cleanup; // 컴포넌트 언마운트 시 정리
  }, []);

  return (
    <div className="flex h-full min-h-screen select-none flex-col items-center overflow-y-hidden">
      {children}
    </div>
  );
}
