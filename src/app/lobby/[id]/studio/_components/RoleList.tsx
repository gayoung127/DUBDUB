import React from "react";
import RoleCard from "./RoleCard";
import { useUserStore } from "@/app/_store/UserStore";
import { useStudioMembers } from "@/app/_hooks/useStudioMembers";

interface RoleListProps {
  userAudioStreams: Record<number, MediaStream>;
}

const RoleList = ({ userAudioStreams }: RoleListProps) => {
  const { self } = useUserStore();
  const { studioMembers } = useStudioMembers();

  return (
    <div className="h-full min-h-[433px] w-full border border-gray-300 py-7 pl-4 pr-3">
      <div className="scrollbar flex h-full max-h-[393px] w-full flex-col items-start justify-start gap-y-6 overflow-y-scroll">
        {self && (
          <RoleCard
            key={self.memberId}
            id={self.memberId!}
            name={self.nickName!}
            role="나"
            profileImageUrl={self.profileUrl!}
            stream={userAudioStreams[self.memberId!]}
          />
        )}

        {studioMembers
          .filter((member) => member.memberId !== self?.memberId)
          .map((member) => (
            <RoleCard
              key={member.memberId}
              id={member.memberId!}
              name={member.nickName!}
              role={member.position!}
              profileImageUrl={member.profileUrl!}
              stream={userAudioStreams[member.memberId!]}
            />
          ))}
      </div>
    </div>
  );
};

export default RoleList;
