"use client";
import React, { useEffect, useState } from "react";
import RoleButton from "./RoleButton";
import { RoleData } from "../type";
import H2 from "@/app/_components/H2";

interface RolesProps {
  roles: RoleData[];
  onRoleSelect: (selectedRole: RoleData[], isRoleSelected: boolean) => void;
}

const Role = ({ roles, onRoleSelect }: RolesProps) => {
  const [rolesState, setRolesState] = useState<RoleData[]>(roles);
  const [mySelectedCount, setMySelectedCount] = useState<number>(0);

  const currentUserId = "currentUserId";

  useEffect(() => {
    setRolesState([...roles]);
  }, [roles]);

  useEffect(() => {
    const selectedRoles = rolesState.filter(
      (role) => role.selectedBy === currentUserId,
    );

    setMySelectedCount(selectedRoles.length);

    onRoleSelect(selectedRoles, selectedRoles.length > 0);
  }, [rolesState]);

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

      return updatedRoles;
    });
  };

  return (
    <section className="flex flex-col gap-4 p-1">
      <H2 className="px-6 py-1 tracking-[1px]">ROLE</H2>
      <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-6">
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
    </section>
  );
};

export default Role;
