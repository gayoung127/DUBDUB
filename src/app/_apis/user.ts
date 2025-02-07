import { useUserStore } from "../_store/UserStore";

export const getMyInfo = async () => {
  try {
    const response = await fetch(`/api/getMyInfo`, {
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
