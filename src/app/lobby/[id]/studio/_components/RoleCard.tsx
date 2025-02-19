import React, { useEffect, useRef, useState } from "react";

import H4 from "@/app/_components/H4";
import C1 from "@/app/_components/C1";
import { useDrag } from "react-dnd";
import Image from "next/image";
import { useMicStore } from "@/app/_store/MicStore";
import MicOn from "@/public/images/icons/icon-micon.svg";
import MicOff from "@/public/images/icons/icon-micoff.svg";
import { useUserStore } from "@/app/_store/UserStore";

interface RoleCardProps {
  id: number;
  name: string;
  role: string;
  profileImageUrl: string;
}

const RoleCard = ({ id, name, role, profileImageUrl }: RoleCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "MEMBER",
    item: {
      id,
      name,
      role,
      profileImageUrl,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  const { micStatus, setMicStatus } = useMicStore();
  const isMicOn = micStatus[id] ?? true;
  const { self, studioMembers } = useUserStore();

  useEffect(() => {
    if (!self || self.memberId !== id) return;
    setMicStatus(id ?? -1, true);
  }, [self]);

  useEffect(() => {
    if (!studioMembers || !studioMembers.some((m) => m.memberId === id)) return;
    setMicStatus(id ?? -1, true);
  }, [studioMembers]);

  //마이크 토글
  const handleToggleMic = async () => {
    setMicStatus(id, !isMicOn);
  };

  return (
    <div
      ref={ref}
      className={`draggable ${isDragging ? "is-dragging" : ""} flex w-full flex-row items-center justify-start gap-x-3`}
    >
      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-start rounded-full bg-gray-100">
        <Image
          src={profileImageUrl}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-full"
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-x-3">
        <div className="flex items-center gap-x-3">
          <H4 className="text-white-100">{name}</H4>
          {/* <C1 className="text-white-200">&#40;역할 &#58; {role}&#41;</C1> */}
        </div>
        <button
          onClick={handleToggleMic}
          className={`flex h-[24px] w-[24px] items-center justify-center rounded-[4px] ${isMicOn ? "bg-brand-100" : "bg-gray-100"}`}
          disabled={id !== self?.memberId}
        >
          {isMicOn ? <MicOn /> : <MicOff />}
        </button>
      </div>
    </div>
  );
};

export default RoleCard;
