import Badge from "@/app/_components/Badge";

// 썸네일 이미지 주소, 더빙 룸 상태
interface ThumbnailProps {
  thumbnail: string;
  roomStatus: string;
}

const Thumbnail = ({ thumbnail, roomStatus }: ThumbnailProps) => {
  return (
    <div className="relative w-[440px] rounded-lg">
      <img src={thumbnail} className="aspect-video w-full rounded-lg" />
      <div className="absolute right-2 top-2">
        <Badge title={roomStatus} />
      </div>
    </div>
  );
};
export default Thumbnail;
