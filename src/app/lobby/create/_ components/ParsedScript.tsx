import React, { useState, useEffect } from "react";

interface ParsedScriptEntry {
  label: string;
  start: number;
  text: string;
}

interface ParsedScriptProps {
  parsedScript: ParsedScriptEntry[];
  onUpdate: (updatedScript: ParsedScriptEntry[]) => void; //부모 컴포넌트에 업데이트된 데이터 전달
}

const ParsedScript = ({ parsedScript, onUpdate }: ParsedScriptProps) => {
  const [editableScript, setEditableScript] =
    useState<ParsedScriptEntry[]>(parsedScript); //로컬 상태

  // props(parsedScript)가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setEditableScript(parsedScript);
  }, [parsedScript]);

  // 입력값 변경 핸들러 (text 필드만 업데이트)
  const handleTextChange = (index: number, value: string) => {
    const updatedScript = [...editableScript];
    updatedScript[index] = { ...updatedScript[index], text: value }; // text 필드만 업데이트
    setEditableScript(updatedScript); // 로컬 상태 업데이트
    onUpdate(updatedScript); // 부모 컴포넌트로 업데이트된 데이터 전달
  };
  return (
    <div className="w-full p-4">
      {editableScript.length === 0 ? (
        <p>대본이 비어있습니다.</p>
      ) : (
        <ul className="space-y-4">
          {editableScript.map((entry, index) => (
            <li key={index} className="rounded bg-gray-100 p-4">
              <div>
                <label>
                  <strong>시작 시간:</strong>
                  {entry.start}
                </label>
              </div>
              <div>
                <label>
                  <strong>화자:</strong> {entry.label}
                </label>
              </div>
              <div>
                <label>
                  <strong>대사:</strong>
                  <textarea
                    value={entry.text}
                    onChange={(e) => handleTextChange(index, e.target.value)}
                    className="mt-2 w-full rounded border p-2"
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParsedScript;
