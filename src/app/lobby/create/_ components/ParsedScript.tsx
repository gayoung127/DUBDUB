import React from "react";

interface ParsedScriptEntry {
  label: string;
  start: number;
  text: string;
}

interface ParsedScriptProps {
  parsedScript: ParsedScriptEntry[];
}

const ParsedScript = ({ parsedScript }: ParsedScriptProps) => {
  return (
    <div className="w-full p-4">
      <h2 className="text-lg font-semibold">Parsed Script</h2>
      {parsedScript.length === 0 ? (
        <p>대본이 비어있습니다.</p>
      ) : (
        <ul className="space-y-4">
          {parsedScript.map((entry, index) => (
            <li key={index} className="rounded bg-gray-100 p-4">
              <p>
                <strong>시작 시간:</strong> {entry.start}
              </p>
              <p>
                <strong>화자:</strong> {entry.label}
              </p>
              <p>
                <strong>대사:</strong> {entry.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParsedScript;
