import React, { useEffect } from "react";
import H2 from "@/app/_components/H2";
import { Segment, Speaker } from "@/app/_types/script";
import ParsedScript from "./ParsedScript";
import { ParsedScriptEntry } from "../page";
import ScriptRoleCard from "./ScriptRoleCard";

interface ScriptProps {
  onChange: (value: string) => void;
  speakers: Speaker[];
  setSpeakers: (updatedSpeakers: Speaker[]) => void;
  segments: Segment[];
  parsedScript: ParsedScriptEntry[];
}

const Script = ({
  onChange,
  speakers,
  setSpeakers,
  segments,
  parsedScript,
}: ScriptProps) => {
  // 화자 라벨을 이름으로 매핑하는 함수
  const getSpeakerName = (label: string): string => {
    const speaker = speakers.find((speaker) => speaker.label === label);
    return speaker ? speaker.name : "Unknown"; // 매칭되지 않으면 "Unknown" 반환
  };

  // segments 데이터를 기반으로 script 문자열 생성
  const generateScript = (): string => {
    return segments
      .map((segment) => {
        const speakerName = getSpeakerName(segment.diarization.label); // 화자 이름 가져오기
        return `${speakerName}: ${segment.text}`; // "화자: 대사" 형식으로 반환
      })
      .join("\n"); // 각 줄을 줄바꿈으로 연결
  };

  // script 문자열 생성 및 부모 컴포넌트로 전달
  const scriptString = generateScript();
  onChange(scriptString); // 부모 컴포넌트에 script 문자열 전달

  return (
    <section className="mx-auto w-full max-w-2xl p-4">
      <div className="space-y-12">
        <div className="w-full">
          <H2>ROLES</H2>
          <div className="flex gap-3">
            {speakers &&
              speakers.map((speaker, index) => (
                <ScriptRoleCard
                  key={index}
                  speakers={speakers}
                  setSpeakers={setSpeakers}
                  label={speaker.label}
                />
              ))}
          </div>
          {segments.length === 0 && <div>대본을 입력해주세요.</div>}
          <H2 className="mb-4">SCRIPT</H2>
          <ScriptRoleCard speakers={speakers} label={"2"} />
          <ParsedScript parsedScript={parsedScript} />
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
