export interface Speaker {
  label: string;
  name: string;
  edited: boolean;
}

export interface Segment {
  start: number;
  end: number;
  text: string;
  diarization: {
    label: string;
  };
}
