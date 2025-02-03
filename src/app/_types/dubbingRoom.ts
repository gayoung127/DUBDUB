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
