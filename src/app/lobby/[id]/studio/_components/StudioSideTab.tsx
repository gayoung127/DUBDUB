"use client";

import React, { useEffect, useRef, useState } from "react";

import H4 from "@/app/_components/H4";
import AssetList from "./AssetList";
import RoleList from "./RoleList";
import EffectList from "./effects/EffectList";
import { Asset, AudioFile, Track } from "@/app/_types/studio";
// import { useAssetsStore } from "@/app/_store/AssetsStore";
import { UserStore } from "@/app/_store/UserStore";

interface StudioSideTabProps {
  userAudioStreams: Record<number, MediaStream>;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  studioMembers: UserStore[];
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  sendAsset: (asset: Asset) => void;
}

const StudioSideTab = ({
  userAudioStreams,
  tracks,
  setTracks,
  studioMembers,
  assets,
  setAssets,
  sendAsset,
}: StudioSideTabProps) => {
  //const audioFilesRef = useRef<AudioFile[] | null>([]);

  // const { audioFiles, addAudioFile } = useAssetsStore();

  const updateAudioFile = (file: Asset | null) => {
    if (!file) {
      return;
    }
    // addAudioFile(file); // audioFiles 추가
    sendAsset(file);
  };

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

      {activeTab === "role" && (
        <RoleList
          studioMembers={studioMembers}
          userAudioStreams={userAudioStreams}
        />
      )}
      {activeTab === "asset" && <AssetList assets={assets} />}
      {activeTab === "effect" && (
        <EffectList
          tracks={tracks}
          setTracks={setTracks}
          onUpdateFile={updateAudioFile}
          assets={assets}
        />
      )}
    </section>
  );
};

export default StudioSideTab;
