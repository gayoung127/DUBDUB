"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "./_ components/Title";
import Video from "./_ components/Video";
import Script from "./_ components/Script";
import Header from "@/app/_components/Header";
import Button from "@/app/_components/Button";
import { Speaker } from "@/app/_types/script";
import { Segment } from "next/dist/server/app-render/types";
import gsap from "gsap";
import HeroSection from "@/app/login/_components/HeroSection";
import { toast } from "sonner";
// import { Segment } from "@/app/_types/script";

export interface ParsedScriptEntry {
  label: string;
  start: number;
  text: string;
}

export default function Page() {
  const router = useRouter();
  // 폼 데이터를 관리하기 위한 상태 변수
  const [title, setTitle] = useState<string>("프로젝트 제목을 입력해주세요.");
  const [script, setScript] = useState<string>("");
  const [parsedScript, setParsedScript] = useState<ParsedScriptEntry[]>([]); // 파싱된 Script 데이터
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [speakers, setSpeakers] = useState<Speaker[]>([]); // Speaker 배열 상태
  const [segments, setSegments] = useState<Segment[]>([]); // Segment 배열 상태
  const [showScript, setShowScript] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [heroLoaded, setHeroLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (heroLoaded) {
      gsap.fromTo(
        "#modalSection",
        { opacity: 0, y: 500 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      );
    }
  }, [heroLoaded]); // ✅ heroLoaded가 true가 될 때 실행

  // Script 데이터를 파싱하는 함수 (label, start, text만 추출)
  const parseSegments = (segments: Segment[]): ParsedScriptEntry[] => {
    return segments.map((segment) => ({
      label: segment.diarization.label,
      start: segment.start,
      text: segment.text,
    }));
  };

  // ParsedScript에서 업데이트된 데이터를 처리하는 함수
  const handleParsedScriptUpdate = (
    updatedParsedScript: ParsedScriptEntry[],
  ) => {
    setParsedScript(updatedParsedScript); // 파싱된 Script 상태 업데이트
    const updatedText = updatedParsedScript
      .map((entry) => `${entry.label}: ${entry.text}`)
      .join("\n");
    setScript(updatedText); // Script 문자열 업데이트
  };

  // 화자 라벨을 이름으로 매핑하는 함수
  const getSpeakerName = (label: string): string => {
    const speaker = speakers.find((speaker) => speaker.label === label);
    return speaker ? speaker.name : "Unknown"; // 매칭되지 않으면 "Unknown" 반환
  };

  // 폼 제출 핸들러
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    if (isSubmitting) return; // 이미 제출 중이라면 함수 종료
    setIsSubmitting(true); // 제출 상태로 변경

    if (!videoFile) {
      toast.warning("비디오 파일을 업로드해주세요.");
      return;
    }

    const names: string[] = speakers.map((speaker) => speaker.name);

    const sendScript = parsedScript.map((entry) => ({
      start: entry.start,
      text: entry.text,
      role: getSpeakerName(entry.label),
    }));
    const stringScript = JSON.stringify(sendScript);
    setScript(stringScript);

    // FormData 객체 생성
    const formData = new FormData();
    formData.append(
      "requestDTO",
      new Blob(
        [
          JSON.stringify({
            title,
            castings: names,
            script: sendScript,
          }),
        ],
        { type: "application/json" },
      ),
    );

    // formData.append(
    //   "requestDTO",
    //   new Blob([JSON.stringify(recruitmentData)], { type: "application/json" }),
    // );

    // 비디오 파일 추가
    if (videoFile) {
      formData.append("video", videoFile);
    }

    // 썸네일 파일 추가
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/project`, {
        method: "POST",
        credentials: "include",
        body: formData, // Content-Type 자동 설정 (multipart/form-data)
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const result = await response.json();
      const id = result.id; // 서버 응답에서 id 추출
      alert("모집글이 성공적으로 작성되었습니다!");

      router.replace(`/lobby/${id}/studio`);
    } catch (error) {
      console.error("Error creating recruitment post:", error);
      alert("모집글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (videoFile) {
      setShowScript(true);

      setTimeout(() => {
        if (document.querySelector("#scriptContainer")) {
          gsap.fromTo(
            "#scriptContainer",
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 1.5, ease: "power3.out" },
          );
        } else {
        }
      }, 100); // ✅ 100ms 지연 후 실행 (DOM 렌더링 보장)
    }
  }, [videoFile]); // ✅ videoFile이 변경될 때 실행

  useEffect(() => {
    gsap.fromTo(
      "#modalSection",
      { opacity: 0, y: 500 }, // 초기 상태 (아래에서 시작)
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, // 자연스럽게 위로 등장
    );
  }, []);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col">
      <HeroSection setHeroLoaded={setHeroLoaded} />
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full flex-row items-center justify-center gap-x-4 bg-gray-400"
      >
        {heroLoaded && (
          <section
            id="modalSection"
            className="border-white/20 bg-white/15 shadow-[0_8px_32px_rgba(255,255,255,0.15), 0_-4px_10px_rgba(255,255,255,0.08)] text-white flex h-[500px] max-h-[500px] min-w-[600px] flex-col items-center justify-center gap-y-4 rounded-xl border-[0.6px] px-8 py-8 backdrop-blur-lg backdrop-saturate-150"
          >
            <div className="flex w-full flex-col items-center justify-center">
              {isEditing ? (
                <div className="m-0 flex w-full flex-row items-center justify-between gap-x-2 overflow-y-hidden p-0">
                  <input
                    className="m-0 h-11 w-full flex-1 p-0 text-2xl font-bold leading-snug text-white-200 focus:bg-transparent focus:outline-none focus:ring-0"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleBlur}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                </div>
              ) : (
                <div
                  className="m-0 flex h-11 w-full cursor-pointer flex-row items-center overflow-y-hidden p-0"
                  role="button"
                  onClick={handleTitleClick}
                >
                  <h5 className="text-2xl font-bold leading-snug text-white-200">
                    {title}
                  </h5>
                </div>
              )}
            </div>
            <Video
              onChange={setVideoFile}
              onThumbnailChange={setThumbnail}
              setSpeakers={setSpeakers}
              setSegments={(newSegments) => {
                setSegments((prevSegments) => {
                  if (!Array.isArray(newSegments)) return prevSegments;
                  const updatedSegments = [...prevSegments, ...newSegments];
                  setParsedScript(parseSegments(updatedSegments));
                  return updatedSegments;
                });
              }}
            />
            <Button
              outline={false}
              large={true}
              onClick={() => document.querySelector("form")?.requestSubmit()}
              className="mt-2 w-full font-bold focus:outline-none focus:ring-0"
            >
              프로젝트 시작하기
            </Button>
          </section>
        )}
        {showScript && (
          <div id="scriptContainer" className="h-[500px] max-h-[500px]">
            <Script
              onChange={setScript}
              parsedScript={parsedScript}
              onUpdate={handleParsedScriptUpdate}
              speakers={speakers}
              setSpeakers={setSpeakers}
              segments={segments}
            />
          </div>
        )}
      </form>
    </div>
  );
}
