import CursorOrange from "@/public/images/icons/cursor-orange.svg";
import CursorYellow from "@/public/images/icons/cursor-yellow.svg";
import CursorGreen from "@/public/images/icons/cursor-green.svg";
import CursorBlue from "@/public/images/icons/cursor-blue.svg";
import CursorPurple from "@/public/images/icons/cursor-purple.svg";

const cursorStyles = [
  {
    icon: CursorOrange,
    bgColor: "#F06748",
    borderColor: "border-[rgb(185,71,46)]",
  }, // 대비되는 어두운 오렌지
  {
    icon: CursorYellow,
    bgColor: "#E1B115",
    borderColor: "border-[rgb(169,133,13)]",
  }, // 대비되는 짙은 황색
  {
    icon: CursorGreen,
    bgColor: "#32C83F",
    borderColor: "border-[rgb(30,122,41)]",
  }, // 대비되는 어두운 녹색
  {
    icon: CursorBlue,
    bgColor: "#2594E4",
    borderColor: "border-[rgb(27,106,179)]",
  }, // 대비되는 진한 파랑
  { icon: CursorPurple, bgColor: "border-[rgb(108,55,184)]" }, // 대비되는 어두운 보라
];

export function getCursorStyle(id: string) {
  const styleIndex =
    Math.abs(id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
    cursorStyles.length;

  return cursorStyles[styleIndex];
}
