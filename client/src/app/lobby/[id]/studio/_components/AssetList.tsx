"use client";

import React, { useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import { Asset, AudioFile } from "@/app/_types/studio";
import useBlockStore from "@/app/_store/BlockStore";

interface AssetListProps {
  assets: Asset[] | null;
}

const AssetList = ({ assets }: AssetListProps) => {
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const { setSelectedBlockObj } = useBlockStore();

  const filteredAssets = assets
    ? assets.filter((asset, index, self) => {
        const baseId = asset.id.split("-")[0];
        return index === self.findIndex((a) => a.id.split("-")[0] === baseId);
      })
    : [];

  useEffect(() => {
    console.log("모든 에셋 : ", assets);
    console.log("필터링 된 에셋 : ", filteredAssets);
  }, [assets]);

  const handleClick = (index: number) => {
    setSelectedAsset(index);
    setSelectedBlockObj({
      applyToAll: true,
      selectedAudioFile: assets![index],
    });
  };

  return (
    <div className="h-full min-h-[433px] w-full border border-gray-300 py-7 pl-4 pr-3">
      <div className="scrollbar flex h-full max-h-[393px] w-full flex-1 flex-wrap items-start justify-start gap-6 overflow-y-scroll">
        {filteredAssets &&
          filteredAssets.map((asset, index) => (
            <AssetCard
              key={index}
              asset={asset}
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
