import ShareIcon from "@/public/images/icons/icon-share.svg";
import Button from "@/app/_components/Button";
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
    <Button
      outline
      className="flex items-center gap-x-2 whitespace-nowrap bg-white-100"
      onClick={handleShare}
    >
      <ShareIcon className="h-4 w-4 text-brand-200" />
      친구와 공유하기
    </Button>
  );
}
// <button className="flex items-center justify-center px-2 py-1.5">
//   <ShareIcon onClick={handleShare} className="text-brand-100" />
//   <span className="text-brand-100">친구와 공유하기</span>
// </button>
