import { useState } from "react";

export const getRecruitment = async (recruitmentData: FormData) => {
  try {
    const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/recruitment`;

    if (!BASE_URL) {
      console.error("백엔드 Url 환경 변수에서 못 찾아옴.");
      return;
    }

    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      body: recruitmentData, // FormData 객체 전달
    });

    if (!response.ok) {
      throw new Error("Failed to create recruitment post");
    }

    const result = await response.json();
    console.log("Recruitment post created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating recruitment post:", error);
    throw error;
  }
};

// 컴포넌트 예제
const RecruitmentForm = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [castings, setCastings] = useState<string[]>([]);
  const [genreTypes, setGenreTypes] = useState<string[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<string[]>([]);
  const [script, setScript] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null); // 비디오 파일 상태 추가

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("castings", JSON.stringify(castings)); // 배열을 문자열로 변환
    formData.append("genreTypes", JSON.stringify(genreTypes));
    formData.append("categoryTypes", JSON.stringify(categoryTypes));
    formData.append("script", script);

    if (videoFile) {
      formData.append("video", videoFile); // 비디오 파일 추가
    } else {
      alert("비디오 파일을 선택해주세요.");
      return;
    }

    try {
      const result = await getRecruitment(formData);
      alert("모집글이 성공적으로 작성되었습니다!");
    } catch (error) {
      alert("모집글 작성 중 오류가 발생했습니다.");
    }
  };

  return 0;
};

export default RecruitmentForm;
