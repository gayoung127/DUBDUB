import React from "react";
import Badge from "@/app/_components/Badge";
import H2 from "@/app/_components/H2";

const Genre = () => {
  return (
    <div className="p-4">
      <H2 className="mb-2">GENRE</H2>
      <div className="flex flex-wrap gap-2">
        <Badge title="액션" />
        <Badge title="코믹" />
        <Badge title="스릴러" />
        <Badge title="공포" />
        <Badge title="로맨스" />
        <Badge title="SF" />
        <Badge title="일상" />
        <Badge title="기타" />
      </div>
    </div>
  );
};

export default Genre;
