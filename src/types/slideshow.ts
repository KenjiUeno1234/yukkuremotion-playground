export interface NarrationSegment {
  text: string; // ナレーションテキスト
  voicePath: string; // voices/S001-1.wav
  audioDurationFrames: number; // 音声の長さ（フレーム数）
}

export interface SlideItem {
  id: string; // S001, S002, etc.
  slidePath: string; // slide/S001.png
  narrations: NarrationSegment[]; // 複数のナレーション
  totalDurationFrames: number; // このスライドの合計フレーム数
}

export interface SlideshowConfig {
  slides: SlideItem[];
  totalFrames: number;
  bgmSrc?: string; // BGMファイルパス
  bgmVolume?: number; // BGM音量
}
