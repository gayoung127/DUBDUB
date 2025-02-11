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
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`세션 생성 실패: ${response.status}`);
    }

    const data = await response.json();

    console.log("세션 생성 성공: ", data);

    return data;
  } catch (error) {
    console.error("세션 생성 오류: ", error);
    return null;
  }
};

export const createConnection = async (
  sessionId: string,
): Promise<{ token: string } | null> => {
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
          Authorization: "Basic " + btoa("OPENVIDUAPP:ssafya801"),
        },
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

    return { token: data.token };
  } catch (error) {
    console.error("세션 연결 오류: ", error);
    return null;
  }
};

const SESSION_STORAGE_KEY = "openviduSessionId";
const checkSessionExists = async (
  sessionId: string | null,
): Promise<boolean> => {
  if (!sessionId) return false;

  try {
    const response = await fetch(`${BASE_URL}/api/openvidu/sessions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("OPENVIDUAPP:secret"),
      },
    });

    const data = await response.json();
    const sessionExists = data.content?.some(
      (session: { id: string }) => session.id === sessionId,
    );

    console.log(
      `🔍 세션 존재 여부 (${sessionId}):`,
      sessionExists ? "✅ 유지됨" : "❌ 없음",
    );
    return sessionExists;

    return response.ok; // 200 OK면 세션이 존재함
  } catch (error) {
    console.error("세션 존재 여부 확인 실패:", error);
    return false;
  }
};
export const testOpenVidu = async (): Promise<string | null> => {
  try {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    // const sessionExists = await checkSessionExists(sessionId);
    // if (!sessionId || !sessionExists) {
    if (!sessionId) {
      sessionId = await createSession();

      if (!sessionId) throw new Error("세션 생성 실패!");

      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    } else {
      console.log("기존 세션 유지:", sessionId);
    }
    const connectionData = await createConnection(sessionId);
    if (!connectionData || !connectionData.token)
      throw new Error("토큰 생성 실패!");

    console.log("토큰:", connectionData.token);
    return connectionData.token;
  } catch (error) {
    console.error("OpenVidu 테스트 오류:", error);
    return null;
  }
};
