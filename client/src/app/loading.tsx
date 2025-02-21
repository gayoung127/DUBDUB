"use client";

import Logo from "@/public/images/icons/logo-loading.svg";

export default function Loading() {
  return (
    <main className="flex h-screen max-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-400">
      <Logo width={64} height={40} />
    </main>
  );
}
