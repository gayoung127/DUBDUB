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
import { useFormStore } from "@/app/_store/FormStore";
import { getMyInfo } from "@/app/_apis/user";
import { useParams } from "next/navigation";
import { createConnection, createSession } from "@/app/_apis/openvidu";
import { initialTracks, Track } from "@/app/_types/studio";

export default function StudioPage() {
  const { id } = useParams();
  const studioId = Number(id);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [userAudioStreams, setUserAudioStreams] = useState<
    Record<number, MediaStream>
  >({});
  const [sessionId, setSessionId] = useState<string>("test-session-123");
  const [sessionToken, setSessionToken] = useState<string>("");
  const [duration, setDuration] = useState<number>(160);
  const stompClientRef = useStompClient(); // STOMP 클라이언트 관리
  const videoRef = useRef<HTMLVideoElement>(null);
  const { memberId, email, position, profileUrl, nickName, self } =
    useUserStore();
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const { setRecruitmentData } = useFormStore();

  if (!studioId) {
    throw new Error("studioId 없음");
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!stompClientRef.current?.connected) return;

    const id = self?.memberId || "익명의 더비";
    const x = e.clientX;
    const y = e.clientY;
    const name = self?.nickName || "익명의 더비";

    stompClientRef.current.publish({
      destination: `/app/studio/${sessionId}/cursor`,
      body: JSON.stringify({ id, x, y, name }),
    });
  };

  // 유저 정보 가져오기
  useEffect(() => {
    getMyInfo();
  }, []);

  // 비디오 URL 설정
  useEffect(() => {
    if (!studioId) return;

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // `BASE_URL`을 여기에 선언
    if (!BASE_URL) return;

    setVideoUrl("/examples/zzangu.mp4");
  }, [studioId]);

  // 스튜디오 정보 가져오기
  useEffect(() => {
    const getStudioInfo = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!BASE_URL) return;

        const response = await fetch(`${BASE_URL}/project/${studioId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        if (!data) {
          console.log("data 없음");
          return;
        }

        console.log("📥 받은 스튜디오 데이터:", data);
        const sessionId =
          typeof data.session === "string" ? data.session.trim() : "";
        const sessionToken =
          typeof data.token === "string" ? data.token.trim() : "";

        if (!sessionId) {
          console.log("❌ 세션 아이디 없음");
          return;
        }

        if (!sessionToken) {
          console.log("❌ 세션 토큰 없음");
          return;
        }

        setSessionId(sessionId);
        setSessionToken(sessionToken);
      } catch (error) {
        console.error("❌ 스튜디오 정보 가져오기 실패:", error);
      }
    };

    getStudioInfo();
  }, [studioId]);

  // 방 생성 정보 가져오기
  useEffect(() => {
    const getCreateInfo = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!BASE_URL) return;

        const response = await fetch(`${BASE_URL}/recruitment`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();
        console.log("📥 불러온 모집글 데이터:", data);

        // 모집글 데이터를 Zustand 상태에 저장
        setRecruitmentData({
          title: data.title,
          content: data.content,
          genreTypes: data.genreTypes || [],
          categoryTypes: data.categoryTypes || [],
          castings: data.castings || [],
          script: data.script || "",
          // videoFile:
          //   data.videoFile && typeof data.videoFile === "string"
          //     ? new File([], data.videoFile) // 서버에서 반환된 파일 경로를 File 객체로 변환
          //     : null, // videoFile이 없으면 null로 설정
        });
        // 비디오 URL 설정
        if (data.videoFilePath && typeof data.videoFilePath === "string") {
          setVideoUrl(data.videoFilePath); // 서버에서 반환된 비디오 파일 경로를 URL로 설정
        }
      } catch (error) {
        console.error("❌ 스튜디오 정보 가져오기 실패:", error);
      }
    };
    getCreateInfo();
  }, [studioId, setRecruitmentData]);

  // OpenVidu 테스트 (비동기)
  useEffect(() => {
    const testOv = async () => {
      const sessionId = await createSession();
      console.log("✅ 세션 생성 응답:", sessionId);
      if (!sessionId) {
        console.error("❌ 세션 ID를 가져오지 못했습니다.");
        return;
      }
      const token = await createConnection(sessionId);
      if (!token) {
        console.error("❌ 세션 토큰을 가져오지 못했습니다.");
        return;
      }
      setSessionId(sessionId);
      setSessionToken(token);
    };

    // testOv(); // 필요할 때 활성화
  }, []);

  // 사용자 오디오 스트림 업데이트
  const handleUserAudioUpdate = (userId: number, stream: MediaStream) => {
    setUserAudioStreams((prev) => ({ ...prev, [userId]: stream }));
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
                <StudioSideTab
                  userAudioStreams={userAudioStreams}
                  tracks={tracks}
                  setTracks={setTracks}
                />
                <VideoPlayer
                  videoRef={videoRef}
                  videoUrl={videoUrl}
                  duration={duration}
                  setDuration={setDuration}
                  tracks={tracks}
                  setTracks={setTracks}
                />
              </div>
            </div>
            <div className="flex h-full w-[440px] flex-shrink-0 flex-col bg-gray-400">
              <StudioScript />
            </div>
          </div>
          <RecordSection
            duration={duration}
            setDuration={setDuration}
            tracks={tracks}
            setTracks={setTracks}
          />
        </div>
        <CursorPresence stompClientRef={stompClientRef} sessionId={sessionId} />
        <WebRTCManager
          studioId={studioId}
          sessionId={sessionId}
          sessionToken={sessionToken}
          onUserAudioUpdate={handleUserAudioUpdate}
          userId={memberId!}
        />
      </div>
    </DndProvider>
  );
}
