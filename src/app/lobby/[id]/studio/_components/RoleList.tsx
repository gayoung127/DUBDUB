import React from "react";
import RoleCard from "./RoleCard";

const members = [
  {
    id: 1,
    name: "이현정",
    role: "철수",
    profileImageUrl: "/images/tmp/profile1.png",
  },
  {
    id: 2,
    name: "이주은",
    role: "짱구",
    profileImageUrl: "/images/tmp/profile2.png",
  },
  {
    id: 3,
    name: "박가영",
    role: "흰둥이",
    profileImageUrl: "/images/tmp/profile1.png",
  },
  {
    id: 4,
    name: "김지훈",
    role: "훈이",
    profileImageUrl: "/images/tmp/profile1.png",
  },
  {
    id: 5,
    name: "김민지",
    role: "맹구",
    profileImageUrl: "/images/tmp/profile1.png",
  },
  {
    id: 6,
    name: "강희민",
    role: "유리",
    profileImageUrl: "/images/tmp/profile1.png",
  },
];

interface RoleListProps {
  userAudioStreams: Record<number, MediaStream>;
}

const RoleList = ({ userAudioStreams }: RoleListProps) => {
  return (
    <div className="h-full min-h-[433px] w-full border border-gray-300 py-7 pl-4 pr-3">
      <div className="scrollbar flex h-full max-h-[393px] w-full flex-col items-start justify-start gap-y-6 overflow-y-scroll">
        {members.map((member) => (
          <RoleCard
            key={member.id}
            id={member.id}
            name={member.name}
            role={member.role}
            profileImageUrl={member.profileImageUrl}
            stream={userAudioStreams[member.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default RoleList;
