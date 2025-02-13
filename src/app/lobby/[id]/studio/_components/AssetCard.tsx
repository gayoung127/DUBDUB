import React, { useEffect, useRef, useState } from "react";

import AssetIcon from "@/public/images/icons/icon-asset.svg";
import C3 from "@/app/_components/C3";
import { useDrag } from "react-dnd";
import { AudioFile } from "@/app/_types/studio";

interface AssetCardProps {
  isAssetSelected: boolean; // 선택 상태
  onClick: () => void; // 클릭 이벤트 핸들러
  audioFile: AudioFile | null;
}

const AssetCard = ({ isAssetSelected, onClick, audioFile }: AssetCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ASSET",
    item: { id: audioFile?.id, url: audioFile?.url }, // 드래그 시 전달할 데이터
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // ref와 drag를 결합
  drag(ref);

  function getFileName(filePath: string): string {
    if (!filePath) return "";
    const parts = filePath.split("/");

    return parts[parts.length - 1].split("-")[0];
  }

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      ref={ref} // ✅ useRef 사용
      onClick={onClick}
      className={`box-border flex cursor-pointer flex-col items-center justify-center gap-y-2 border ${
        isAssetSelected ? "border-[#3668FF]" : "border-transparent"
      } hover:border-[#3668FF]/50 ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <AssetIcon width={60} height={60} />
      <C3 className="w-[60px] truncate text-center text-white-100">
        {audioFile && getFileName(audioFile?.id)}
      </C3>

      {isHovered && (
        <div className="shadow-md absolute left-[50px] top-[50px] z-10 -translate-x-1/2 transform rounded-md bg-brand-200 px-2 py-1 text-[0.3em] text-white-100">
          {audioFile && getFileName(audioFile?.id)}
        </div>
      )}
    </div>
  );
};

export default AssetCard;
