import CursorOrange from "@/public/images/icons/cursor-orange.svg";
import CursorYellow from "@/public/images/icons/cursor-yellow.svg";
import CursorGreen from "@/public/images/icons/cursor-green.svg";
import CursorBlue from "@/public/images/icons/cursor-blue.svg";
import CursorPurple from "@/public/images/icons/cursor-purple.svg";

const cursorStyles = [
  { icon: CursorOrange, bgColor: "#F06748" }, // Orange
  { icon: CursorYellow, bgColor: "#E1B115" }, // Yellow
  { icon: CursorGreen, bgColor: "#32C83F" }, // Yellow
  { icon: CursorBlue, bgColor: "#2594E4" }, // Yellow
  { icon: CursorPurple, bgColor: "#9C50FF" }, // Yellow
];

export function getCursorStyle(id: string) {
  const styleIndex =
    Math.abs(id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
    cursorStyles.length;

  return cursorStyles[styleIndex];
}
