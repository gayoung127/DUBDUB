import { to } from "gsap";
import { OpenVidu } from "openvidu-browser";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createSession = async (): Promise<string | null> => {
  try {
    console.log(BASE_URL);
    const response = await fetch(`${BASE_URL}/api/openvidu/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`세션 생성 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log("세션 생성 성공: ", data);
    if (!data.sessionId) {
      throw new Error("API 응답에 sessionId가 없습니다.");
    }
    return data.sessionId;
  } catch (error) {
    console.error("세션 생성 오류: ", error);
    return null;
  }
};

export const createConnection = async (
  sessionId: string,
): Promise<string | null> => {
  try {
    if (!sessionId || typeof sessionId !== "string") {
      console.error("올바르지 않은 sessionId:", sessionId);
      return null;
    }
    console.log(BASE_URL);
    const response = await fetch(
      `${BASE_URL}/api/openvidu/connections/${encodeURIComponent(sessionId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      throw new Error(`세션 연결 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log("세션 연결 성공: ", data);

    if (!data.token) {
      throw new Error("Token not found in connection URL");
    }

    return data.token;
  } catch (error) {
    console.error("세션 연결 오류: ", error);
    return null;
  }
};
