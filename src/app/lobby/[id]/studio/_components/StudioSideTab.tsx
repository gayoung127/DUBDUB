"use client";

import React, { useEffect, useRef, useState } from "react";

import H4 from "@/app/_components/H4";
import AssetList from "./AssetList";
import RoleList from "./RoleList";
import EffectList from "./effects/EffectList";
import { AudioFile, Track } from "@/app/_types/studio";
import { useAssetsStore } from "@/app/_store/AssetsStore";

interface StudioSideTabProps {
  userAudioStreams: Record<number, MediaStream>;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
}

const StudioSideTab = ({
  userAudioStreams,
  tracks,
  setTracks,
}: StudioSideTabProps) => {
  //const audioFilesRef = useRef<AudioFile[] | null>([]);

  const { audioFiles, addAudioFile } = useAssetsStore();
  // useEffect(() => {
  //   const loadAudioFiles = () => {
  //     for (const track of tracks) {
  //       for (const file of track.files) {
  //         if (!audioFilesRef.current?.some((obj) => obj.url === file.url)) {
  //           audioFilesRef.current?.push(file);
  //         }
  //       }
  //     }
  //   };

  //   loadAudioFiles();
  // }, [tracks]);

  const updateAudioFile = (file: AudioFile | null) => {
    // if (!audioFilesRef.current || !file) {
    //   return;
    // }
    // audioFilesRef.current.push(file);
    if (!file) {
      return;
    }
    addAudioFile(file);
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

      {activeTab === "role" && <RoleList userAudioStreams={userAudioStreams} />}
      {activeTab === "asset" && <AssetList audioFiles={audioFiles} />}
      {activeTab === "effect" && (
        <EffectList
          tracks={tracks}
          setTracks={setTracks}
          onUpdateFile={updateAudioFile}
          audioFiles={audioFiles}
        />
      )}
    </section>
  );
};

export default StudioSideTab;
