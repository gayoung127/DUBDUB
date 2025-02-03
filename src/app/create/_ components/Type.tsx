import React from "react";
import Badge from "@/app/_components/Badge";
import H2 from "@/app/_components/H2";

const Type = () => {
  return (
    <div className="p-4">
      <H2 className="mb-2">TYPE</H2>
      <div className="flex flex-wrap gap-2">
        <Badge title="영화" />
        <Badge title="애니메이션" />
        <Badge title="다큐멘터리" />
        <Badge title="드라마" />
        <Badge title="광고/CF" />
        <Badge title="기타" />
      </div>
    </div>
  );
};

export default Type;
