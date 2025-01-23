import H4 from "@/app/_components/H4";
import React from "react";

const StudioSideTab = () => {
  return (
    <section className="flex min-h-[472px] w-full min-w-[280px] flex-col items-start justify-start bg-gray-400">
      <div className="flex max-h-10 w-full flex-row items-start justify-start">
        <div className="flex flex-1 flex-row items-center justify-center border border-gray-300 py-2.5">
          <H4 className="border-b-2 border-white-100 font-bold text-white-100">
            에셋
          </H4>
        </div>
        <div className="flex flex-1 flex-row items-center justify-center border border-gray-300 py-2.5">
          <H4 className="font-bold text-gray-100">효과</H4>
        </div>
        <div className="flex flex-1 flex-row items-center justify-center border border-gray-300 py-2.5">
          <H4 className="font-bold text-gray-100">더빙 분석</H4>
        </div>
      </div>
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center border border-gray-300">
        <H4 className="text-white-100">구현할게...</H4>
      </div>
    </section>
  );
};

export default StudioSideTab;
