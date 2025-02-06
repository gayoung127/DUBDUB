import React, { useRef } from "react";

import H4 from "@/app/_components/H4";
import C1 from "@/app/_components/C1";
import { useDrag } from "react-dnd";
import Image from "next/image";

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

  return (
    <div
      ref={ref}
      className="flex w-full flex-row items-center justify-start gap-x-3"
    >
      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-start rounded-full bg-gray-100">
        <Image
          src={profileImageUrl}
          alt={name}
          fill
          style={{ objectFit: "contain" }}
          className="rounded-full"
        />
      </div>
      <div className="flex w-full flex-row items-center justify-start gap-x-3">
        <H4 className="text-white-100">{name}</H4>
        <C1 className="text-white-200">&#40;역할 &#58; {role}&#41;</C1>
      </div>
    </div>
  );
};

export default RoleCard;
