import { useEffect } from "react";

const KakaoLoginButton = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
      script.async = true;

      script.onload = () => {
        if (window.Kakao) {
          const appKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

          if (!appKey) {
            console.log("키 못 불러옴");
            return;
          }

          window.Kakao.init(appKey);
          console.log("카카오 SDK 초기화: ", window.Kakao.isInitialized());
        }
      };

      document.body.appendChild(script);
    }
  }, []);

  const handleKakaoLogin = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      console.error("카카오 SDK 초기화 안 됨");
      return;
    }

    //인가 코드 받을 api 환경 변수로 설정하기
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!redirectUri) {
      console.error("Redirext URI 환경 변수에서 못 찾아옴.");
      return;
    }

    window.Kakao.Auth.authorize({
      redirectUri: redirectUri,
    });
  };

  return (
    <button
      className="shadow-md flex h-[45px] w-[300px] items-center justify-center gap-2 rounded-md bg-[#fee500] transition-all"
      onClick={handleKakaoLogin}
    >
      <img src="images/icons/kakao-logo.svg" width={18} height={18} />
      <span className="text-[15px] font-semibold text-black/85">
        카카오 로그인
      </span>
    </button>
  );
};

export default KakaoLoginButton;
