import H4 from "@/app/_components/H4";
import React from "react";
import RecordSection from "./RecordSection";
import AssetList from "./AssetList";

const StudioSideTab = () => {
  return (
    <section className="flex h-full min-h-[471px] w-[280px] flex-col items-start justify-start bg-gray-400">
      <div className="flex h-10 w-full flex-row items-start justify-start">
        <div className="flex h-full flex-1 flex-row items-center justify-center border border-gray-300">
          <H4 className="font-bold text-white-100">에셋</H4>
        </div>
        <div className="flex h-full flex-1 flex-row items-center justify-center border border-gray-300">
          <H4 className="font-bold text-gray-100">효과</H4>
        </div>
        <div className="flex h-full flex-1 flex-row items-center justify-center border border-gray-300">
          <H4 className="font-bold text-gray-100">더빙 분석</H4>
        </div>
      </div>
      <AssetList />
    </section>
  );
};

export default StudioSideTab;
