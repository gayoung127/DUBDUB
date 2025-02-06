import React, { useState } from "react";
import Badge from "@/app/_components/Badge";
import H2 from "@/app/_components/H2";

const Type = () => {
  // 선택된 배지의 제목을 상태로 관리
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  // 배지 클릭 핸들러
  const handleBadgeClick = (title: string) => {
    setSelectedBadge((prev) => (prev === title ? null : title)); // 같은 배지를 클릭하면 선택 해제
  };

  return (
    <div className="p-4">
      <H2 className="mb-2">TYPE</H2>
      <div className="flex flex-wrap gap-2">
        {["영화", "애니메이션", "다큐멘터리", "드라마", "광고/CF", "기타"].map(
          (title) => (
            <div key={title} onClick={() => handleBadgeClick(title)}>
              <Badge title={title} selected={selectedBadge === title} />
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default Type;
