import React from "react";
import RoleCard from "./RoleCard";
import { UserStore, useUserStore } from "@/app/_store/UserStore";
import { useStudioMembers } from "@/app/_hooks/useStudioMembers";
import WebRTCManager from "./WebRTCManager";
import ShareButton from "./ShareButton";

interface RoleListProps {
  studioMembers: UserStore[];
  sessionToken: string;
}

const RoleList = ({ studioMembers, sessionToken }: RoleListProps) => {
  const { self } = useUserStore();

  return (
    <div className="flex h-full min-h-[433px] w-full flex-col border border-gray-300 py-7 pl-4 pr-3">
      <div className="scrollbar flex max-h-[393px] w-full flex-grow flex-col items-start justify-start gap-y-6 overflow-y-scroll">
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
      <div className="mt-auto flex items-center justify-center">
        <ShareButton />
      </div>
    </div>
  );
};

export default RoleList;
