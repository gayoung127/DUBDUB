"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import H4 from "@/app/_components/H4";

const MicrophoneCheck = () => {
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
  );
};

export default MicrophoneCheck;
