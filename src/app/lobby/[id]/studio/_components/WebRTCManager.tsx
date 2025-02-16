"use client";

import { useEffect, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import { createSession, createConnection } from "@/app/_apis/openvidu";

interface WebRTCManagerProps {
  sessionId?: string;
  token?: string;
}
const WebRTCManager = ({ sessionId, token }: WebRTCManagerProps) => {
  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [session, setSession] = useState<any>(null);
  const [publisher, setPublisher] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    const initializeSession = async () => {
      let sessionIdToUse: string | undefined = sessionId ?? undefined;
      let tokenToUse: string | undefined = token ?? undefined;

      if (!sessionIdToUse || !tokenToUse) {
        sessionIdToUse = (await createSession()) ?? undefined;
        if (sessionIdToUse) {
          tokenToUse = (await createConnection(sessionIdToUse)) ?? undefined;
        }
      }

      if (!sessionIdToUse || !tokenToUse) {
        console.error("세션 생성 또는 연결에 실패했습니다.");
        return;
      }

      const ov = new OpenVidu();
      setOV(ov);

      const newSession = ov.initSession();
      setSession(newSession);

      newSession.on("streamCreated", (event: any) => {
        const subscriber = newSession.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      newSession.on("streamDestroyed", (event: any) => {
        setSubscribers((prev) => prev.filter((s) => s.stream !== event.stream));
      });

      try {
        await newSession.connect(tokenToUse);
        const newPublisher = ov.initPublisher(undefined, {
          audioSource: undefined, // 기본 마이크 사용
          videoSource: false, // 비디오 비활성화
          publishAudio: true,
          publishVideo: false,
        });

        await newSession.publish(newPublisher);
        setPublisher(newPublisher);
      } catch (error) {
        console.error("Error connecting to session:", error);
      }
    };

    initializeSession();

    return () => {
      if (session) {
        session.disconnect();
        setSession(null);
        setSubscribers([]);
        setPublisher(null);
      }
    };
  }, [sessionId, token]);

  return (
    <div className="rounded-lg border bg-gray-100 p-4">
      <h2 className="mb-2 text-lg font-bold">음성 채팅</h2>
      {publisher ? <p>음성 송출 중...</p> : <p>연결 중...</p>}
      <ul>
        {subscribers.map((sub, index) => (
          <li key={index}>참여자 {index + 1}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebRTCManager;
