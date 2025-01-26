import { useState } from "react";
import Script from "./Script";
import { ScriptData } from "../type";

interface ScriptsProps {
  scripts: ScriptData[];
}

const ScriptSection = ({ scripts }: ScriptsProps) => {
  return (
    <section className="flex flex-col gap-2 p-1">
      <h1 className="pl-1 text-2xl font-bold tracking-[1px]">SCRIPT</h1>
      <div className="white-scrollbar flex h-[482px] w-[440px] flex-col gap-3 overflow-y-auto overflow-x-hidden">
        {scripts.map((script, id) => (
          <Script key={script.role + id} script={script} />
        )) : (
          <div className="flex w-[420px] flex-row gap-3 rounded-[4px] bg-white-300 px-4 py-2 text-sm">
            <p className="text-center text-bold">대본이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScriptSection;
