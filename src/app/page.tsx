"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

import H4 from "@/app/_components/H4";

import Login from "@/app/login/_components/Login";
import HeroSection from "@/app/login/_components/HeroSection";

export default function MainPage() {
  const [microphoneConnected, setMicrophoneConnected] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setMicrophoneConnected(true);
        })
        .catch(() => {
          setMicrophoneConnected(false);
        });
    }
  }, []);

  return (
    <main className="relative flex h-screen w-full flex-row items-start justify-start overflow-y-hidden bg-[#000000]">
      <HeroSection />
      <Login
        microphoneConnected={microphoneConnected}
        setMicrophoneConnected={setMicrophoneConnected}
      />
      <div className="absolute bottom-16 flex w-full flex-row items-center justify-center">
        <div className="flex flex-row items-center justify-between gap-x-3 rounded-full bg-white-bg px-6 py-2">
          <div className="relative flex h-8 w-8 flex-row items-center justify-center">
            <Image
              src={
                microphoneConnected
                  ? "/images/icons/icon-microphone.webp"
                  : "/images/icons/icon-microphone-connected.webp"
              }
              alt="마이크 아이콘"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <H4 className="text-gray-200">
            {microphoneConnected
              ? "좋아요! 목소리를 내보세요."
              : "마이크를 연결해주세요!"}
          </H4>
        </div>
      </div>
    </main>
  );
}
