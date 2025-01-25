"use client";
import React, { useState } from "react";
import RoleButton from "./RoleButton";
import { RoleData } from "../type";

const roles: RoleData[] = [
  {
    id: "1",
    role: "짱구",
    profileImage: "images/tmp/dducip.jpg",
    nickname: "누구게",
    selectedBy: "1",
  },

  {
    id: "2",
    role: "유리",
    profileImage: null,
    nickname: null,
    selectedBy: null,
  },

  {
    id: "3",
    role: "철수",
    profileImage: "images/tmp/dducip.jpg",
    nickname: "누구게",
    selectedBy: "3",
  },

  {
    id: "4",
    role: "맹구",
    profileImage: "images/tmp/dducip.jpg",
    nickname: "누구게",
    selectedBy: "4",
  },
  {
    id: "5",
    role: "훈이",
    profileImage: null,
    nickname: null,
    selectedBy: null,
  },

  {
    id: "6",
    role: "흰둥이",
    profileImage: null,
    nickname: null,
    selectedBy: null,
  },
];

const Role = () => {
  const [rolesState, setRolesState] = useState<RoleData[]>(roles);
  const [mySelectedCount, setMySelectedCount] = useState<number>(0);

  const currentUserId = "currentUserId";

  const handleRoleClick = (clickedRole: RoleData) => {
    setRolesState((prevRoles) => {
      const updatedRoles = prevRoles.map((role) => {
        if (role.id === clickedRole.id) {
          return {
            ...role,
            selectedBy:
              role.selectedBy === currentUserId ? null : currentUserId,
          };
        }
        return role;
      });

      const count = updatedRoles.filter(
        (role) => role.selectedBy === currentUserId,
      ).length;
      setMySelectedCount(count);

      return updatedRoles;
    });
  };

  return (
    <div className="flex flex-col gap-4 p-1">
      <h1 className="text-2xl font-bold tracking-[1px]">ROLE</h1>
      <div className="itens-center flex w-[742px] flex-wrap gap-[30px]">
        {rolesState.map((role) => (
          <RoleButton
            key={role.id}
            roleData={role}
            currentUserId={currentUserId}
            mySelectedCount={mySelectedCount}
            onClick={handleRoleClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Role;
