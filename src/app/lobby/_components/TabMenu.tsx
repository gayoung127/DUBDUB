import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import H3 from "@/app/_components/H3";
import useFilterStore from "@/app/_store/FilterStore";
interface Tab {
  title: string;
  href: string;
}

interface TabMenuProps {
  tabs: Tab[];
}

const TabMenu = ({ tabs }: TabMenuProps) => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || tabs[0]?.href.split("tab=")[1];
  const { initiateFilter } = useFilterStore();

  return (
    <div className="flex items-center gap-10">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          onClick={initiateFilter}
          className={` ${
            currentTab === tab.href.split("tab=")[1]
              ? "border-b-2"
              : "text-gray-500"
          }`}
        >
          <H3>{tab.title}</H3>
        </Link>
      ))}
    </div>
  );
};

export default TabMenu;
