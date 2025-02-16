"use client";

import { useEffect, useState } from "react";
import { OpenVidu, Connection } from "openvidu-browser";
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
  const [connections, setConnections] = useState<Connection[]>([]); // ✅ 참가자 목록 상태 추가

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

      // ✅ 참가자 추가 감지 (새로운 사람이 들어오면 connections 업데이트)
      newSession.on("connectionCreated", (event: any) => {
        setConnections((prev) => [...prev, event.connection]);
      });

      // ✅ 참가자 제거 감지 (나가면 connections에서 삭제)
      newSession.on("connectionDestroyed", (event: any) => {
        setConnections((prev) =>
          prev.filter(
            (conn) => conn.connectionId !== event.connection.connectionId,
          ),
        );
      });

      // ✅ 새로운 오디오 스트림이 생성될 때 감지
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
        setConnections([]); // ✅ 참가자 목록 초기화
        setPublisher(null);
      }
    };
  }, [sessionId, token]);

  return (
    <div className="rounded-lg border bg-gray-100 p-4">
      <h2 className="mb-2 text-lg font-bold">음성 채팅</h2>
      {publisher ? <p>음성 송출 중...</p> : <p>연결 중...</p>}

      {/* ✅ 현재 접속한 참가자 목록 */}
      <h3 className="mt-4 font-semibold">참가자 목록</h3>
      <ul>
        {connections.map((conn, index) => (
          <li key={conn.connectionId}>
            참가자 {index + 1} (ID: {conn.connectionId})
          </li>
        ))}
      </ul>

      <h3 className="mt-4 font-semibold">오디오 연결된 참가자</h3>
      <ul>
        {subscribers.map((sub, index) => (
          <li key={index}>오디오 참가자 {index + 1}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebRTCManager;
