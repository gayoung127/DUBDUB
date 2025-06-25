"use client";

import React from "react";
import Login from "@/app/login/_components/Login";
import MicrophoneCheck from "@/app/login/_components/MicrophoneCheck";
import HeroSectionRoot from "./_components/HeroSectionRoot";

export default function LoginPage() {
  return (
    <main className="relative flex h-screen w-full flex-row items-start justify-start overflow-y-hidden bg-[#000000]">
      <HeroSectionRoot />
      <Login />
      <MicrophoneCheck />
    </main>
  );
}
