import DubbingDate from "./_components/DubbingDate";
import Title from "./_components/Title";

export default function RoomDetailPage() {
  return (
    <div>
      <div>
        <Title />
        <DubbingDate />
      </div>
      <p>썸네일</p>
      <p>모집 상태</p>
      <p>설명</p>
      <p>역할</p>
      <div>
        <p>장르</p>
        <p>타입</p>
      </div>
      <p>대본</p>
      <button>신청하기</button>
    </div>
  );
}
