import React from "react";
import H2 from "@/app/_components/H2";
import { Segment, Speaker } from "@/app/_types/script";

interface ScriptProps {
  onChange: (value: string) => void;
  speakers: Speaker[];
  segments: Segment[];
}

const Script = ({ onChange, speakers, segments }: ScriptProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };
  return (
    <section className="mx-auto w-full max-w-2xl p-4">
      <H2 className="mb-4">SCRIPT</H2>
      <div className="space-y-12">
        <div className="w-full">
          {segments.length === 0 && <div>대본이 비어있습니다.</div>}
          {/* <textarea
            className="min-h-[320px] w-full resize-none rounded-lg bg-gray-50 p-4 focus:outline-none"
            placeholder={` : 형태로 대사를 입력해주세요.
              예시)
              짱구 : 안녕하세요.`}
            onChange={handleInputChange}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default Script;
