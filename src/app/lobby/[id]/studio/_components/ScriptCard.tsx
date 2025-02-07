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
}

const ScriptCard = ({ id, text, timestamp, role, no }: ScriptCardProps) => {
  const formattedTimestamp = formatTime(timestamp);

  return (
    <div className="flex w-full flex-col items-start justify-start pr-4">
      <div className="flex w-full flex-col items-start justify-start gap-y-1.5 rounded-[4px] bg-gray-200 px-3 py-2">
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
