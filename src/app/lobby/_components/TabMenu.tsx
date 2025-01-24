"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import H3 from "@/app/_components/H3";

const TabMenu = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";

  return (
    <div className="flex items-center gap-10">
      <Link
        href="/lobby?tab=all"
        className={` ${currentTab === "all" ? "underline" : "text-gray-500"}`}
      >
        <H3>전체 더빙룸</H3>
      </Link>

      <Link
        href="/lobby?tab=my"
        className={` ${currentTab === "my" ? "underline" : "text-gray-500"}`}
      >
        <H3>예정 더빙룸</H3>
      </Link>
    </div>
  );
};

export default TabMenu;
