import { Speaker } from "@/app/_types/script";
import { useEffect, useState } from "react";

interface RoleCardProps {
  label: string;
  speakers: Speaker[];
  setSpeakers?: (updatedSpeakers: Speaker[]) => void;
}

const ScriptRoleCard = ({ label, speakers, setSpeakers }: RoleCardProps) => {
  const getSpeakerName = (label: string): string => {
    const speaker = speakers.find((speaker) => speaker.label === label);
    return speaker ? speaker.name : "Unknown";
  };

  const getBgColor = (label: string) => {
    const colors: { [key: string]: string } = {
      "1": "bg-[#5E35B1] text-white-100", // 보라색
      "2": "bg-[#D81B60] text-white-100", // 강렬한 핑크
      "3": "bg-[#00897B] text-white-100", // 청록색
      "4": "bg-[#F9A825] text-white-100", // 밝은 주황 (텍스트 검은색)
    };

    return colors[label] || "bg-gray-400";
  };

  const [edit, setEdit] = useState(false);
  const [inputValue, setInputValue] = useState(getSpeakerName(label));

  useEffect(() => {
    setInputValue(getSpeakerName(label));
  }, [speakers, label]);

  const updateSpeakerName = () => {
    if (setSpeakers) {
      setSpeakers(
        speakers.map((speaker) =>
          speaker.label === label ? { ...speaker, name: inputValue } : speaker,
        ),
      );
    }
    setEdit(false);
  };

  // 🔹 엔터 키 입력 시 편집 종료 + 폼 제출 방지
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 동작 방지 (폼 제출 방지)
      event.stopPropagation(); // 이벤트 상위 전파 방지
      updateSpeakerName(); // 역할명 업데이트 후 편집 종료
    }
  };

  return (
    <div
      className={`flex cursor-pointer items-center justify-center rounded-[4px] px-4 py-0.5 ${getBgColor(label)}`}
      onClick={() => setSpeakers && setEdit(true)} // 🔹 setSpeakers가 있을 때만 수정 가능
    >
      {edit && setSpeakers ? (
        <input
          className="m-0 w-full flex-1 flex-shrink-0 truncate whitespace-nowrap bg-transparent p-0 text-center outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={updateSpeakerName}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        inputValue
      )}
    </div>
  );
};

export default ScriptRoleCard;
