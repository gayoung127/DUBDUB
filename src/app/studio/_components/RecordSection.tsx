import H4 from "@/app/_components/H4";
import React from "react";
import TimelineRuler from "./TimelineRuler";
import TimelineTool from "./TimelineTool";

const RecordSection = () => {
  return (
    <section className="flex w-full flex-col items-start justify-start bg-gray-400">
      <div className="flex w-full flex-row items-center justify-start">
        <div className="flex h-[60px] w-[280px] flex-shrink-0 flex-row items-center justify-start border border-gray-300 bg-gray-400 px-5 py-5">
          <H4 className="border-b-2 border-white-100 font-bold text-white-100">
            녹음 세션
          </H4>
        </div>
        <div className="flex h-[60px] w-full flex-1 flex-col items-start justify-start border-l border-r border-t border-gray-300 bg-gray-400">
          <TimelineTool />
          <TimelineRuler />
        </div>
      </div>
    </section>
  );
};

export default RecordSection;
