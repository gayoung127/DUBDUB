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
    } else {
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

    const { setSelf } = useUserStore.getState();
    setSelf(data);
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

    setSelf(fallbackData as UserStore);
  }
};
