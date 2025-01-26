import RoomCard from "./RoomCard";

interface DubbingRoom {
  id: number;
  thumbnail: string;
  title: string;
  time: string;
  badges: string[];
  limit: number;
  count: number;
}

interface DubbingRoomListProps {
  dubbingRooms: DubbingRoom[];
}

const DubRoomArea = ({ dubbingRooms }: DubbingRoomListProps) => {
  return (
    <div className="h-[730px] w-full overflow-scroll px-5 py-3">
      <div className="grid grid-cols-4 gap-5">
        {dubbingRooms.map((room) => (
          <RoomCard key={room.id} roomInfo={room} />
        ))}
      </div>
    </div>
  );
};

export default DubRoomArea;
