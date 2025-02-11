"use client";

import { useRouter } from "next/router";
import Header from "@/app/_components/Header";
import { stompClient } from "@/app/_utils/socketClient"; // 변경된 부분
import CursorPresence from "./_components/CursorPresence";
import RecordSection from "./_components/RecordSection";
import StudioScript from "./_components/StudioScript";
import StudioSideTab from "./_components/StudioSideTab";
import TeamRole from "./_components/TeamRole";
import VideoPlayer from "./_components/VideoPlayer";
import { useEffect, useRef, useState } from "react";
import WebRTCManager from "./_components/WebRTCManager";
import { Session } from "openvidu-browser";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useUserStore } from "@/app/_store/UserStore";
import { getMyInfo } from "@/app/_apis/user";

export default function StudioPage() {
  const studioId = "1"; // 임시 studioId
  const sessionId = "test-session-123"; // 예시 sessionId
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<Session | null>(null);
  const [duration, setDuration] = useState<number>(160);
  const videoRef = useRef<VideoElementWithCapturestream>(null);

  if (!studioId) {
    throw new Error("studioId 없음");
  }
  const studioIdString = Array.isArray(studioId) ? studioId[0] : studioId;

  useEffect(() => {
    if (!studioId) return;

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!BASE_URL) return;

    setVideoUrl("/examples/zzangu.mp4");

    // 임시 studioId를 토대로 더빙 정보를 가져오는 api 필요
    /* 
    const getStudioInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/studio/info/${studioId}`);
        const data = await response.json();
        
        setVideoUrl(data.videoUrl);
      } catch (error) {
        console.error("videoUrl 가져오기 실패: ", error);
      }
    };
    */
  }, [studioId]);

  const { memberId, email, position, profileUrl } = useUserStore();

  useEffect(() => {
    getMyInfo();
  }, []);

  // 커서 이동 이벤트 처리
  const handlePointerMove = (e: React.PointerEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const name = "user123"; // 예시 사용자 ID

    // STOMP 클라이언트를 사용하여 커서 데이터를 서버로 전송
    stompClient.publish({
      destination: `/app/studio/${sessionId}/cursor`, // 커서 이동 전송
      body: JSON.stringify({ x, y, name }),
    });

    console.log("📤 Sent Cursor Data:", { x, y, name });
  };

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
        <CursorPresence />
        <WebRTCManager studioId={studioIdString} />
      </div>
    </DndProvider>
  );
}
