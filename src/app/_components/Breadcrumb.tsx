import React from "react";
import Link from "next/link";

import H4 from "./H4";

import BreadcrumbNextIcon from "@/public/images/icons/icon-breadcrumb-next.svg";

interface BreadCrumbProps {
  pathSegments: string[];
}

const BreadCrumb = ({ pathSegments }: BreadCrumbProps) => {
  let accumulatedPath = "";

  return (
    <div className="flex flex-1 flex-row items-center justify-start gap-3 px-5 py-6">
      {pathSegments.map((segment, index) => {
        accumulatedPath += `/${segment}`;

        return (
          <React.Fragment key={segment}>
            <Link href={accumulatedPath}>
              <H4
                className={`min-h-5 ${pathSegments.length <= 2 ? `font-bold text-gray-400 last:border-b-gray-400` : `text-white-100 last:border-b-white-100`} last:border-b-2`}
              >
                {segment.toUpperCase()}
              </H4>
            </Link>
            {index < pathSegments.length - 1 && (
              <BreadcrumbNextIcon width={20} height={20} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
