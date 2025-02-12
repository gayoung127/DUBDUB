import React, { useEffect, useRef, useState } from "react";

import H4 from "@/app/_components/H4";
import C1 from "@/app/_components/C1";
import { useDrag } from "react-dnd";
import Image from "next/image";
import { useMicStore } from "@/app/_store/MicStore";
import MicOn from "@/public/images/icons/icon-micon.svg";
import MicOff from "@/public/images/icons/icon-micoff.svg";

interface RoleCardProps {
  id: number;
  name: string;
  role: string;
  profileImageUrl: string;
  stream: MediaStream;
}

const RoleCard = ({
  id,
  name,
  role,
  profileImageUrl,
  stream,
}: RoleCardProps) => {
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

  const audioRef = useRef<HTMLAudioElement>(null);
  const { micStatus, toggleMic } = useMicStore();
  const isMicOn = micStatus[id] || false;
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      if (audioRef.current.srcObject !== stream) {
        audioRef.current.pause();
        audioRef.current.srcObject = stream;
      }
      audioRef.current.volume = isMicOn ? 1 : 0;
      audioRef.current.muted = !isMicOn;
      audioRef.current
        .play()
        .catch((error) => console.error("오디오 스트림 재생 실패: ", error));
    }
  }, [stream, isMicOn]);

  useEffect(() => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = isMicOn;
    });
  }, [isMicOn, localStream]);

  const handleToggleMic = async () => {
    if (isMicOn) {
      localStream?.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      toggleMic(id);
    } else {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setLocalStream(userStream);
        toggleMic(id);
      } catch (error) {
        console.error("마이크 접근 오류: ", error);
      }
    }
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
      <div className="flex w-full flex-row items-center justify-start gap-x-3">
        <H4 className="text-white-100">{name}</H4>
        <C1 className="text-white-200">&#40;역할 &#58; {role}&#41;</C1>
      </div>
    </div>
  );
};

export default RoleCard;
