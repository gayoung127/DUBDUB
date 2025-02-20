import { useState } from "react";
import { Speaker } from "@/app/_types/script";
import { formatTime } from "@/app/_utils/formatTime";

interface RoleLabelProps {
  label: string;
  speakers: Speaker[];
  start: number;
  onChange: (newLabel: string) => void; // 역할 변경 시 호출
  onTimeChange: (newTime: number) => void; // 시작 시간 변경 시 호출
}

const ScriptRoleLabel = ({
  label,
  speakers,
  start,
  onChange,
  onTimeChange,
}: RoleLabelProps) => {
  const [isEditingRole, setIsEditingRole] = useState(false); // 역할 변경 모드
  const [isEditingTime, setIsEditingTime] = useState(false); // 시간 변경 모드
  const [selectedLabel, setSelectedLabel] = useState(label); // 선택된 라벨
  const [startTime, setStartTime] = useState((start / 1000).toFixed(2)); // 초 단위로 변환 (소수점 2자리)

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

  // 역할 변경 핸들러
  const handleRoleChange = (newLabel: string) => {
    setSelectedLabel(newLabel);
    setIsEditingRole(false);
    onChange(newLabel); // 부모 컴포넌트에 변경된 값 전달
  };

  // 시간 변경 핸들러
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
  };

  // 시간 변경 적용
  const applyTimeChange = () => {
    const newTime = parseFloat(startTime);
    if (!isNaN(newTime)) {
      onTimeChange(newTime * 1000); // 🔹 다시 밀리초로 변환하여 부모에 전달
    }
    setIsEditingTime(false);
  };

  return (
    <div className="relative flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-1 py-0">
      <div className={`h-4 w-4 rounded-full ${getBgColor(selectedLabel)}`} />

      {/* 역할 변경 (드롭다운) */}
      {isEditingRole ? (
        <select
          className="text-white rounded-md bg-gray-100 px-2 py-1 text-[16px] outline-none"
          value={selectedLabel}
          onChange={(e) => handleRoleChange(e.target.value)}
          onBlur={() => {
            setIsEditingRole(false);
          }}
          autoFocus
        >
          {speakers.map((speaker) => (
            <option key={speaker.label} value={speaker.label}>
              {speaker.name}
            </option>
          ))}
        </select>
      ) : (
        <span
          className="text-[18px] font-medium leading-[1.2] text-white-100"
          onClick={() => setIsEditingRole(true)}
        >
          {getSpeakerName(selectedLabel)}
        </span>
      )}

      {/* 시작 시간 변경 (텍스트 입력 필드) */}
      {isEditingTime ? (
        <input
          type="text"
          className="w-16 rounded-md bg-gray-100 px-2 py-1 text-[16px] text-black outline-none"
          value={startTime}
          onChange={handleTimeChange}
          onBlur={applyTimeChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyTimeChange();
            }
          }}
          autoFocus
        />
      ) : (
        <span
          className="text-[14px] font-light leading-none text-white-300"
          onClick={() => setIsEditingTime(true)}
        >
          ({formatTime(start / 1000)}) {/* 초 단위로 변환하여 표시 */}
        </span>
      )}
    </div>
  );
};

export default ScriptRoleLabel;
