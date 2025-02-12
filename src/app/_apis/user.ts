import { useUserStore } from "../_store/UserStore";

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

    const data = await response.json();

    if (response.ok) {
      const { setSelf } = useUserStore.getState();

      setSelf(data);
    }
  } catch (error) {
    console.error("❌ 회원정보 불러오기 에러: ", error);
  }
};
