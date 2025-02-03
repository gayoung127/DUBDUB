"use client";

import { useRouter } from "next/router";
import Header from "../_components/Header";
import { socket } from "../_utils/socketClient";
import CursorPresence from "./_components/CursorPresence";
import RecordSection from "./_components/RecordSection";
import StudioScript from "./_components/StudioScript";
import StudioSideTab from "./_components/StudioSideTab";
import TeamRole from "./_components/TeamRole";
import VideoPlayer from "./_components/VideoPlayer";
import { useEffect, useRef, useState } from "react";
import WebRTCManager from "./_components/WebRTCManager";
import { Session } from "openvidu-browser";

export default function StudioPage() {
  const studioId = "1";
  /* 임시 tudioId
  const router = useRouter();
  const { studioId } = router.query;
  */
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<Session | null>(null);
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

    /*임시 studioId를 토대로 더빙 정보를 가져오는 api 필요
    1. 비디오 url
    2. 역할과 참여자 목록
    3. 대본
    4. 그 외 더빙 인포
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

  const handlePointerMove = (e: React.PointerEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const name = "아무개";

    socket.emit("cursorMove", { x, y, name });
  };

  return (
    <>
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
                <VideoPlayer videoRef={videoRef} videoUrl={videoUrl} />
              </div>
            </div>
            <div className="flex h-full w-[440px] flex-shrink-0 flex-col bg-gray-400">
              <TeamRole />
              <StudioScript />
            </div>
          </div>
          <RecordSection />
        </div>
        <CursorPresence />
        <WebRTCManager studioId={studioIdString} />
      </div>
    </>
  );
}
