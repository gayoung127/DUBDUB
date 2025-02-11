"use client";

import React, { useState } from "react";

import H4 from "@/app/_components/H4";
import AssetList from "./AssetList";
import RoleList from "./RoleList";
import EffectList from "./effects/EffectList";

interface StudioSideTabProps {
  userAudioStreams: Record<number, MediaStream>;
}

const StudioSideTab = ({ userAudioStreams }: StudioSideTabProps) => {
  const [activeTab, setActiveTab] = useState<"role" | "asset" | "effect">(
    "asset",
  );

  const handleClickTabMenu = (tab: "role" | "asset" | "effect") => {
    setActiveTab(tab);
  };

  return (
    <section className="flex h-full min-h-[471px] w-[280px] flex-col items-start justify-start bg-gray-400">
      <div className="flex h-10 w-full flex-row items-start justify-start">
        <div
          className={`flex h-full flex-1 cursor-pointer flex-row items-center justify-center border border-gray-300 ${
            activeTab === "role" ? "bg-white text-white-100" : "text-gray-100"
          }`}
          onClick={() => handleClickTabMenu("role")}
        >
          <H4 className="font-bold">역할</H4>
        </div>
        <div
          className={`flex h-full flex-1 cursor-pointer flex-row items-center justify-center border border-gray-300 ${
            activeTab === "asset" ? "bg-white text-white-100" : "text-gray-100"
          }`}
          onClick={() => handleClickTabMenu("asset")}
        >
          <H4 className="font-bold">에셋</H4>
        </div>
        <div
          className={`flex h-full flex-1 cursor-pointer flex-row items-center justify-center border border-gray-300 ${
            activeTab === "effect" ? "bg-white text-white-100" : "text-gray-100"
          }`}
          onClick={() => handleClickTabMenu("effect")}
        >
          <H4 className="font-bold">효과</H4>
        </div>
      </div>

      {activeTab === "role" && <RoleList userAudioStreams={userAudioStreams} />}
      {activeTab === "asset" && <AssetList />}
      {activeTab === "effect" && <EffectList />}
    </section>
  );
};

export default StudioSideTab;
