import RoomCard from "./RoomCard";
import useFilterStore from "@/app/_store/FilterStore";

interface DubbingRoom {
  id: number;
  thumbnail: string;
  title: string;
  time: string;
  isLive: boolean;
  badges: string[];
  limit: number;
  count: number;
}

interface DubbingRoomListProps {
  dubbingRooms: DubbingRoom[];
}

const DubRoomArea = ({ dubbingRooms }: DubbingRoomListProps) => {
  const { timeFilter, typeFilter, genreFilter } = useFilterStore();

  const filteredRooms = dubbingRooms.filter((room) => {
    const hasTime = timeFilter.includes("ON AIR")
      ? room.isLive === true
      : timeFilter.includes("대기 중")
        ? room.isLive === false
        : true;

    const hasTypes =
      typeFilter.length === 0 ||
      typeFilter.every((filter) => room.badges.includes(filter));

    const hasGenres =
      genreFilter.length === 0 ||
      genreFilter.every((filter) => room.badges.includes(filter));

    return hasTime && hasTypes && hasGenres;
  });

  return (
    <div className="h-[730px] w-full overflow-scroll px-5 py-3">
      <div className="grid grid-cols-4 gap-5">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} roomInfo={room} />
        ))}
      </div>
    </div>
  );
};

export default DubRoomArea;
