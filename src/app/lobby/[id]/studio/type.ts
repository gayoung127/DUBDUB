// captureStream()을 포함하는 타입 확장
interface VideoElementWithCapturestream extends HTMLVideoElement {
  captureStream?: () => MediaStream;
}
