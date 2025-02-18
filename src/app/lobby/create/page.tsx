"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Description from "./_ components/Description";
import Genre from "./_ components/Genre";
import Castings from "./_ components/Castings";
import Type from "./_ components/Type";
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
  const [content, setContent] = useState<string>("");
  const [genreTypes, setGenreTypes] = useState<string[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<string[]>([]);
  const [castings, setCastings] = useState<string[]>([]); // 역할 이름만 포함된 배열
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

    // FormData 객체 생성
    const formData = new FormData();
    formData.append(
      "requestDTO",
      new Blob(
        [
          JSON.stringify({
            title,
            script,
            content,
            castings,
            genreTypes,
            categoryTypes,
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

      {/* Video and Title */}
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="flex">
          {/* Left Section */}
          <div className="w-1/3 space-y-4">
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
            <Title onChange={setTitle} />
          </div>

          {/* Right Section */}
          <div className="w-2/3 space-y-4">
            <Script
              onChange={(value) => setScript(value)} // Script 문자열 업데이트
              speakers={speakers}
              segments={segments}
              parsedScript={parsedScript} // 파싱된 데이터 전달
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
  );
}

// {/* STT 결과 렌더링 */}
// {transcription && (
//   <div className="mt-4 w-full rounded-lg bg-gray-100 p-4">
//     <h3 className="text-lg font-semibold">STT 변환 결과:</h3>
//     <p className="text-gray-700">{transcription}</p>
//   </div>
// ))}

// <Button
//   outline={false}
//   large={true}
//   disabled={isSubmitting}
//   onClick={() => {
//     const form = document.querySelector("form");
//     if (form) {
//       form.requestSubmit();
//     }
//   }}
// >
//   {isSubmitting ? "제출중" : "생성하기"}
// </Button>
