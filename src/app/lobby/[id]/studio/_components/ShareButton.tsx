import Button from "@/app/_components/Button";

function ShareButton() {
  const handleShare = () => {
    const currentURL = window.location.href; // 현재 페이지 URL 가져오기
    navigator.clipboard
      .writeText(currentURL) // URL을 클립보드에 복사
      .then(() => alert("URL이 클립보드에 복사되었습니다."))
      .catch((err) => console.error("URL 복사 실패:", err));
  };

  return (
    <div className="flex items-center justify-center px-2 py-1.5">
      <Button onClick={handleShare}>URL 공유하기</Button>
    </div>
  );
}

export default ShareButton;
