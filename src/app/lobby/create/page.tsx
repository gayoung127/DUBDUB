"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Description from "./_ components/Description";
import Genre from "./_ components/Genre";
import Title from "./_ components/Title";
import Type from "./_ components/Type";
import Video from "./_ components/Video";
import Script from "./_ components/Script";
import Header from "@/app/_components/Header";
import Button from "@/app/_components/Button"; // Button 컴포넌트
import { getRecruitment } from "@/app/_apis/recruitment";

export default function Page() {
  const router = useRouter();
  // 폼 데이터를 관리하기 위한 상태 변수
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [genreTypes, setGenreTypes] = useState<string[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<string[]>([]);
  const [script, setScript] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null); // 비디오 파일 상태 추가

  // 폼 제출 핸들러
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    if (!videoFile) {
      alert("비디오 파일을 업로드해주세요.");
      return;
    }

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("genreTypes", JSON.stringify(genreTypes));
    formData.append("categoryTypes", JSON.stringify(categoryTypes));
    formData.append("script", script);
    formData.append("video", videoFile);

    try {
      const result = await getRecruitment(formData); // FormData 전송
      alert("모집글이 성공적으로 작성되었습니다!");
      router.replace("/studio");
    } catch (error) {
      console.error("Error creating recruitment post:", error);
      alert("모집글 작성 중 오류가 발생했습니다.");
    }
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
          <Type onChange={setCategoryTypes} />
          <Genre onChange={setGenreTypes} />
        </div>

        <div className="flex h-full w-1/3 flex-col items-center justify-start">
          <div className="mb-10 flex h-auto w-full items-center justify-center">
            <Video onChange={setVideoFile} />
          </div>
          <div className="flex h-auto w-full items-center justify-center">
            <Description onChange={setContent} />
          </div>
        </div>

        <div className="flex h-full w-1/3 items-start justify-end">
          <Script onChange={setScript} />
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            outline={false}
            large={true}
            onClick={() => {
              const form = document.querySelector("form");
              if (form) {
                form.requestSubmit();
              }
            }}
          >
            생성하기
          </Button>
        </div>
      </form>
    </div>
  );
}
