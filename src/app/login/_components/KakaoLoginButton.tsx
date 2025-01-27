import React from "react";

const KakaoLoginButton = () => {
  return (
    <button
      className="shadow-md flex h-[45px] w-[300px] items-center justify-center gap-2 rounded-md bg-[#fee500] transition-all"
      onClick={() => alert("카카오 로그인 클릭! 실제 동작은 나중에 추가")}
    >
      <img src="images/icons/kakao-logo.svg" width={18} height={18} />
      <span className="text-[15px] font-semibold text-black/85">
        카카오 로그인
      </span>
    </button>
  );
};

export default KakaoLoginButton;
