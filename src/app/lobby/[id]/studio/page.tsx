"use client";

import { DndProvider } from "react-dnd";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useUserStore } from "@/app/_store/UserStore";
import { useStompStore } from "@/app/_store/StompStore";
import { useSessionIdStore } from "@/app/_store/SessionIdStore";

import { Role, Script, Segment, Speaker } from "@/app/_types/script";

import { getMyInfo } from "@/app/_apis/user";
import useStompClient from "@/app/_hooks/useStompClient";
import { useTrackSocket } from "@/app/_hooks/useTrackSocket";
import { useStudioMembers } from "@/app/_hooks/useStudioMembers";
import { useAssetsSocket } from "@/app/_hooks/useAssetSocket";

import Header from "@/app/_components/Header";
import CursorPresence from "./_components/CursorPresence";
import RecordSection from "./_components/RecordSection";
import StudioScript from "./_components/StudioScript";
import StudioSideTab from "./_components/StudioSideTab";
import VideoPlayer from "./_components/VideoPlayer";
import { SelectingBlock } from "@/app/_types/studio";

export default function StudioPage() {
  const { id } = useParams();
  const studioId = Number(id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [studioTitle, setStudioTitle] = useState<string>("제목 없음");
  const [videoUrl, setVideoUrl] = useState<string>("/examples/zzangu.mp4");

  const [duration, setDuration] = useState<number>(160);
  const [sessionToken, setSessionToken] = useState<string>("");

  const [parsedScripts, setParsedScripts] = useState<Script[]>([]);
  const [roles, setRoles] = useState<string[]>(["", "", "", ""]);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isProcessedAudio, setIsProcessedAudio] = useState<boolean>(false);

  const { sessionId, setSessionId } = useSessionIdStore();
  const { memberId, self } = useUserStore();
  const { studioMembers } = useStudioMembers();
  const { tracks, setTracks } = useTrackSocket({ sessionId });
  const { assets, setAssets, sendAsset } = useAssetsSocket({ sessionId });

  const [selectingBlocks, setSelectingBlocks] = useState<SelectingBlock[]>([
    { memberId: 1, selecting: false, selectedAudioBlockId: null },
    { memberId: 2, selecting: false, selectedAudioBlockId: null },
    { memberId: 3, selecting: false, selectedAudioBlockId: null },
    { memberId: 4, selecting: false, selectedAudioBlockId: null },
  ]);

  useEffect(() => {
    console.log("각 사용자 선택한 블럭 : ", selectingBlocks);
  }, [selectingBlocks]);

  useStompClient(sessionId);
  const { stompClientRef, isConnected } = useStompStore();

  // studioId 확인
  if (!studioId) {
    throw new Error("studioId 없음");
  }

  // handlePointerMove(): 커서 움직이는 함수
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isConnected) return;

    const memberId = self?.memberId || "anonymous";
    const x = e.clientX;
    const y = e.clientY;
    const name = self?.nickName || "익명의 더비";

    if (sessionId !== "") {
      stompClientRef?.publish({
        destination: `/app/studio/${sessionId}/cursor`,
        body: JSON.stringify({ memberId, x, y, name }),
      });
    }
  };

  // useEffect(): 유저 정보 가져오기 (HTTP API Request)
  useEffect(() => {
    getMyInfo();
  }, []);

  // // parseScript(): 스크립트 파싱 함수
  // const parseScript = (script: string): { role: string; text: string }[] => {
  //   return script
  //     .split("\n")
  //     .map((line) => {
  //       const [role, ...textParts] = line.split(":");
  //       return {
  //         role: role?.trim() || "",
  //         text: textParts.join(":").trim() || "",
  //       };
  //     })
  //     .filter((item) => item.role && item.text);
  // };

  // useEffect(): 스튜디오 정보 가져오기
  useEffect(() => {
    const getStudioInfo = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!BASE_URL) return;

        const response = await fetch(
          `${BASE_URL}/project/${studioId}/enter-studio`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        const data = await response.json();
        if (!data) return;

        console.log("📥 받은 스튜디오 데이터:", data);

        if (data.videoUrl) {
          setVideoUrl(data.videoUrl);
        }

        if (data.title) {
          setStudioTitle(data.title);
        }

        if (data.script) {
          // const jsonData = JSON.parse(data.script);
          // setParsedScripts(jsonData);
          setParsedScripts(data.script);
        }

        if (data.roleList) {
          setRoles(data.roleList);
        }

        if (data.session && data.token) {
          setSessionId(data.session.trim());
          setSessionToken(data.token.trim());
        }

        if (data.snapshot) {
          console.log(
            "워크스페이스 트랙 및 에셋 정보 : ",
            JSON.parse(data.snapshot.tracks),
            ", ",
            JSON.parse(data.snapshot.assets),
          );
          setTracks(JSON.parse(data.snapshot.tracks));
          setAssets(JSON.parse(data.snapshot.assets));
        }
      } catch (error) {
        console.error("❌ 스튜디오 정보 가져오기 실패:", error);
      }
    };

    getStudioInfo();
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
        className="overflow-hidden"
      >
        <div className="relative flex h-full min-h-screen w-full flex-col items-start justify-start">
          <div className="flex h-full w-full flex-row">
            <div className="flex h-full w-full flex-1 flex-col items-start justify-start">
              <Header studioTitle={studioTitle} />
              <div className="flex h-full w-full flex-1 flex-row items-center justify-start">
                <StudioSideTab
                  tracks={tracks}
                  setTracks={setTracks}
                  studioMembers={studioMembers}
                  assets={assets}
                  setAssets={setAssets}
                  sendAsset={sendAsset}
                  sessionToken={sessionToken}
                />
                <VideoPlayer
                  videoRef={videoRef}
                  videoUrl={videoUrl}
                  duration={duration}
                  setDuration={setDuration}
                  tracks={tracks}
                  setTracks={setTracks}
                  assets={assets}
                  isVideoMuted={isVideoMuted}
                  isProcessedAudio={isProcessedAudio}
                  stompClientRef={stompClientRef}
                  isConnected={isConnected}
                />
              </div>
            </div>
            <div className="flex h-full w-[440px] flex-shrink-0 flex-col bg-gray-400">
              <StudioScript scripts={parsedScripts} />
            </div>
          </div>

          <RecordSection
            videoUrl={videoUrl}
            duration={duration}
            setDuration={setDuration}
            roles={roles}
            tracks={tracks}
            setTracks={setTracks}
            assets={assets}
            setAssets={setAssets}
            sendAsset={sendAsset}
            isVideoMuted={isVideoMuted}
            setIsVideoMuted={setIsVideoMuted}
            isProcessedAudio={isProcessedAudio}
            setIsProcessedAudio={setIsProcessedAudio}
            selectingBlocks={selectingBlocks}
            setSelectingBlocks={setSelectingBlocks}
          />
        </div>
        {isConnected && (
          <CursorPresence
            sessionId={sessionId}
            isConnected={isConnected}
            stompClientRef={stompClientRef}
            setSelectingBlocks={setSelectingBlocks}
          />
        )}
      </div>
    </DndProvider>
  );
}
