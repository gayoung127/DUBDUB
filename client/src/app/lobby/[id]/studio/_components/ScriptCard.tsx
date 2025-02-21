import React from "react";
import C1 from "@/app/_components/C1";
import C2 from "@/app/_components/C2";
import { formatTime } from "@/app/_utils/formatTime";

interface ScriptCardProps {
  id: number;
  text: string;
  timestamp: number;
  role: string;
  no: number;
  isActive: boolean; // ✅ 현재 활성화된 스크립트인지 여부
}

const ScriptCard = ({
  id,
  text,
  timestamp,
  role,
  no,
  isActive,
}: ScriptCardProps) => {
  const formattedTimestamp = formatTime(timestamp / 1000);

  return (
    <div
      className={`flex w-full flex-col items-start justify-start pr-4 transition-all duration-300 ${
        isActive ? "shadow-lg bg-brand-200" : "bg-gray-200"
      } rounded-[4px] px-3 py-2`}
    >
      <div className="flex w-full flex-col items-start justify-start gap-y-1.5">
        <div className="flex flex-row items-center gap-x-2">
          <C1 className="font-bold text-white-100">{role}</C1>
          <C2 className="text-white-300">{formattedTimestamp}</C2>
        </div>
        <C1 className="text-base font-light leading-snug text-white-100">
          {text}
        </C1>
      </div>
    </div>
  );
};

export default ScriptCard;
