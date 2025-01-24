import React from "react";
import AssetCard from "./AssetCard";

const AssetList = () => {
  return (
    <div className="flex h-full w-full flex-1 flex-wrap items-start justify-start gap-6 border border-gray-300 px-4 py-7">
      <AssetCard />
      <AssetCard />
      <AssetCard />
      <AssetCard />
      <AssetCard />
      <AssetCard />
      <AssetCard />
    </div>
  );
};

export default AssetList;
