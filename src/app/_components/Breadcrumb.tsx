import React from "react";
import Link from "next/link";

import H4 from "./H4";

import BreadcrumbNextIcon from "@/public/images/icons/icon-breadcrumb-next.svg";

interface BreadCrumbProps {
  pathSegments: string[];
  studioTitle?: string;
}

const BreadCrumb = ({
  pathSegments,
  studioTitle = "제목 없음",
}: BreadCrumbProps) => {
  let accumulatedPath = "";
  const modifiedSegments = pathSegments.map((segment, index) =>
    index === 1 && !isNaN(Number(segment)) ? studioTitle : segment,
  );

  return (
    <div className="flex flex-1 flex-row items-center justify-start gap-3 px-5 py-6">
      {pathSegments.map((segment, index) => {
        // 실제 경로에서는 원래 숫자를 유지해야 함
        accumulatedPath += `/${segment}`;
        const displayText =
          index === 1 && !isNaN(Number(segment)) ? studioTitle : segment;
        const isLast = index === pathSegments.length - 1;
        const disabledLink = index === 1 ? true : false;

        return (
          <React.Fragment key={`${segment}-${index}`}>
            {!disabledLink ? (
              <Link href={accumulatedPath}>
                <H4
                  className={`min-h-5 font-bold text-white-100 ${
                    isLast ? "border-b-2 border-white-100" : ""
                  }`}
                >
                  {displayText.toUpperCase()}
                </H4>
              </Link>
            ) : (
              <H4
                className={`min-h-5 font-bold text-white-100 ${
                  isLast ? "border-b-2 border-white-100" : ""
                }`}
              >
                {displayText.toUpperCase()}
              </H4>
            )}
            {!isLast && <BreadcrumbNextIcon width={20} height={20} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
