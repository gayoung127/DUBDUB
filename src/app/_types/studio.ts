// 1. 오디오 파일 (AudioFile)
export interface AudioFile {
  id: string; // 파일 아이디
  url: string; // 파일 주소
  startPoint: number; // 트랙 내에서의 시작 시간
  duration: number; // 원본 파일 전체 길이
  trimStart: number; // 잘린 시작 부분
  trimEnd: number; // 잘린 끝 부분
  volume: number; // 볼륨 (0~1)
  isMuted: boolean; // 음소거 여부
  speed: number; // 재생 속도
}

// 2. 트랙 (Track)
export interface Track {
  trackId: number;
  waveColor: string;
  blockColor: string;
  files: AudioFile[];
}

// 3. 초기 트랙
export const initialTracks: Track[] = [
  {
    trackId: 1,
    waveColor: "#99A5FF",
    blockColor: "#4202B5",
    files: [
      {
        id: "file1",
        url: "/examples/happyhappyhappysong.mp3",
        startPoint: 0,
        duration: 7,
        trimStart: 0,
        trimEnd: 3,
        volume: 1.0,
        isMuted: false,
        speed: 1.0,
      },
      {
        id: "file2",
        url: "/examples/happyhappyhappysong.mp3",
        startPoint: 12,
        duration: 7,
        trimStart: 2,
        trimEnd: 2,
        volume: 1.0,
        isMuted: false,
        speed: 1.0,
      },
    ],
  },
  {
    trackId: 2,
    waveColor: "#FF6DDE",
    blockColor: "#92005A",
    files: [
      {
        id: "file3",
        url: "/examples/happyhappyhappysong.mp3",
        startPoint: 5,
        duration: 7,
        trimStart: 0,
        trimEnd: 2,
        volume: 1.0,
        isMuted: false,
        speed: 1.0,
      },
      {
        id: "file4",
        url: "/examples/happyhappyhappysong.mp3",
        startPoint: 21,
        duration: 7,
        trimStart: 3,
        trimEnd: 2,
        volume: 0.5,
        isMuted: false,
        speed: 1.0,
      },
    ],
  },
  {
    trackId: 3,
    waveColor: "#00D76E",
    blockColor: "#005230",
    files: [],
  },
];

// 4. 블록 (Block)

export interface Block {
  file: AudioFile;
  waveColor: string;
  blockColor: string;
}
