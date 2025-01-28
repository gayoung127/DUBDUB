import { create } from "zustand";

interface AudioFile {
  id: string;
  url: string;
  startTime: number;
  endTime: number;
}

interface Track {
  trackId: number;
  files: AudioFile[];
}

interface TracksState {
  tracks: Track[];
  addFileToTrack: (trackId: number, file: AudioFile) => void;
}

export const useTracksStore = create<TracksState>((set) => ({
  tracks: [
    {
      trackId: 1,
      files: [
        {
          id: "file1",
          url: "/examples/happyhappyhappysong.mp3",
          startTime: 0,
          endTime: 10,
        },
        {
          id: "file2",
          url: "/examples/happyhappyhappysong.mp3",
          startTime: 15,
          endTime: 30,
        },
      ],
    },
    {
      trackId: 2,
      files: [
        {
          id: "file1",
          url: "/examples/happyhappyhappysong.mp3",
          startTime: 0,
          endTime: 10,
        },
      ],
    },
    { trackId: 3, files: [] },
    { trackId: 4, files: [] },
    { trackId: 5, files: [] },
    { trackId: 6, files: [] },
  ],
  addFileToTrack: (trackId, file) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.trackId === trackId
          ? { ...track, files: [...track.files, file] }
          : track,
      ),
    })),
}));
