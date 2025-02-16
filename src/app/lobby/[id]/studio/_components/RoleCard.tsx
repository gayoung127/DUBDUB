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
  stream?: MediaStream;
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

  // 스트림 업데이트
  useEffect(() => {
    if (!stream) return;

    setLocalStream(stream);
  }, [stream]);

  // 마이크 상태 확인 및 초기화
  useEffect(() => {
    const checkMicStatus = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInput = devices.find(
          (device) => device.kind === "audioinput",
        );

        if (audioInput) {
          const userStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          if (userStream.getAudioTracks().some((track) => track.enabled)) {
            setLocalStream(userStream);
            toggleMic(id);
          } else {
            userStream.getTracks().forEach((track) => track.stop());
          }
        }
      } catch (error) {
        console.error("마이크 상태 확인 오류: ", error);
      }
    };

    checkMicStatus();
  }, []);

  // 언마운트 시 스트림 정리
  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // 오디오 출력 관리
  useEffect(() => {
    if (audioRef.current && stream) {
      console.log(`🎵 [RoleCard] userId: ${id}, stream:`, stream);
      if (audioRef.current.srcObject !== stream) {
        if (
          audioRef.current.srcObject &&
          audioRef.current.srcObject instanceof MediaStream
        ) {
          audioRef.current.srcObject
            .getTracks()
            .forEach((track) => track.stop());
        }
        audioRef.current.srcObject = stream;
      }
      audioRef.current.volume = isMicOn ? 1 : 0;
      audioRef.current.muted = !isMicOn;
      audioRef.current
        .play()
        .catch((error) => console.error("오디오 스트림 재생 실패: ", error));
    }
  }, [stream, isMicOn]);

  //마이크 토글
  const handleToggleMic = async () => {
    toggleMic(id);
    if (isMicOn) {
      localStream?.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    } else {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStream?.getTracks().forEach((track) => track.stop());
        setLocalStream(userStream);
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
      <div className="flex w-full flex-row items-center justify-between gap-x-3">
        <div className="flex items-center gap-x-3">
          <H4 className="text-white-100">{name}</H4>
          <C1 className="text-white-200">&#40;역할 &#58; {role}&#41;</C1>
          <audio ref={audioRef} autoPlay muted />
        </div>
        <button
          onClick={handleToggleMic}
          className={`flex h-[24px] w-[24px] items-center justify-center rounded-[4px] ${isMicOn ? "bg-brand-100" : "bg-gray-100"}`}
        >
          {isMicOn ? <MicOn /> : <MicOff />}
        </button>
      </div>
    </div>
  );
};

export default RoleCard;
