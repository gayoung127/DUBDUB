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
  const [shouldRender, setShouldRender] = useState(false); // 렌더링 여부 결정

  useEffect(() => {
    const stompClient = stompClientRef.current;
    if (!stompClient || !stompClient.connected) {
      console.log("CursorPresence: 웹 소켓이 아직 연결되지 않음");
      return;
    }

    console.log("CursorPresence: 웹 소켓 커서 구독 시작");

    const handleCursorUpdate = (message: any) => {
      const data: CursorData = JSON.parse(message.body);
      console.log("📥 받은 커서 데이터:", data);

      setCursors((prev) => {
        const updatedCursors = { ...prev, [data.id]: data };
        if (Object.keys(updatedCursors).length >= 1) {
          setShouldRender(true);
        }
        return updatedCursors;
      });
    };

    const handleCursorRemove = (message: any) => {
      const id: string = message.body;
      setCursors((prev) => {
        const updatedCursors = { ...prev };
        delete updatedCursors[id];
        if (Object.keys(updatedCursors).length < 1) {
          setShouldRender(false);
        }
        return updatedCursors;
      });
    };

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
      console.log("웹 소켓 커서 구독 해제");
      cursorSubscription.unsubscribe();
      removeSubscription.unsubscribe();
    };
  }, [sessionId, stompClientRef.current?.connected]);

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
      {shouldRender &&
        Object.entries(cursors).map(([id, cursor]) => (
          <Cursor
            key={id}
            id={id}
            x={cursor.x}
            y={cursor.y}
            name={cursor.name}
          />
        ))}
    </div>
  );
};

export default CursorPresence;
