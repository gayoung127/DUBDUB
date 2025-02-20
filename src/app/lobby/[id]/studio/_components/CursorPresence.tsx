"use client";

import { Client } from "@stomp/stompjs";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/app/_store/UserStore";
import Cursor from "./Cursor";
import { SelectingBlock } from "@/app/_types/studio";

interface CursorData {
  memberId: string;
  x: number;
  y: number;
  name: string;
  selecting?: false;
  selectedAudioBlockId?: null;
}

interface CursorPresenceProps {
  stompClientRef: Client | null; // ✅ 수정: MutableRefObject 제거
  sessionId: string;
  isConnected: boolean;
  setSelectingBlocks: React.Dispatch<React.SetStateAction<SelectingBlock[]>>;
}

const CursorPresence = ({
  stompClientRef,
  sessionId,
  isConnected,
  setSelectingBlocks,
}: CursorPresenceProps) => {
  const [cursors, setCursors] = useState<Record<string, CursorData>>({});
  const { self } = useUserStore();

  useEffect(() => {
    if (!isConnected || !stompClientRef || sessionId === "") {
      return;
    }

    const stompClient = stompClientRef;

    const handleCursorUpdate = (message: any) => {
      const data: CursorData = JSON.parse(message.body);
      setCursors((prev) => ({ ...prev, [data.memberId]: data }));

      if (data.selecting === undefined || data.selecting === null) {
        return;
      }
      // console.log("선택한 블럭 전송받은 데이터 : ", message.body);

      setSelectingBlocks((prevBlocks) => {
        const updatedBlocks = prevBlocks.map((block) => {
          if (block.selectedAudioBlockId === data.selectedAudioBlockId) {
            return { ...block, selecting: false, selectedAudioBlockId: null };
          }

          if (block.memberId === Number(data.memberId)) {
            return {
              ...block,
              memberId: Number(data.memberId),
              selecting: data.selecting,
              selectedAudioBlockId: data.selectedAudioBlockId,
            };
          }
          return block;
        });

        if (JSON.stringify(updatedBlocks) === JSON.stringify(prevBlocks)) {
          return prevBlocks;
        }

        return updatedBlocks;
      });
    };

    const handleCursorRemove = (message: any) => {
      const memberId: string = message.body;
      setCursors((prev) => {
        const updatedCursors = { ...prev };
        delete updatedCursors[memberId];
        return updatedCursors;
      });
    };

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
