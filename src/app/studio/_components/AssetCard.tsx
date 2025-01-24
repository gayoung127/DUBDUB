import React from "react";

import AssetIcon from "@/public/images/icons/icon-asset.svg";
import C3 from "@/app/_components/C3";

const AssetCard = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-y-2">
      <AssetIcon width={60} height={60} />
      <C3 className="text-white-100">철수(이현정)_1</C3>
    </div>
  );
};

export default AssetCard;
