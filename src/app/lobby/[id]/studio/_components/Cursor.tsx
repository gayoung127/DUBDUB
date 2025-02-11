"use client";

import React, { memo } from "react";

import C1 from "@/app/_components/C1";
import { getCursorStyle } from "@/app/_utils/changeIdToColor";

interface CursorProps {
  id: string;
  name: string;
  x: number; // 커서의 X 좌표
  y: number; // 커서의 Y 좌표
}

const Cursor = memo(({ id, name, x, y }: CursorProps) => {
  const { icon: CursorIcon, bgColor } = getCursorStyle(id);

  return (
    <div
      style={{
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
        transform: "translate(-50%, -50%)", // 커서를 중앙으로 맞추기
        zIndex: 9999,
      }}
    >
      <CursorIcon width={32.5} height={32} />
      <div
        className="absolute left-5 flex max-w-56 flex-row items-center justify-center whitespace-nowrap rounded-md px-2 py-1"
        style={{ backgroundColor: bgColor }}
      >
        <C1 className="font-bold text-white-200">{name}</C1>
      </div>
    </div>
  );
});

Cursor.displayName = "Cursor";

export default Cursor;
