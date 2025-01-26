import React from "react";

import AssetIcon from "@/public/images/icons/icon-asset.svg";
import C3 from "@/app/_components/C3";

interface AssetCardProps {
  isAssetSelected: boolean; // 선택 상태
  onClick: () => void; // 클릭 이벤트 핸들러
}

const AssetCard = ({ isAssetSelected, onClick }: AssetCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`box-border flex flex-col items-center justify-center gap-y-2 border ${
        isAssetSelected ? "border-[#3668FF]" : "border-transparent"
      } hover:border-[#3668FF]/50`}
    >
      <AssetIcon width={60} height={60} />
      <C3 className="text-white-100">철수(이현정)_1</C3>
    </div>
  );
};

export default AssetCard;
