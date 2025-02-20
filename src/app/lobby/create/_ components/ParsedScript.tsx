import React, { useState, useEffect, useRef } from "react";
import ScriptRoleLabel from "./ScriptRoleLabel";
import { Speaker } from "@/app/_types/script";

interface ParsedScriptEntry {
  label: string;
  start: number;
  text: string;
}

interface ParsedScriptProps {
  parsedScript: ParsedScriptEntry[];
  onUpdate: (updatedScript: ParsedScriptEntry[]) => void; //부모 컴포넌트에 업데이트된 데이터 전달
  speakers: Speaker[];
}

const ParsedScript = ({
  parsedScript,
  onUpdate,
  speakers,
}: ParsedScriptProps) => {
  const [editableScript, setEditableScript] =
    useState<ParsedScriptEntry[]>(parsedScript); // 로컬 상태

  // props(parsedScript)가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setEditableScript(parsedScript);
  }, [parsedScript]);

  const handleTextChange = (index: number, value: string) => {
    const updatedScript = [...editableScript];
    updatedScript[index] = { ...updatedScript[index], text: value };
    setEditableScript(updatedScript);
    onUpdate(updatedScript);
  };

  return (
    <div className="w-full pr-3">
      {editableScript.length === 0 ? (
        <p>대본이 비어있습니다.</p>
      ) : (
        <div className="flex flex-col gap-y-2">
          {editableScript.map((script, index) => (
            <ScriptTextArea
              key={index}
              script={script}
              index={index}
              speakers={speakers}
              handleTextChange={handleTextChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParsedScript;

// 🔹 `textarea` 내부 스크롤 여부 감지하는 컴포넌트
const ScriptTextArea = ({
  script,
  index,
  speakers,
  handleTextChange,
}: {
  script: ParsedScriptEntry;
  index: number;
  speakers: Speaker[];
  handleTextChange: (index: number, value: string) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (textareaRef.current) {
        setHasScroll(
          textareaRef.current.scrollHeight > textareaRef.current.clientHeight,
        );
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [script.text]);

  return (
    <div
      className={`flex flex-col items-start justify-start gap-y-1 rounded-md bg-gray-300 px-2 py-2`}
    >
      <ScriptRoleLabel
        label={script.label}
        speakers={speakers}
        start={script.start}
      />
      <textarea
        ref={textareaRef}
        value={script.text}
        onChange={(e) => handleTextChange(index, e.target.value)}
        rows={1}
        className={`scrollbar-horizontal-thin w-full resize-none overflow-auto whitespace-nowrap rounded border-none bg-transparent p-2 text-lg leading-snug text-white-100 focus:outline-none focus:ring-0 ${hasScroll ? "pb-4" : ""}`} // 🔹 스크롤 있을 때만 pb-4 추가
      ></textarea>
    </div>
  );
};
