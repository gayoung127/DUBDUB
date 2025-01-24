import React from "react";
import AssetCard from "./AssetCard";

const AssetList = () => {
  return (
    <div className="h-full max-h-[431px] w-full border border-gray-300 py-7 pl-4 pr-3">
      <div className="scrollbar flex h-full max-h-[393px] w-full flex-1 flex-wrap items-start justify-start gap-6 overflow-y-scroll">
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
        <AssetCard />
      </div>
    </div>
  );
};

export default AssetList;
