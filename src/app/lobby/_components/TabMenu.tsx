"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const TabMenu = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";

  return (
    <div className="flex items-center gap-10">
      <Link
        href="/lobby?tab=all"
        className={`text-xl ${
          currentTab === "all" ? "underline" : "text-gray-500"
        }`}
      >
        전체 더빙룸
      </Link>

      <Link
        href="/lobby?tab=my"
        className={`text-xl ${
          currentTab === "my" ? "underline" : "text-gray-500"
        }`}
      >
        예정 더빙룸
      </Link>
    </div>
  );
};

export default TabMenu;
