declare module "wavesurfer.js/dist/plugins/timeline.esm" {
  import { BasePlugin } from "wavesurfer.js";
  import { WaveSurferOptions } from "wavesurfer.js";

  export interface TimelinePluginOptions {
    container: HTMLElement | string;
    height?: number;
    primaryLabelInterval?: number;
    secondaryLabelInterval?: number;
    timeInterval?: number;
    style?: string | Partial<CSSStyleDeclaration>;
    formatTimeCallback?: (seconds: number) => string;
  }

  export default class TimelinePlugin extends BasePlugin {
    constructor(options: TimelinePluginOptions);
    static create(options: TimelinePluginOptions): TimelinePlugin;
  }
}

declare module "waveform-playlist" {
  interface WaveformPlaylistOptions {
    container: HTMLElement;
    samplesPerPixel?: number;
    waveHeight?: number;
    mono?: boolean;
    state?: string;
    colors?: {
      waveOutlineColor?: string;
      timeColor?: string;
      fadeColor?: string;
    };
    controls?: {
      show?: boolean;
      width?: number;
    };
    zoomLevels?: number[];
  }

  interface TrackOptions {
    src: string;
    name?: string;
    start?: number;
    gain?: number;
    fadeIn?: { duration: number };
    fadeOut?: { duration: number; shape?: string };
    cuein?: number;
    cueout?: number;
  }

  class WaveformPlaylist {
    constructor(options: WaveformPlaylistOptions);
    static create(options: WaveformPlaylistOptions): WaveformPlaylist;
    load(tracks: TrackOptions[]): Promise<void>;
    play(): void;
    pause(): void;
    stop(): void;
    isPlaying(): boolean;
    zoom(level: number): void;
    setTime(time: number): void;
    on(event: string, callback: (...args: any[]) => void): void;
    getCurrentTime(): number;
    destroy(): void;
  }

  export default WaveformPlaylist;
}
