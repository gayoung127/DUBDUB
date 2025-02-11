"use client";

import gsap from "gsap";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { getCookie } from "@/app/_utils/getCookie";
import { useAuthStore } from "@/app/_store/AuthStore";

import H1 from "@/app/_components/H1";
import C1 from "@/app/_components/C1";
import C2 from "@/app/_components/C2";

import KakaoLoginButton from "./KakaoLoginButton";

interface LoginProps {
  microphoneConnected: boolean;
  setMicrophoneConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = ({ microphoneConnected, setMicrophoneConnected }: LoginProps) => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const isLogin = param.get("isLogin") === "true" ? true : false;

    try {
      if (isLogin) {
        const prevPage = getCookie("prevPage");
        if (prevPage) {
          router.replace(prevPage);
          document.cookie = "prevPage=; path=/; max-age=0;";
        } else {
          router.replace("/lobby");
        }
      }
    } catch (error) {
      alert("로그인 실패!");
    }
  }, [router]);

  useEffect(() => {
    if (microphoneConnected) {
      // GSAP 애니메이션 시작
      gsap.fromTo(
        ".fade-in",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, stagger: 0.5, duration: 1 },
      );

      // Animate the login button and terms of service section last
      gsap.fromTo(
        ".login-section",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay: 2, stagger: 0.5 },
      );
    }
  }, [microphoneConnected]); // Only run animation when microphone is connected

  return (
    <div className="absolute left-0 top-0 flex h-full flex-col items-center justify-between px-28 py-40">
      {microphoneConnected && (
        <>
          <div className="flex w-full flex-col items-start justify-start gap-y-2">
            <C1
              children="더빙을, 당신의 손끝에서"
              className="fade-in mb-12 text-[24px] font-medium text-white-200"
            />
            <H1
              children="간편한 더빙,"
              className="fade-in text-[48px] text-white-100"
            />
            <H1
              children="DUB DUB"
              className="fade-in text-[48px] text-brand-200"
            />
          </div>
          <div className="login-section flex w-full flex-col items-start justify-start">
            <div className="flex flex-col items-center justify-center gap-y-4">
              <KakaoLoginButton />
              <div className="flex flex-row items-center justify-center">
                <C2
                  children="이용약관"
                  className="text-center text-sm font-medium text-white-300"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
