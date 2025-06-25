interface DubbingRoom {
  id: number;
  title: string;
  currentParticipants: number;
  totalParticipants: number;
  genres: number[];
  categories: number[];
  thumbnailUrl?: string;
}
