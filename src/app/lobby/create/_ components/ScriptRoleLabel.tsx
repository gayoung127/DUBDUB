import { Speaker } from "@/app/_types/script";
import { formatTime } from "@/app/_utils/formatTime";

interface RoleLabelProps {
  label: string;
  speakers: Speaker[];
  start: number;
}

const ScriptRoleLabel = ({ label, speakers, start }: RoleLabelProps) => {
  const getSpeakerName = (label: string): string => {
    const speaker = speakers.find((speaker) => speaker.label === label);
    return speaker ? speaker.name : "Unknown";
  };

  const getBgColor = (label: string) => {
    const colors: { [key: string]: string } = {
      "1": "bg-[#5E35B1]", // 보라색
      "2": "bg-[#D81B60]", // 강렬한 핑크
      "3": "bg-[#00897B]", // 청록색
      "4": "bg-[#F9A825]", // 밝은 주황
    };

    return colors[label] || "bg-gray-400";
  };

  return (
    <div className="flex w-full items-center gap-x-3 rounded-lg px-1 py-0">
      <div className={`h-4 w-4 rounded-full ${getBgColor(label)}`} />
      <span className="text-[18px] font-medium leading-[1.2] text-white-100">
        {getSpeakerName(label)}
      </span>
      <span className="text-[14px] font-light leading-none text-white-300">
        ({formatTime(start / 1000)})
      </span>
    </div>
  );
};

export default ScriptRoleLabel;
