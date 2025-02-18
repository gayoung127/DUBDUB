import React, { useState, useEffect } from "react";
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

  return (
    <section className="mx-auto h-[90%] w-[90%] p-4">
      <H2 className="mb-4 px-6 text-white-100">SCRIPT</H2>
      <div className="flex flex-col gap-5">
        <div className="flex gap-5 px-8">
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
        <div className="flex min-h-[320px] w-full flex-col items-center justify-center space-y-12 rounded-lg bg-gray-100 p-6 focus:outline-none">
          <div className="white-scrollbar max-h-[500px] w-full overflow-y-auto">
            {segments.length === 0 && <div>대본을 입력해주세요.</div>}
            <ParsedScript
              parsedScript={parsedScript}
              onUpdate={onUpdate}
              speakers={speakers}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Script;
