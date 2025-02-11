"use client";

import { useRouter } from "next/router";
import Header from "@/app/_components/Header";
import { socket } from "@/app/_utils/socketClient";
import CursorPresence from "./_components/CursorPresence";
import RecordSection from "./_components/RecordSection";
import StudioScript from "./_components/StudioScript";
import StudioSideTab from "./_components/StudioSideTab";
import VideoPlayer from "./_components/VideoPlayer";
import { useEffect, useRef, useState } from "react";
import WebRTCManager from "./_components/WebRTCManager";
import { Session } from "openvidu-browser";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useUserStore } from "@/app/_store/UserStore";
import { getMyInfo } from "@/app/_apis/user";

export default function StudioPage() {
  const router = useRouter();
  const { studioId } = router.query; // studioId를 URL에서 가져옴
  const [script, setScript] = useState<
    {
      id: number;
      text: string;
      timestamp: number;
      role: string;
    }[]
  >([]);
  const [title, setTitle] = useState<string | undefined>(undefined); // 제목
  const [content, setContent] = useState<string | undefined>(undefined); // 내용
  const [genreTypes, setGenreTypes] = useState<string[]>([]); // 장르 타입
  const [categoryTypes, setCategoryTypes] = useState<string[]>([]); // 카테고리 타입
  const [castings, setCastings] = useState<string[]>([]); // 캐스팅 정보
  const [otherInfo, setOtherInfo] = useState<any>(null); // 기타 더빙 정보
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<Session | null>(null);
  const [duration, setDuration] = useState<number>(160);
  const videoRef = useRef<VideoElementWithCapturestream>(null);

  if (!studioId) {
    throw new Error("studioId 없음");
  }
  const studioIdString = Array.isArray(studioId) ? studioId[0] : studioId;

  // 스튜디오 정보를 가져오는 함수
  useEffect(() => {
    if (!studioId) return;

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!BASE_URL) return;

    const getStudioInfo = async () => {
      try {
        // GET 요청을 통해 스튜디오 정보 가져오기
        const response = await fetch(`${BASE_URL}/recruitment`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `스튜디오 정보를 가져오는 데 실패했습니다: ${response.status}`,
          );
        }

        const data = await response.json();

        // 가져온 데이터로 상태 업데이트
        setVideoUrl(data.videoUrl);
        setScript(data.script); // 대본
        setTitle(data.title); // 제목
        setContent(data.content); // 내용
        setGenreTypes(data.genreTypes || []); // 장르 타입
        setCategoryTypes(data.categoryTypes || []); // 카테고리 타입
        setCastings(data.castings || []); // 캐스팅 정보
        setOtherInfo(data.otherInfo || null); // 기타 더빙 정보
      } catch (error) {
        console.error("스튜디오 정보를 가져오는 중 오류 발생: ", error);
      }
    };

    getStudioInfo();
  }, [studioId]);

  const { memberId, email, position, profileUrl } = useUserStore();

  useEffect(() => {
    getMyInfo();
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const name = memberId != null ? memberId.toString() : "아무개";

    socket.emit("cursorMove", { x, y, name });
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
                  videoUrl={videoUrl} // 비디오 URL 상태 전달
                  duration={duration}
                  setDuration={setDuration}
                />
              </div>
            </div>
            <div className="flex h-full w-[440px] flex-shrink-0 flex-col bg-gray-400">
              <StudioScript script={script} /> {/* 대본 전달 */}
            </div>
          </div>
          <RecordSection duration={duration} setDuration={setDuration} />
        </div>
        <CursorPresence />
        <WebRTCManager
          studioId={studioIdString}
          /*otherInfo={{
            title,
            content,
            genreTypes,
            categoryTypes,
            castings,
          }} // 기타 정보 전달 */
        />
      </div>
    </DndProvider>
  );
}
