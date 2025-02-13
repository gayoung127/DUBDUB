"use client";

import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import Cursor from "./Cursor";
import { useUserStore } from "@/app/_store/UserStore";

interface CursorData {
  memberId: string;
  x: number;
  y: number;
  name: string;
}

interface CursorPresenceProps {
  stompClientRef: React.MutableRefObject<Client | null>;
  sessionId: string;
  isConnected: boolean; // STOMP 연결 상태 추가
}

const CursorPresence = ({
  stompClientRef,
  sessionId,
  isConnected,
}: CursorPresenceProps) => {
  const [cursors, setCursors] = useState<Record<string, CursorData>>({});
  const { self } = useUserStore();

  useEffect(() => {
    if (!isConnected || !stompClientRef.current) {
      console.log("❌ STOMP 연결 안 됨. CursorPresence 대기 중...");
      return;
    }

    const stompClient = stompClientRef.current;

    const handleCursorUpdate = (message: any) => {
      const data: CursorData = JSON.parse(message.body);
      setCursors((prev) => ({ ...prev, [data.memberId]: data }));
    };

    const handleCursorRemove = (message: any) => {
      const memberId: string = message.body;
      setCursors((prev) => {
        const updatedCursors = { ...prev };
        delete updatedCursors[memberId];
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
      console.log("🛑 커서 구독 해제");
      cursorSubscription.unsubscribe();
      removeSubscription.unsubscribe();
    };
  }, [sessionId, isConnected]); // isConnected와 sessionId가 변경될 때만 실행

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
      {Object.values(cursors)
        .filter((cursor) => cursor.memberId !== self?.memberId?.toString())
        .map(({ memberId, x, y, name }) => (
          <Cursor key={memberId} id={memberId} x={x} y={y} name={name} />
        ))}
    </div>
  );
};

export default CursorPresence;
