"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "./_ components/Title";
import Video from "./_ components/Video";
import Script from "./_ components/Script";
import Header from "@/app/_components/Header";
import Button from "@/app/_components/Button";
import Pencil from "@/public/images/icons/icon-pencil.svg";
import { Speaker } from "@/app/_types/script";
import { Segment } from "next/dist/server/app-render/types";
// import { Segment } from "@/app/_types/script";

export interface ParsedScriptEntry {
  label: string;
  start: number;
  text: string;
}

export default function Page() {
  const router = useRouter();
  // 폼 데이터를 관리하기 위한 상태 변수
  const [title, setTitle] = useState<string>("");
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

    // 모든 상태 출력
    console.log("title:", title);
    console.log("script:", script);
    console.log("thumbnail:", thumbnail);

    if (!videoFile) {
      alert("비디오 파일을 업로드해주세요.");
      return;
    }

    const sendScript = parsedScript.map((entry) => ({
      start: entry.start,
      text: entry.text,
      role: getSpeakerName(entry.label),
    }));
    const stringScript = JSON.stringify(sendScript);
    setScript(stringScript);
    console.log("최종 script = ", stringScript);

    // FormData 객체 생성
    const formData = new FormData();
    formData.append(
      "requestDTO",
      new Blob(
        [
          JSON.stringify({
            title,
            castings: ["짱구", "철수", "맹구"],
            script,
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
      const response = await fetch(`${backendUrl}/recruitment`, {
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

  return (
    <div className="flex h-full min-h-screen w-full flex-col">
      <Header />

      <div className="flex h-full flex-col justify-center bg-gray-400">
        {/* Video and Title */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="flex">
            {/* Left Section */}
            <div className="flex w-1/3 flex-col justify-around space-y-4 pt-10">
              <Title onChange={setTitle} />
              <Video
                onChange={setVideoFile}
                onThumbnailChange={(file) => setThumbnail(file)}
                setSpeakers={setSpeakers}
                setSegments={(newSegments) => {
                  setSegments((prevSegments) => {
                    if (!Array.isArray(newSegments)) {
                      console.error(
                        "newSegments는 배열이어야 합니다.",
                        newSegments,
                      );
                      return prevSegments; // 잘못된 값이 들어오면 이전 상태를 유지
                    }
                    const updatedSegments = [...prevSegments, ...newSegments];
                    setParsedScript(parseSegments(updatedSegments)); // 병합된 세그먼트를 파싱하여 업데이트
                    return updatedSegments;
                  });
                }}
              />
            </div>

            {/* Right Section */}
            <div className="w-2/3 space-y-4">
              <Script
                onChange={setScript}
                parsedScript={parsedScript}
                onUpdate={handleParsedScriptUpdate} // Update handler 전달
                speakers={speakers}
                setSpeakers={setSpeakers}
                segments={segments}
                // onChange={(value) => setScript(value)} // Script 문자열 업데이트
                // parsedScript={parsedScript} // 파싱된 데이터 전달
                //  onUpdate={handleParsedScriptUpdate}
              />
            </div>
          </div>

          {/* Hidden Script Field for Submission */}
          <textarea name="script" value={script} onChange={() => {}} hidden />

          {/* Submit Button */}
          <Button
            onClick={() => {
              const form = document.querySelector("form");
              if (form) {
                form.requestSubmit();
              }
            }}
            outline={false}
            large={true}
          >
            제출하기
          </Button>
        </form>
      </div>
    </div>
  );
}
