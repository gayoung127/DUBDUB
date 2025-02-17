export interface Speaker {
  label: string; //화자를 구분하는 고유 라벨
  name: string; // 화자 이름
  edited: boolean; // 이름이 편집되었는지
}

export interface Segment {
  start: number; // 세그먼트 시작시간
  end: number; // 세그먼트 종료시간
  text: string; // 세그먼트 텍스트 내용
  diarization: {
    label: string; // 이 세그먼트에 해당하는 화자 라벨
  };
}
