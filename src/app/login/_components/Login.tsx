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
  const [isFirstLogin, setIsFirstLogin] = useState<boolean | null>(null);
  const { loggedInUserId, setLoggedInUserId } = useAuthStore();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      handleKakaoLogin(code);
      url.searchParams.delete("code");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);

  const handleKakaoLogin = async (code: string) => {
    const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;

    try {
      const response = await fetch(`${BASE_URL}?code=${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("로그인 성공!!");
        setLoggedInUserId(data.memberId);

        const prevPage = getCookie("prevPage");
        if (prevPage) {
          router.replace(prevPage);
          document.cookie = "prevPage=; path=/; max-age=0;";
        } else {
          router.replace("/lobby");
        }
      } else {
        console.error("로그인 실패: ", data.message);
        alert("로그인 실패!");
      }
    } catch (error) {
      console.error("로그인 에러: ", error);
      alert("로그인 실패!");
    }
  };

  if (isFirstLogin === null) {
    //로딩 중
  }

  if (isFirstLogin) {
    return <SignUp />;
  }

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
