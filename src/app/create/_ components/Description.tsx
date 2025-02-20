import React from "react";
import { useState } from "react";
import H2 from "@/app/_components/H2";

interface DescriptionProps {
  onChange: (value: string) => void;
}

const Description = ({ onChange }: DescriptionProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value); // 부모 컴포넌트로 입력값 전달
  };
  return (
    <div className="w-full max-w-2xl p-4">
      <H2 className="mb-4">DESCRIPTION</H2>
      <textarea
        className="min-h-[310px] w-full resize-none rounded-lg bg-gray-50 p-4 focus:outline-none"
        placeholder="간단한 설명을 입력해주세요.
(비방, 욕설X)"
        onChange={handleInputChange} // 입력 이벤트 핸들러 연결
      />
    </div>
  );
};

export default Description;
