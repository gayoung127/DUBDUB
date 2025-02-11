"use client";

import Header from "./_components/Header";
import HeroSection from "./login/_components/HeroSection";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col bg-gray-400">
      <Header />
      <HeroSection />
    </div>
  );
}
