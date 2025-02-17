"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Description from "./_ components/Description";
import Genre from "./_ components/Genre";
import Title from "./_ components/Title";
import Castings from "./_ components/Castings";
import Type from "./_ components/Type";
import Video from "./_ components/Video";
import Script from "./_ components/Script";
import Header from "@/app/_components/Header";
import Button from "@/app/_components/Button";
import { Speaker } from "@/app/_types/script";
import { Segment } from "next/dist/server/app-render/types";

export default function Page() {
  const router = useRouter();
  // 폼 데이터를 관리하기 위한 상태 변수
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [genreTypes, setGenreTypes] = useState<string[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<string[]>([]);
  const [script, setScript] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [castings, setCastings] = useState<string[]>([]); // 역할 이름만 포함된 배열
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);

  // 폼 제출 핸들러
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    if (isSubmitting) return; // 이미 제출 중이라면 함수 종료
    setIsSubmitting(true); // 제출 상태로 변경

    // 모든 상태 출력
    console.log("title:", title);
    console.log("content:", content);
    console.log("castings:", castings);
    console.log("genreTypes:", genreTypes);
    console.log("categoryTypes:", categoryTypes);
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
            content,
            castings,
            genreTypes,
            categoryTypes,
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

    //   try {
    //     const result = await getRecruitment(formData); // FormData 전송
    //     alert("모집글이 성공적으로 작성되었습니다!");
    //     router.replace("/studio");
    //   } catch (error) {
    //     console.error("Error creating recruitment post:", error);
    //     alert("모집글 작성 중 오류가 발생했습니다");
    //   }
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-start">
      <div className="flex h-auto w-full items-start justify-start">
        <Header />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full flex-row items-start justify-start"
      >
        <div className="flex h-full w-1/3 flex-col items-start justify-start">
          <Title onChange={setTitle} />
          <Castings
            onChange={(namesOnly) => {
              console.log("Updated castings (names only):", namesOnly); // 디버깅 추가
              setCastings(namesOnly); // 이름만 업데이트
            }}
          />
          <Type onChange={setCategoryTypes} />
          <Genre onChange={setGenreTypes} />
        </div>

        <div className="flex h-full w-1/3 flex-col items-center justify-start">
          <div className="mb-10 flex h-auto w-full items-center justify-center">
            <Video
              onChange={setVideoFile}
              onThumbnailChange={(generatedThumbnail) => {
                setThumbnail(generatedThumbnail);
              }}
              setSpeakers={setSpeakers}
              setSegments={setSegments}
            />
          </div>
          <div className="flex h-auto w-full items-center justify-center">
            <Description onChange={setContent} />
          </div>
        </div>

        <div className="flex h-full w-1/3 items-start justify-end">
          <Script
            onChange={setScript}
            speakers={speakers}
            segments={segments}
          />
        </div>
        {/* STT 결과 렌더링 */}
        {transcription && (
          <div className="mt-4 w-full rounded-lg bg-gray-100 p-4">
            <h3 className="text-lg font-semibold">STT 변환 결과:</h3>
            <p className="text-gray-700">{transcription}</p>
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <Button
            outline={false}
            large={true}
            disabled={isSubmitting}
            onClick={() => {
              const form = document.querySelector("form");
              if (form) {
                form.requestSubmit();
              }
            }}
          >
            {isSubmitting ? "제출중" : "생성하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}
