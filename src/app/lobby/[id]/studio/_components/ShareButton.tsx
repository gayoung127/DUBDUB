import ClipboardIcon from "@/public/images/icons/icon-clipboard.svg";
import { toast } from "sonner";

export default function ShareButton() {
  const handleShare = () => {
    const currentURL = window.location.href; // 현재 페이지 URL 가져오기
    navigator.clipboard
      .writeText(currentURL) // URL을 클립보드에 복사
      .then(() => toast.success("URL이 클립보드에 복사되었습니다."))
      .catch((err) => console.error("URL 복사 실패:", err));
  };

  return (
    <button className="flex items-center justify-center px-2 py-1.5">
      <ClipboardIcon onClick={handleShare} className="text-brand-100" />
    </button>
  );
}

{
  /* <Button onClick={handleShare}>URL 공유하기</Button> */
}
