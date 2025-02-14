import { UserStore, useUserStore } from "../_store/UserStore";

export const getMyInfo = async () => {
  try {
    const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/member/profile`;

    if (!BASE_URL) {
      console.error("백엔드 URL 환경 변수에서 찾을 수 없음.");
      return;
    }

    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    // const data = await response.json();

    let data;

    if (response.ok) {
      data = await response.json();
      console.log("✅ 서버 응답 데이터:", data);
    } else {
      console.warn("⚠️ 백엔드에서 정상적인 응답을 받지 못함. 기본 데이터 적용");
      data = null;
    }

    if (!data || Object.keys(data).length === 0) {
      console.warn("⚠️ 회원 정보 없음. 기본 데이터를 사용합니다.");
      data = {
        memberId: 1,
        email: null,
        nickName: "익명의 더비",
        position: "관전자",
        profileUrl: "/images/icons/defaultAvatar.png",
      };
    }

    console.log("📌 최종 적용될 데이터:", data);

    const { setSelf } = useUserStore.getState();
    console.log("🛠 `setSelf` 호출 전 데이터:", data);
    setSelf(data);
    console.log("🚀 `setSelf` 적용 완료:", useUserStore.getState().self);
  } catch (error) {
    console.error("❌ 회원정보 불러오기 에러: ", error);

    const { setSelf } = useUserStore.getState();
    const fallbackData = {
      memberId: 1,
      email: null,
      nickName: "익명의 더비",
      position: "관전자",
      profileUrl: "/images/icons/defaultAvatar.png",
    };

    console.log("⚠️ 네트워크 에러 발생. 기본 데이터 적용:", fallbackData);
    setSelf(fallbackData as UserStore);
  }
};
