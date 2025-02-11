"use client";

import { useEffect, useRef, useState } from "react";
import useStompClient from "@/app/_utils/socketClient";
import Header from "@/app/_components/Header";
import CursorPresence from "./_components/CursorPresence";
import RecordSection from "./_components/RecordSection";
import StudioScript from "./_components/StudioScript";
import StudioSideTab from "./_components/StudioSideTab";
import VideoPlayer from "./_components/VideoPlayer";
import WebRTCManager from "./_components/WebRTCManager";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useUserStore } from "@/app/_store/UserStore";
import { getMyInfo } from "@/app/_apis/user";

export default function StudioPage() {
  const studioId = "1"; // 임시 studioId
  const sessionId = "test-session-123"; // 예시 sessionId
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [duration, setDuration] = useState<number>(160);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stompClientRef = useStompClient(); // STOMP 클라이언트 관리 (이제 CursorPresence에 전달)

  if (!studioId) {
    throw new Error("studioId 없음");
  }

  const studioIdString = Array.isArray(studioId) ? studioId[0] : studioId;
  const { memberId, email, position, profileUrl } = useUserStore();

  // STOMP를 통해 커서 위치 전송 (성능 최적화)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!stompClientRef.current?.connected) return;

    const x = e.clientX;
    const y = e.clientY;
    const name = email || "user123"; // 예시 사용자 ID (이메일 사용)

    stompClientRef.current.publish({
      destination: `/app/studio/${sessionId}/cursor`,
      body: JSON.stringify({ x, y, name }),
    });
  };

  // 유저 정보 가져오기
  useEffect(() => {
    getMyInfo();
  }, []);

  // 비디오 URL 설정
  useEffect(() => {
    if (!studioId) return;

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!BASE_URL) return;

    setVideoUrl("/examples/zzangu.mp4");
  }, [studioId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        onPointerMove={handlePointerMove}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <div className="relative flex h-full min-h-screen w-full flex-col items-start justify-start">
          <div className="flex h-full w-full flex-row">
            <div className="flex h-full w-full flex-1 flex-col items-start justify-start">
              <Header />
              <div className="flex h-full w-full flex-1 flex-row items-center justify-start">
                <StudioSideTab />
                <VideoPlayer
                  videoRef={videoRef}
                  videoUrl={videoUrl}
                  duration={duration}
                  setDuration={setDuration}
                />
              </div>
            </div>
            <div className="flex h-full w-[440px] flex-shrink-0 flex-col bg-gray-400">
              <StudioScript />
            </div>
          </div>
          <RecordSection duration={duration} setDuration={setDuration} />
        </div>
        {/* STOMP 클라이언트를 CursorPresence로 전달 */}
        <CursorPresence stompClientRef={stompClientRef} />
        <WebRTCManager studioId={studioIdString} />
      </div>
    </DndProvider>
  );
}
