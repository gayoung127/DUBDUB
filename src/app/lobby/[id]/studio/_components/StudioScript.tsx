import { useEffect, useRef, useState } from "react";
import { useTimeStore } from "@/app/_store/TimeStore";
import H4 from "@/app/_components/H4";
import C1 from "@/app/_components/C1";
import ScriptCard from "./ScriptCard";
import { Role, Script, Segment, Speaker } from "@/app/_types/script";

interface StudioScriptProps {
  scripts: Script[];
  roles: Role[];
}

const StudioScript = ({ scripts, roles }: StudioScriptProps) => {
  const { time } = useTimeStore(); //  현재 시간값
  const scrollContainerRef = useRef<HTMLDivElement>(null); // 스크롤 컨테이너 ref
  const [activeScriptIndex, setActiveScriptIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const currentIndex = scripts.findIndex(
      (script, index) =>
        time >= script.start &&
        (index === scripts.length - 1 || time < scripts[index + 1].start),
    );

    if (currentIndex !== -1 && currentIndex !== activeScriptIndex) {
      setActiveScriptIndex(currentIndex);

      if (scrollContainerRef.current) {
        const activeElement = scrollContainerRef.current.children[
          currentIndex
        ] as HTMLElement;
        if (activeElement && scrollContainerRef.current) {
          const newScrollTop =
            activeElement.offsetTop - scrollContainerRef.current.offsetTop;
          scrollContainerRef.current.scrollTo({
            top: newScrollTop,
            behavior: "smooth",
          });
        }
      }
    }
  }, [time, scripts, activeScriptIndex]);

  return (
    <section className="flex h-full min-h-[440px] w-full flex-col items-start justify-start gap-y-8 border border-gray-300 bg-gray-400 px-5 py-5">
      <div className="flex w-full flex-row items-center justify-between">
        <H4 className="border-b-2 border-white-100 font-bold text-white-100">
          대본
        </H4>
        <C1 className="border-b border-white-200 font-normal text-white-200">
          더빙 분석
        </C1>
      </div>

      <div
        ref={scrollContainerRef}
        className="scrollbar flex h-full max-h-[451px] w-full flex-1 flex-col items-start gap-6 overflow-y-scroll"
      >
        {scripts.map((script, index) => (
          <ScriptCard
            key={index}
            id={index}
            role={script.role}
            text={script.text}
            timestamp={script.start}
            no={index + 1}
            isActive={index === activeScriptIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default StudioScript;
