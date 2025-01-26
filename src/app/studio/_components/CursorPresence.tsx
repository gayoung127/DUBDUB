"use client";

import React, { useEffect, useState } from "react";
import { socket } from "@/app/_utils/socketClient";
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
    // 서버로부터 커서 업데이트 받기
    socket.on("cursorUpdate", (data: CursorData) => {
      setCursors((prev) => ({
        ...prev,
        [data.id]: { id: data.id, x: data.x, y: data.y, name: data.name },
      }));
    });

    // 서버로부터 사용자 제거 이벤트 받기
    socket.on("cursorRemove", (id: string) => {
      setCursors((prev) => {
        const updatedCursors = { ...prev };
        delete updatedCursors[id];
        return updatedCursors;
      });
    });

    return () => {
      socket.off("cursorUpdate");
      socket.off("cursorRemove");
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const name = "아무개";

    console.log(
      `Sending cursorMove event to server: x=${x}, y=${y}, 이름:${name}`,
    );
    socket.emit("cursorMove", { x, y, name }); // 이벤트 전송
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      {Object.entries(cursors).map(([id, cursor]) => (
        <Cursor key={id} id={id} x={cursor.x} y={cursor.y} name={cursor.name} />
      ))}
    </div>
  );
};

export default CursorPresence;
