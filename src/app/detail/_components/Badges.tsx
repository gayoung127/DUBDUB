import Badge from "@/app/_components/Badge";
import React from "react";

const Badges = () => {
  return (
    <div className="flex flex-wrap items-center gap-[6px] p-1">
      <Badge title="영화" />
      <Badge title="애니메이션" />
      <Badge title="SF" />
      <Badge title="액션" />
      <Badge title="코믹" />
      <Badge title="일상" />
      <Badge title="스릴러" />
      <Badge title="공포" />
      <Badge title="로맨스" />
      <Badge title="판타지" />
      <Badge title="다큐멘터리" />
      <Badge title="드라마" />
      <Badge title="광고/CF" />
      <Badge title="기타" />
    </div>
  );
};

export default Badges;
