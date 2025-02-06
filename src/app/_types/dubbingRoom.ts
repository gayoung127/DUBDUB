interface DubbingRoom {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  isRecruiting: boolean;
  onAir: boolean;
  currentParticipants: number;
  totalParticipants: number;
  authorId: number;
  genres: number[];
  categories: number[];
}
