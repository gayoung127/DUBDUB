import React, { useEffect, useRef, useState } from "react";
import { RoleData } from "../type";

interface RoleButtonProps {
  roleData: RoleData;
  currentUserId: string;
  mySelectedCount: number;
  onClick: (role: RoleData) => void;
}
const RoleButton = ({
  roleData,
  currentUserId,
  mySelectedCount,
  onClick,
}: RoleButtonProps) => {
  const isSelectedByMe = roleData.selectedBy === currentUserId;
  const isSelectedByOther =
    roleData.selectedBy !== null && roleData.selectedBy !== currentUserId;
  const isDisabled = mySelectedCount >= 1 && !isSelectedByMe;

  const textRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(
          textRef.current.scrollWidth > textRef.current.clientWidth,
        );
      }
    };
    checkOverflow();
  }, [roleData.role, roleData.nickname]);

  return (
    <button
      className={`shasow-sm group flex h-[52px] w-[340px] items-center overflow-hidden rounded-lg border bg-white-900 px-4 py-3 ${isSelectedByMe ? "border-brand-200" : "border-white-200"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={() => !isSelectedByOther && onClick(roleData)}
      disabled={isDisabled}
    >
      <div className="flex items-center gap-2">
        <div className="w-[106px] overflow-hidden text-center text-xl text-gray-400">
          <span
            ref={textRef}
            className={`block whitespace-nowrap ${
              isOverflowing ? (isHovered ? "animate-flowText" : "truncate") : ""
            }`}
          >
            {roleData.role}
          </span>
        </div>

        <div className="h-[40px] w-0 border border-gray-100/50"></div>

        {isSelectedByMe ? (
          <div className="flex items-center gap-2">
            <img
              src={roleData.profileImage ?? undefined} // 임시 이미지
              className="h-[38px] w-[38px] rounded-full"
            />
            <div className="w-[128px] items-center overflow-hidden text-center text-base text-gray-400">
              <span
                ref={textRef}
                className={`block whitespace-nowrap ${
                  isOverflowing
                    ? isHovered
                      ? "animate-flowText"
                      : "truncate"
                    : ""
                }`}
              >
                {roleData.nickname || "임시임시"}
              </span>
            </div>
          </div>
        ) : isSelectedByOther ? (
          <div className="flex items-center gap-2">
            <img
              src={roleData.profileImage ?? undefined} // 임시 이미지
              className="h-[38px] w-[38px] rounded-full"
            />
            <div className="w-[128px] items-center overflow-hidden text-center text-base text-gray-400">
              <span
                ref={textRef}
                className={`block whitespace-nowrap ${
                  isOverflowing
                    ? isHovered
                      ? "animate-flowText"
                      : "truncate"
                    : ""
                }`}
              >
                {roleData.nickname}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-[194px] text-center text-xl text-gray-400">
              신청하기
            </span>
          </div>
        )}
      </div>
    </button>
  );
};

export default RoleButton;
