export interface SlideItem {
  id: string; // S001, S002, etc.
  narration: string; // NARRATOR部分のテキスト
  slidePath: string; // slide/S001.png
  voicePath: string; // voices/S001.wav
  audioDurationFrames: number; // 音声の長さ（フレーム数）
}

export interface SlideshowConfig {
  slides: SlideItem[];
  totalFrames: number;
  bgmSrc?: string; // BGMファイルパス
  bgmVolume?: number; // BGM音量
}
