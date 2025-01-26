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
        {scripts.map((script) => (
          <Script script={script} />
        ))}
      </div>
    </section>
  );
};

export default ScriptSection;
