import Header from "../_components/Header";
import DubbingDate from "./_components/DubbingDate";
import Thumbnail from "./_components/Thumbnail";
import Title from "./_components/Title";

export default function RoomDetailPage() {
  return (
    <div>
      <Header />
      <div className="flex h-full w-full flex-1 flex-row">
        <div>
          <div>
            <div>
              <Thumbnail />
            </div>
            <div>
              <Title />
              <DubbingDate />
            </div>
            <div>
              <div>
                <p>장르</p>
                <p>타입</p>
              </div>
              <div>
                <p>설명</p>
              </div>
            </div>
          </div>
          <div>
            <p>역할</p>
          </div>
        </div>
        <div>
          <p>대본</p>
        </div>
      </div>
      <div>
        <button>신청하기</button>
      </div>
    </div>
  );
}
