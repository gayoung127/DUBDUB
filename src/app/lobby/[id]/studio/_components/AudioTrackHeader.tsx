"use client";

import Image from "next/image";
import { useDrop } from "react-dnd";
import React, { useEffect, useRef, useState } from "react";

import { Track } from "@/app/_types/studio";
import { ContextMenuItem, useContextMenu } from "@/app/_hooks/useContextMenu";

import ContextMenu from "./ContextMenu";

import MinusIcon from "@/public/images/icons/icon-minus.svg";
import { useTrackRecorders } from "@/app/_hooks/useTrackRecorderSocket";

interface AudioTrackHeaderProps {
  trackId: number;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;

  isMuted?: boolean;
  isSolo?: boolean;
  recorderId?: number;
  recorderName?: string;
  recorderRole?: string;
  recorderProfileUrl?: string;

  selectedTrackId?: number | null;
  setSelectedTrackId?: React.Dispatch<React.SetStateAction<number | null>>;
}

const AudioTrackHeader = ({
  trackId,
  isMuted,
  isSolo,
  setTracks,
  recorderId,
  recorderName,
  recorderRole,
  recorderProfileUrl,
  selectedTrackId,
  setSelectedTrackId,
}: AudioTrackHeaderProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { contextMenuState, handleContextMenu, handleCloseContextMenu } =
    useContextMenu();
  const { sendTrackRecorder } = useTrackRecorders(setTracks);

  // handleMute(): 트랙 음소거
  function handleMute() {
    setTracks((prevTracks) => {
      return prevTracks.map((track, index) => {
        if (track.trackId === trackId) {
          return {
            ...track,
            isMuted: !isMuted,
            isSolo: isMuted ? isSolo : false,
          };
        } else {
          return { ...track, isSolo: false };
        }
      });
    });
  }

  // handleSolo(): 트랙 솔로
  function handleSolo() {
    setTracks((prevTracks) => {
      return prevTracks.map((track, index) => {
        if (track.trackId === trackId) {
          return { ...track, isSolo: !track.isSolo, isMuted: false };
        } else {
          return {
            ...track,
            isSolo: isSolo ? track.isSolo : false,
            isMuted: isSolo ? false : true,
          };
        }
      });
    });
  }

  // useDrop(): 참여자 드래그 시, 트랙에 점유 할당
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "MEMBER",
    drop: (item: {
      id: number;
      name: string;
      role: string;
      profileImageUrl: string;
    }) => {
      if (!trackRef.current) return;

      console.log(
        `Dropped: ${item.name} (${item.role}) ${item.profileImageUrl} onto track ${trackId}`,
      );

      sendTrackRecorder(trackId.toString(), item.id.toString());
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(trackRef);

  // useEffect: delete 버튼으로 트랙 할당자 삭제
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "delete" && selectedTrackId === trackId) {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTrackId]);

  // handleDelete(): 트랙 할당자 삭제
  const handleDelete = () => {
    setTracks((prev) =>
      prev.map((track) =>
        track.trackId === trackId
          ? {
              ...track,
              recorderId: undefined,
              recorderName: undefined,
              recorderRole: undefined,
              recorderProfileUrl: undefined,
            }
          : track,
      ),
    );
  };

  // menuItems: 트랙 메뉴 모달
  const menuItems: ContextMenuItem[] = [
    {
      icon: <MinusIcon width={16} height={16} />,
      action: () => handleDelete(),
    },
  ];

  // handleRightClick(): 마우스 우클릭시, 트랙 메뉴 모달 생성
  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (setSelectedTrackId) {
      setSelectedTrackId(trackId);
    }
    handleContextMenu(event.nativeEvent, menuItems);
  };

  return (
    <div
      ref={trackRef}
      className={`box-border flex h-[60px] min-h-0 w-[280px] flex-row items-center justify-between overflow-hidden border-b border-t border-gray-300 px-3 ${isOver ? "bg-gray-100" : "bg-gray-400"} `}
    >
      <span className="text-sm font-normal text-white-100">
        오디오 트랙 {trackId}
      </span>
      <div className="flex flex-row items-center gap-x-4">
        {recorderId && (
          <div
            className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 ${trackId === selectedTrackId ? "border-2 border-yellow-600" : ""}`}
            onContextMenu={handleRightClick}
            onClick={() => {
              if (setSelectedTrackId) {
                setSelectedTrackId((prev) =>
                  prev === trackId ? null : trackId,
                );
              }
            }}
          >
            <Image
              src={recorderProfileUrl || "/images/icon/defaultAvatar.png"}
              alt={recorderName || "프로필 이미지"}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
            <div className="relative">
              <ContextMenu
                x={contextMenuState.x}
                y={contextMenuState.y}
                menuItems={contextMenuState.menuItems}
                isOpen={contextMenuState.isOpen}
                onClose={handleCloseContextMenu}
              />
            </div>
          </div>
        )}

        <div
          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm ${isMuted ? "bg-green-500" : "bg-white-100"}`}
          onClick={handleMute}
        >
          <span className="text-xs font-bold text-gray-400">M</span>
        </div>
        <div
          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm ${isSolo ? "bg-orange-400" : "bg-white-100"}`}
          onClick={handleSolo}
        >
          <span className="text-xs font-bold text-gray-400">S</span>
        </div>
      </div>
    </div>
  );
};

export default AudioTrackHeader;
