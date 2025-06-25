import React, { useState, useEffect, useRef } from "react";
import ScriptRoleLabel from "./ScriptRoleLabel";
import { Speaker } from "@/app/_types/script";
import TrashBin from "@/public/images/icons/icon-trashbin-white.svg";
interface ParsedScriptEntry {
  label: string;
  start: number;
  text: string;
}

interface ParsedScriptProps {
  parsedScript: ParsedScriptEntry[];
  onUpdate: (updatedScript: ParsedScriptEntry[]) => void; // 부모 컴포넌트에 업데이트된 데이터 전달
  speakers: Speaker[];
}

const ParsedScript = ({
  parsedScript,
  onUpdate,
  speakers,
}: ParsedScriptProps) => {
  const [editableScript, setEditableScript] =
    useState<ParsedScriptEntry[]>(parsedScript); // 로컬 상태
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // 🔹 커서가 올라간 위치 저장

  // props(parsedScript)가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setEditableScript(parsedScript);
  }, [parsedScript]);

  // 🔹 새로운 스크립트 추가
  const handleAddScript = (index: number) => {
    const newScript: ParsedScriptEntry = {
      label: "1", // 새로운 역할을 기본 숫자로 설정
      start: 0,
      text: "",
    };
    const updatedScript = [...editableScript];
    updatedScript.splice(index + 1, 0, newScript);
    setEditableScript(updatedScript);
    onUpdate(updatedScript);
  };

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
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* 스크립트 */}
              <ScriptTextArea
                script={script}
                index={index}
                onUpdate={onUpdate}
                editableScript={editableScript}
                speakers={speakers}
                handleTextChange={handleTextChange}
              />
              {hoveredIndex === index && (
                <button
                  type="button"
                  className="text-white shadow absolute -bottom-5 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full bg-gray-500 opacity-50 transition-opacity duration-200 hover:bg-gray-600 hover:opacity-100"
                  onClick={() => handleAddScript(index)}
                >
                  +
                </button>
              )}
            </div>
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
  editableScript,
  onUpdate,
}: {
  script: ParsedScriptEntry;
  index: number;
  speakers: Speaker[];
  handleTextChange: (index: number, value: string) => void;
  editableScript: ParsedScriptEntry[];
  onUpdate: (updatedScript: ParsedScriptEntry[]) => void;
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
    <div className="flex w-full flex-col items-start justify-start gap-y-1 rounded-md bg-gray-300 px-2 py-2">
      <ScriptRoleLabel
        label={script.label}
        speakers={speakers}
        start={script.start}
        onChange={(newLabel) => {
          const updatedScript = [...editableScript];
          updatedScript[index] = { ...updatedScript[index], label: newLabel };
          onUpdate(updatedScript);
        }}
        onTimeChange={(newTime) => {
          const updatedScript = [...editableScript];
          updatedScript[index] = { ...updatedScript[index], start: newTime };
          onUpdate(updatedScript);
        }}
      />

      <div className="flex w-full">
        <textarea
          ref={textareaRef}
          value={script.text}
          onChange={(e) => handleTextChange(index, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); //
            }
          }}
          onBlur={(e) => {
            e.preventDefault(); //
          }}
          rows={1}
          spellCheck={false}
          className={`scrollbar-horizontal-thin w-full flex-grow resize-none overflow-auto whitespace-nowrap rounded border-none bg-transparent p-2 text-lg leading-snug text-white-100 focus:outline-none focus:ring-0 ${hasScroll ? "pb-4" : ""}`} // 🔹 스크롤 있을 때만 pb-4 추가
        ></textarea>
        <div
          onClick={() => {
            const updatedScript = editableScript.filter((_, i) => i !== index);
            onUpdate(updatedScript);
          }}
          className="shadow ml-5 h-full w-[42px] flex-shrink-0 rounded-[4px] text-white-100 opacity-0 hover:opacity-75"
        >
          <TrashBin />
        </div>
      </div>
    </div>
  );
};
