"use client";

import React from "react";

import { useTimeStore } from "@/app/_store/TimeStore";

import ScriptCard from "./ScriptCard";

import H4 from "@/app/_components/H4";
import C1 from "@/app/_components/C1";

import { scripts } from "@/app/_temp/temp_scripts"; //임시 데이터(주석처리 해야함)

//  전달받는 스크립트 데이터 타입 정의
interface StudioScriptProps {
  scripts: { role: string; text: string }[];
}

const StudioScript = ({ scripts }: StudioScriptProps) => {
  const { time } = useTimeStore();

  return (
    <section className="flex h-full min-h-[440px] w-full flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-y-8 border border-gray-300 bg-gray-400 px-5 py-5">
      <div className="flex w-full flex-row items-center justify-between">
        <H4 className="border-b-2 border-white-100 font-bold text-white-100">
          대본
        </H4>
        <C1 className="border-b border-white-200 font-normal text-white-200">
          더빙 분석
        </C1>
      </div>
      <div className="scrollbar flex h-full max-h-[451px] w-full flex-1 flex-col items-start justify-start gap-6 overflow-y-scroll">
        {scripts.map((script, index) => (
          <ScriptCard
            key={index}
            id={index}
            role={script.role}
            text={script.text}
            timestamp={0} // 타임스탬프 어떻게 구현하지?
            no={index + 1}
          />
        ))}
      </div>
    </section>
  );
};

export default StudioScript;
