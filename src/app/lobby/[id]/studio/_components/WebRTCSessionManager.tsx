import { createSession, createConnection } from "@/app/_apis/openvidu";
import { OpenVidu, Session } from "openvidu-browser";
import React, { useEffect, useState } from "react";

interface WebRTCSessionManagerProps {
  studioId: number;
  onSessionReady: (session: Session) => void;
}

const WebRTCSessionManager = ({
  studioId,
  onSessionReady,
}: WebRTCSessionManagerProps) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionId = await createSession();
        if (!sessionId) throw new Error("세션 생성 실패");

        const connectionData = await createConnection(sessionId);
        if (!connectionData || !connectionData.token)
          throw new Error("토큰 생성 실패");

        const ov = new OpenVidu();
        const newSession = ov.initSession();

        await newSession.connect(connectionData.token);
        setSession(newSession);
        onSessionReady(newSession);
      } catch (error) {
        console.error("OpenVidu 세션 초기화 실패:", error);
      }
    };

    initSession();

    return () => {
      session?.disconnect();
      setSession(null);
    };
  }, [studioId]);

  return null;
};

export default WebRTCSessionManager;
