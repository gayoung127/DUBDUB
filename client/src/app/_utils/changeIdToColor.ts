import CursorOrange from "@/public/images/icons/cursor-orange.svg";
import CursorYellow from "@/public/images/icons/cursor-yellow.svg";
import CursorGreen from "@/public/images/icons/cursor-green.svg";
import CursorBlue from "@/public/images/icons/cursor-blue.svg";
import CursorPurple from "@/public/images/icons/cursor-purple.svg";

const cursorStyles = [
  {
    icon: CursorOrange,
    bgColor: "#F06748",
    borderColor: "border-purple-500",
  }, // 대비되는 어두운 오렌지
  {
    icon: CursorYellow,
    bgColor: "#E1B115",
    borderColor: "border-green-500",
  }, // 대비되는 짙은 황색
  {
    icon: CursorGreen,
    bgColor: "#32C83F",
    borderColor: "border-pink-500",
  }, // 대비되는 어두운 녹색
  {
    icon: CursorBlue,
    bgColor: "#2594E4",
    borderColor: "border-sky-500",
  }, // 대비되는 진한 파랑
  {
    icon: CursorPurple,
    bgColor: "border-[rgb(108,55,184)]",
    borderColor: "border-yellow-500",
  }, // 대비되는 어두운 보라
];

export function getCursorStyle(id: string) {
  const styleIndex =
    Math.abs(id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
    cursorStyles.length;

  return cursorStyles[styleIndex];
}
