// 0. PX/S = 80
export const PX_PER_SECOND = 80;

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

  recorderId?: number;
  recorderName?: string;
  recorderRole?: string;
  recorderProfileUrl?: string;

  isMuted?: boolean;
  isSolo?: boolean;
}

// 3. 초기 트랙
export const initialTracks: Track[] = [
  {
    isMuted: false,
    isSolo: false,
    trackId: 1,
    waveColor: "#99A5FF",
    blockColor: "#4202B5",
    files: [],
  },
  {
    isMuted: false,
    isSolo: false,
    trackId: 2,
    waveColor: "#FF6DDE",
    blockColor: "#92005A",
    files: [],
  },
  {
    isMuted: false,
    isSolo: false,
    trackId: 3,
    waveColor: "#00D76E",
    blockColor: "#005230",
    files: [],
  },
  {
    trackId: 4,
    isSolo: false,
    waveColor: "#00D76E",
    blockColor: "#005230",
    files: [],
  },
  {
    trackId: 5,
    isSolo: false,
    waveColor: "#00D76E",
    blockColor: "#005230",
    files: [],
  },
];

// 4. 블록 (Block)

export interface Block {
  file: AudioFile;
  width: string;
  waveColor: string;
  blockColor: string;
}
