"use client";

import React, { useEffect, useState } from "react";
import { stompClient } from "@/app/_utils/socketClient"; // 변경된 부분
import Cursor from "./Cursor";

interface CursorData {
  id: string;
  x: number;
  y: number;
  name: string;
}

const CursorPresence = () => {
  const [cursors, setCursors] = useState<Record<string, CursorData>>({});

  useEffect(() => {
    const sessionId = "test-session-123"; // 예시 sessionId

    // STOMP 클라이언트 활성화 및 연결 성공 후 구독 처리
    stompClient.connectHeaders = {}; // 연결 헤더 설정
    stompClient.onConnect = () => {
      // 서버로부터 커서 업데이트 받기
      stompClient.subscribe(`/topic/studio/${sessionId}/cursor`, (message) => {
        const data: CursorData = JSON.parse(message.body);

        setCursors((prev) => ({
          ...prev,
          [data.id]: { id: data.id, x: data.x, y: data.y, name: data.name },
        }));
      });

      // 서버로부터 사용자 제거 이벤트 받기
      stompClient.subscribe(
        `/topic/studio/${sessionId}/cursorRemove`,
        (message) => {
          const id: string = message.body;

          setCursors((prev) => {
            const updatedCursors = { ...prev };
            delete updatedCursors[id];
            return updatedCursors;
          });
        },
      );
    };

    // STOMP 연결 시작
    stompClient.activate();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {Object.entries(cursors).map(([id, cursor]) => (
        <Cursor key={id} id={id} x={cursor.x} y={cursor.y} name={cursor.name} />
      ))}
    </div>
  );
};

export default CursorPresence;
