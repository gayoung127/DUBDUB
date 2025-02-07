import H2 from "@/app/_components/H2";
import React from "react";

interface TitleProps {
  onChange: (value: string) => void; // 부모에서 전달받은 콜백 함수
}

const Title = ({ onChange }: TitleProps) => {
  return (
    <section>
      <div className="p-4">
        <H2 className="mb-2">TITLE</H2>
        <textarea
          placeholder="제목을 입력하세요."
          className="max-h-[60px] min-h-[60px] w-full resize-none rounded-lg bg-gray-50 p-4 text-center text-lg placeholder:text-xl placeholder:font-semibold placeholder:text-gray-100 focus:outline-none"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </section>
  );
};

export default Title;
