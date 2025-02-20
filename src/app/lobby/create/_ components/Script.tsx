import React, { useState, useEffect } from "react";
import H2 from "@/app/_components/H2";
import { Segment, Speaker } from "@/app/_types/script";
import ParsedScript from "./ParsedScript";
import { ParsedScriptEntry } from "../page";
import ScriptRoleCard from "./ScriptRoleCard";
import C1 from "@/app/_components/C1";

interface ScriptProps {
  onChange: (value: string) => void;
  speakers: Speaker[];
  setSpeakers: (updatedSpeakers: Speaker[]) => void;
  segments: Segment[];
  parsedScript: ParsedScriptEntry[];
  onUpdate: (updatedParsedScript: ParsedScriptEntry[]) => void;
}

const Script = ({
  onChange,
  speakers,
  setSpeakers,
  segments,
  parsedScript,
  onUpdate,
}: ScriptProps) => {
  const [localParsedScript, setLocalParsedScript] =
    useState<ParsedScriptEntry[]>(parsedScript); //로컬 상태

  // 🔹 타자 애니메이션 상태
  const [typingText, setTypingText] = useState<string>("");
  const fullText = "대 본을 추출 중입니다... 조금만 기다려주세요.";

  useEffect(() => {
    if (segments.length === 0) {
      setTypingText(""); // 초기화
      let index = 0;
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setTypingText((prev) => prev + fullText.charAt(index)); // 🔹 charAt 사용하여 undefined 방지
          index++;
        } else {
          clearInterval(interval);
        }
      }, 100); // 🔹 100ms 간격으로 한 글자씩 추가

      return () => clearInterval(interval);
    }
  }, [segments]);

  return (
    <section className="flex h-full w-[720px] flex-col justify-center gap-y-4">
      <div className="flex w-full flex-row items-center justify-start gap-x-4 px-3">
        {segments.length !== 0 && (
          <h4 className="mr-3 text-[22px] font-bold text-white-200">역할:</h4>
        )}
        {speakers &&
          speakers.map((speaker, index) => (
            <ScriptRoleCard
              key={index}
              label={speaker.label}
              speakers={speakers}
              setSpeakers={setSpeakers}
            />
          ))}
      </div>
      {segments.length === 0 ? (
        <div className="flex h-full w-full flex-row items-center justify-center text-2xl font-semibold text-white-200">
          {typingText}
        </div>
      ) : (
        <section
          id="modalSection"
          className="border-white/20 bg-white/15 shadow-[0_8px_32px_rgba(255,255,255,0.15), 0_-4px_10px_rgba(255,255,255,0.08)] text-white flex h-[446px] min-w-[600px] flex-col items-center justify-center gap-y-4 rounded-xl border-[0.6px] px-3 py-1.5 backdrop-blur-lg backdrop-saturate-150"
        >
          <div className="scrollbar max-h-[420px] w-full overflow-y-auto">
            <ParsedScript
              parsedScript={parsedScript}
              onUpdate={onUpdate}
              speakers={speakers}
            />
          </div>
        </section>
      )}
    </section>
  );
};

export default Script;
