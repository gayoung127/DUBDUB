"use client";
import H2 from "@/app/_components/H2";
import { useState } from "react";
import PlusIcon from "@/public/images/icons/icon-plus.svg";
import DeleteIcon from "@/public/images/icons/icon-delete.svg";
import { RoleData } from "../type";

interface CastingsProps {
  onChange: (roles: string[]) => void; // 역할 데이터 변경 시 호출되는 콜백
}

export default function Castings({ onChange }: CastingsProps) {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  // 역할 추가 핸들러
  const handleAddRole = () => {
    if (newRoleName.trim()) {
      const updatedRoles = [
        ...roles,
        { id: Date.now().toString(), name: newRoleName.trim() },
      ];
      setRoles(updatedRoles);

      // name만 포함된 배열을 상위 컴포넌트로 전달
      const namesOnly = updatedRoles.map((role) => role.name);
      onChange(namesOnly);

      setNewRoleName("");
      setIsAdding(false);
    }
  };

  // 역할 삭제 핸들러
  const handleDeleteRole = (id: string) => {
    const updatedRoles = roles.filter((role) => role.id !== id);
    setRoles(updatedRoles);

    // name만 포함된 배열을 상위 컴포넌트로 전달
    const namesOnly = updatedRoles.map((role) => role.name);
    onChange(namesOnly);
  };
  return (
    <section className="mb-2 p-4">
      <H2 className="mb-2">ROLE</H2>
      <div className="flex flex-wrap items-center gap-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="group flex gap-2 rounded-[8px] border-2 border-brand-200 px-4 py-2 text-lg text-brand-200"
          >
            <span>{role.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRole(role.id);
              }}
              className="ml-2 inline-flex items-center text-brand-200"
            >
              <DeleteIcon />
            </button>
          </div>
        ))}

        {isAdding ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="역할 입력"
              className="rounded-[8px] border-2 border-brand-200 px-4 py-2 text-lg placeholder-gray-100 focus:border-brand-300 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddRole();
                }
              }}
              autoFocus
            />
            <button
              onClick={handleAddRole}
              className="rounded-[8px] border-2 border-brand-200 px-4 py-2 text-lg text-brand-200"
            >
              추가
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewRoleName("");
              }}
              className="rounded-[8px] border-2 border-brand-200 px-4 py-2 text-lg text-brand-200"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border-2 border-brand-200 bg-white-100 text-xl font-bold text-brand-200 transition-colors duration-200"
          >
            <PlusIcon />
          </button>
        )}
      </div>
    </section>
  );
}
