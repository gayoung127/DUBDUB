"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { Track } from "@/app/_types/studio";
import Image from "next/image";

interface AudioTrackHeaderProps {
  trackId: number;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;

  isMuted: boolean;
  recorderId?: number;
  recorderName?: string;
  recorderRole?: string;
  recorderProfileUrl?: string;
}

const AudioTrackHeader = ({
  trackId,
  isMuted,
  setTracks,
  recorderId,
  recorderName,
  recorderRole,
  recorderProfileUrl,
}: AudioTrackHeaderProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  // const [isTrackMuted, setIsTrackMuted] = useState<boolean>(isMuted);
  const [isSolo, setIsSolo] = useState<boolean>(false);

  function handleMute() {}

  function handleSolo() {}

  // ---------------------

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

      setTracks((prevTracks) =>
        prevTracks.map((track) =>
          track.trackId === trackId
            ? {
                ...track,
                recorderId: item.id,
                recorderName: item.name,
                recorderRole: item.role,
                recorderProfileUrl: item.profileImageUrl,
              }
            : { ...track },
        ),
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(trackRef);

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
          <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
            <Image
              src={recorderProfileUrl || "/images/tmp/dducip.jpg"}
              alt={recorderName || "프로필 이미지"}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-full"
            />
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
