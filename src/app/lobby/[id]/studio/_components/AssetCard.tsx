import React, { useRef } from "react";

import AssetIcon from "@/public/images/icons/icon-asset.svg";
import C3 from "@/app/_components/C3";
import { useDrag } from "react-dnd";

interface AssetCardProps {
  isAssetSelected: boolean; // 선택 상태
  onClick: () => void; // 클릭 이벤트 핸들러
}

const AssetCard = ({ isAssetSelected, onClick }: AssetCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ASSET",
    item: { id: "new-audio", url: "/examples/gazua.mp3" }, // 드래그 시 전달할 데이터
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // ref와 drag를 결합
  drag(ref);

  return (
    <div
      ref={ref} // ✅ useRef 사용
      onClick={onClick}
      className={`box-border flex cursor-pointer flex-col items-center justify-center gap-y-2 border ${
        isAssetSelected ? "border-[#3668FF]" : "border-transparent"
      } hover:border-[#3668FF]/50 ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <AssetIcon width={60} height={60} />
      <C3 className="text-white-100">철수(이현정)_1</C3>
    </div>
  );
};

export default AssetCard;
