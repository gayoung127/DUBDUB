import { useUserStore } from "../_store/UserStore";

export const getMyInfo = async () => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!BASE_URL) {
      console.error("백엔드 Url 환경 변수에서 못 찾아옴.");
      return;
    }

    const response = await fetch(`${BASE_URL}/member/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      useUserStore.getState().setUser(data);
    }
  } catch (error) {
    console.error("회원정보 불러오기 에러: ", error);
  }
};
