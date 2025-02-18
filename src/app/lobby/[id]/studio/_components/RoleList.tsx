import React from "react";
import RoleCard from "./RoleCard";
import { UserStore, useUserStore } from "@/app/_store/UserStore";
import { useStudioMembers } from "@/app/_hooks/useStudioMembers";
import WebRTCManager from "./WebRTCManager";

interface RoleListProps {
  userAudioStreams: Record<number, MediaStream>;
  studioMembers: UserStore[];
  sessionToken: string;
}

const RoleList = ({
  userAudioStreams,
  studioMembers,
  sessionToken,
}: RoleListProps) => {
  const { self } = useUserStore();
  console.log(
    "🎵 [RoleList] 전달되는 userAudioStreams 상태:",
    userAudioStreams,
  );

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
            />
          ))}
        <WebRTCManager sessionToken={sessionToken} />
      </div>
    </div>
  );
};

export default RoleList;
