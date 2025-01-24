"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";

const TabMenu = () => {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex items-center gap-10">
      <Link href="/lobby/all" className="text-xl">
        <div className={segment === "all" ? "underline" : "text-gray-100"}>
          전체 더빙룸
        </div>
      </Link>
      <Link href="/lobby/my" className="text-xl">
        <div className={segment === "my" ? "underline" : "text-gray-100"}>
          예정 더빙룸
        </div>
      </Link>
    </div>
  );
};

export default TabMenu;
