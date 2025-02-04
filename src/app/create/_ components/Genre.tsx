import React, { useState } from "react";
import Badge from "@/app/_components/Badge";
import H2 from "@/app/_components/H2";

const Genre = () => {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const handleBadgeClick = (title: string) => {
    setSelectedBadge((prev) => (prev === title ? null : title));
  };

  return (
    <div className="p-4">
      <H2 className="mb-2">GENRE</H2>
      <div className="flex flex-wrap gap-2">
        {["액션", "코믹", "스릴러", "공포", "로맨스", "SF", "일상", "기타"].map(
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

export default Genre;
