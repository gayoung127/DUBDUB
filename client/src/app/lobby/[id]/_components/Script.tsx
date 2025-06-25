import { ScriptData } from "../type";

interface ScriptProps {
  script: ScriptData;
}

const Script = ({ script }: ScriptProps) => {
  return (
    <div className="flex w-[420px] flex-row gap-3 rounded-[4px] bg-white-300 px-4 py-2 text-sm">
      <p className="w-[40px] flex-shrink-0 text-justify">{script.role}</p>
      <p className="whitespace-pre-wrap">{script.script}</p>
    </div>
  );
};

export default Script;
