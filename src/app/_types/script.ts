export interface Speaker {
  label: string;
  name: string;
  edited?: boolean;
}

export interface Segment {
  start: number;
  end?: number;
  text: string;
  diarization?: {
    label: string;
  };
}

export interface Script {
  start: number;
  text: string;
  role: string;
}

export interface Role {
  id: string;
  name: string;
}
