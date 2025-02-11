"use client";

import React from "react";
import HeroSection from "@/app/login/_components/HeroSection";
import Login from "@/app/login/_components/Login";
import MicrophoneCheck from "@/app/login/_components/MicrophoneCheck";

export default function MainPage() {
  return (
    <main className="relative flex h-full w-full flex-row items-start justify-start overflow-y-hidden bg-[#000000]">
      <HeroSection />
      <Login />
      <MicrophoneCheck />
    </main>
  );
}
