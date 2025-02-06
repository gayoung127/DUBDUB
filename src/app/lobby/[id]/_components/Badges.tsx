import Badge from "@/app/_components/Badge";
import React from "react";

interface BadgesProps {
  badges: string[];
}

const Badges = ({ badges }: BadgesProps) => {
  return (
    <div className="flex flex-wrap items-center gap-[6px] p-1">
      {badges.map((badge) => (
        <Badge key={badge} title={badge} />
      ))}
    </div>
  );
};

export default Badges;
