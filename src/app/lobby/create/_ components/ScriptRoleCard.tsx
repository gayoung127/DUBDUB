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
      "1": "bg-white-100",
      "2": "bg-brand-100",
      "3": "bg-brand-200",
      "4": "bg-brand-300",
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

  return (
    <div
      className={`flex h-[50px] w-[80px] cursor-pointer items-center justify-center rounded-[4px] py-2 ${getBgColor(label)}`}
      onClick={() => setSpeakers && setEdit(true)} // 🔹 setSpeakers가 있을 때만 수정 가능
    >
      {edit && setSpeakers ? (
        <input
          className="w-full bg-transparent text-center outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={updateSpeakerName}
          autoFocus
        />
      ) : (
        inputValue
      )}
    </div>
  );
};

export default ScriptRoleCard;
