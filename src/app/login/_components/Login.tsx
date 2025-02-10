import C1 from "@/app/_components/C1";
import C2 from "@/app/_components/C2";
import H1 from "@/app/_components/H1";
import { useEffect, useState } from "react";
import KakaoLoginButton from "./KakaoLoginButton";
import SignUp from "./SignUp";
import { useAuthStore } from "@/app/_store/AuthStore";
import { useRouter } from "next/navigation";
import { getCookie } from "@/app/_utils/getCookie";

const Login = () => {
  const router = useRouter();
  const { setLoggedInUserId } = useAuthStore();

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
      } else {
        // console.error("로그인 실패");
        alert("로그인을 시도해주세요.");
      }
    } catch (error) {
      // console.error("로그인 에러: ", error);
      alert("로그인 실패!");
    }
  }, []);

  return (
    <div className="left-0 flex h-full w-[440px] flex-col items-center bg-brand-100 bg-opacity-80 px-[70px] py-[120px]">
      <div className="flex w-[300px] flex-col gap-2">
        <C1 children="간편한 더빙" className="text-gray-100" />
        <H1 children="덥덥을" />
        <H1 children="써보세요 흑흑" />
        <div className="flex h-[476px] flex-col-reverse gap-2">
          <KakaoLoginButton />
        </div>
        <div className="flex flex-row items-center justify-center">
          <C2 children="이용약관" className="text-center text-gray-100" />
        </div>
      </div>
    </div>
  );
};

export default Login;
