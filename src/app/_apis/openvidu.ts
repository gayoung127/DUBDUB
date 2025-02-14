import { to } from "gsap";
import { OpenVidu } from "openvidu-browser";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const OPENVIDU_SERVER_URL = process.env.NEXT_PUBLIC_OPENVIDU_SERVER_URL;
const OPENVIDU_SECRET = process.env.NEXT_PUBLIC_OPENVIDU_SECRET;

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
export const createSessionDirect = async (): Promise<string | null> => {
  try {
    if (!OPENVIDU_SERVER_URL || !OPENVIDU_SECRET) {
      throw new Error("테스트용 환경 변수 못 가져오고 있다.");
    }
    const response = await fetch(
      `${OPENVIDU_SERVER_URL}/openvidu/api/sessions`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`OPENVIDUAPP:${OPENVIDU_SECRET}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customSessionId: `session-${Date.now()}`, // 세션 ID를 지정하지 않으면 OpenVidu가 자동 생성
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `세션 생성 실패: ${response.status} - ${await response.text()}`,
      );
    }

    const data = await response.json();
    console.log("✅ OpenVidu 세션 생성 성공:", data);

    if (!data.id) {
      throw new Error("🚨 API 응답에 sessionId가 없습니다.");
    }

    return data.id;
  } catch (error) {
    console.error("❌ OpenVidu 세션 생성 오류:", error);
    return null;
  }
};
export const createConnectionDirect = async (
  sessionId: string,
): Promise<string | null> => {
  try {
    if (!OPENVIDU_SERVER_URL || !OPENVIDU_SECRET) {
      throw new Error("테스트용 환경 변수 못 가져오고 있다.");
    }
    if (!sessionId) {
      throw new Error("🚨 세션 ID가 필요합니다.");
    }

    const response = await fetch(
      `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${encodeURIComponent(sessionId)}/connection`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`OPENVIDUAPP:${OPENVIDU_SECRET}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "PUBLISHER", // SUBSCRIBER / MODERATOR 가능
          data: "User Connection",
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `커넥션 생성 실패: ${response.status} - ${await response.text()}`,
      );
    }

    const data = await response.json();
    console.log("✅ OpenVidu 커넥션 생성 성공:", data);

    if (!data.token) {
      throw new Error("🚨 API 응답에 token이 없습니다.");
    }

    return data.token;
  } catch (error) {
    console.error("❌ OpenVidu 커넥션 생성 오류:", error);
    return null;
  }
};
