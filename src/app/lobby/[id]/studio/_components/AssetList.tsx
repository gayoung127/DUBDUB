"use client";

import React, { useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import { AudioFile } from "@/app/_types/studio";
import useBlockStore from "@/app/_store/BlockStore";

interface AssetListProps {
  audioFiles: AudioFile[] | null;
}

const AssetList = ({ audioFiles }: AssetListProps) => {
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const { setSelectedBlock, setSelectedBlockObj } = useBlockStore();
  const [uniqueFiles, setUniqueFiles] = useState<AudioFile[]>([]);

  const handleClick = (index: number) => {
    setSelectedAsset(index);
    setSelectedBlock(audioFiles![index]);
    setSelectedBlockObj({
      applyToAll: true,
      selectedAudioFile: audioFiles![index],
    });
  };

  return (
    <div className="h-full min-h-[433px] w-full border border-gray-300 py-7 pl-4 pr-3">
      <div className="scrollbar flex h-full max-h-[393px] w-full flex-1 flex-wrap items-start justify-start gap-6 overflow-y-scroll">
        {audioFiles &&
          audioFiles.map((audioFile, index) => (
            <AssetCard
              key={index}
              audioFile={audioFile}
              onClick={() => {
                handleClick(index);
              }}
              isAssetSelected={selectedAsset === index}
            />
          ))}
      </div>
    </div>
  );
};

export default AssetList;
