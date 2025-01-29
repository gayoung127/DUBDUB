"use client";

import React, { useState } from "react";
import AssetCard from "./AssetCard";

const AssetList = () => {
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setSelectedAsset(index);
  };

  return (
    <div className="h-full max-h-[431px] w-full border border-gray-300 py-7 pl-4 pr-3">
      <div className="scrollbar flex h-full max-h-[393px] w-full flex-1 flex-wrap items-start justify-start gap-6 overflow-y-scroll">
        {Array.from({ length: 16 }).map((_, index) => (
          <AssetCard
            key={index}
            isAssetSelected={selectedAsset === index} // 선택 상태 전달
            onClick={() => handleClick(index)} // 클릭 이벤트 전달
          />
        ))}
      </div>
    </div>
  );
};

export default AssetList;
