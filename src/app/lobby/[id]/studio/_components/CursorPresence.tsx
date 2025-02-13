"use client";

import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import Cursor from "./Cursor";

interface CursorData {
  id: string;
  x: number;
  y: number;
  name: string;
}

interface CursorPresenceProps {
  stompClientRef: React.MutableRefObject<Client | null>;
  sessionId: string;
}

const CursorPresence = ({ stompClientRef, sessionId }: CursorPresenceProps) => {
  const [cursors, setCursors] = useState<Record<string, CursorData>>({});

  useEffect(() => {
    const stompClient = stompClientRef.current;

    if (!stompClient) {
      console.log("CursorPresence: STOMP 클라이언트가 없음");
      return;
    }

    const handleCursorUpdate = (message: any) => {
      const data: CursorData = JSON.parse(message.body);
      console.log("📥 받은 커서 데이터:", data);

      setCursors((prev) => ({
        ...prev,
        [data.id]: data,
      }));
    };

    const handleCursorRemove = (message: any) => {
      const id: string = message.body;
      setCursors((prev) => {
        const updatedCursors = { ...prev };
        delete updatedCursors[id];
        return updatedCursors;
      });
    };

    const subscribeToCursors = () => {
      if (stompClient.connected) {
        console.log(`📡 커서 구독 주소: /topic/studio/${sessionId}/cursor`);

        // 커서 위치 업데이트 구독
        const cursorSubscription = stompClient.subscribe(
          `/topic/studio/${sessionId}/cursor`,
          handleCursorUpdate,
        );

        // 커서 제거 이벤트 구독
        const removeSubscription = stompClient.subscribe(
          `/topic/studio/${sessionId}/cursorRemove`,
          handleCursorRemove,
        );

        return () => {
          console.log("🛑 커서 구독 해제");
          cursorSubscription.unsubscribe();
          removeSubscription.unsubscribe();
        };
      } else {
        console.log("❌ STOMP 연결 안 됨. 500ms 후 재시도...");
        setTimeout(subscribeToCursors, 500);
      }
    };

    stompClient.onConnect = () => {
      console.log("✅ STOMP 연결 성공!");
      subscribeToCursors();
    };

    if (stompClient.connected) {
      subscribeToCursors();
    }

    return () => {
      console.log("🛑 CursorPresence 컴포넌트 언마운트");
    };
  }, [sessionId]);

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
      {Object.keys(cursors).map((id) => (
        <Cursor
          key={id}
          id={id}
          x={cursors[id].x}
          y={cursors[id].y}
          name={cursors[id].name}
        />
      ))}
    </div>
  );
};

export default CursorPresence;
