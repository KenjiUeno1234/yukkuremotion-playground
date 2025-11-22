import React from 'react';
import { AbsoluteFill, Sequence, Img, Audio, staticFile } from 'remotion';
import { SlideshowConfig } from '../types/slideshow';
import { YukkuriSequence } from '../yukkuri/YukkuriSequence';
import { TalkSequence } from '../yukkuri/Talk/TalkSequence';
import { zIndex } from '../constants';

interface SlideshowVideoProps {
  config: SlideshowConfig;
}

// 口パクパターンを生成する関数（改善版：ナレーション開始/終了を正確に反映）
function generateKuchipakuMap(
  narrations: { audioDurationFrames: number }[],
  startFrame: number
): { frames: number[]; amplitude: number[] } {
  const frames: number[] = [];
  const amplitude: number[] = [];

  let currentNarrationFrame = startFrame;

  for (const narration of narrations) {
    // 各ナレーションの音声再生中は口パクを行う
    for (let i = 0; i < narration.audioDurationFrames; i++) {
      const frameNumber = currentNarrationFrame + i;
      frames.push(frameNumber);

      // 口パクパターン: 8フレームサイクル（4フレーム開いて4フレーム閉じる）
      const cyclePosition = i % 8;
      amplitude.push(cyclePosition < 4 ? 1 : 0);
    }

    currentNarrationFrame += narration.audioDurationFrames;
  }

  console.log(`口パクマップ生成: ${frames.length}フレーム, 開始=${startFrame}, 終了=${currentNarrationFrame - 1}`);

  return { frames, amplitude };
}

export const SlideshowVideo: React.FC<SlideshowVideoProps> = ({ config }) => {
  console.log('SlideshowVideo config:', {
    totalSlides: config.slides.length,
    totalFrames: config.totalFrames,
  });

  // 各スライドの開始フレームを計算
  let currentFrame = 0;

  // 全スライドの口パクマップを統合
  const globalKuchipakuMap: { frames: number[]; amplitude: number[] } = {
    frames: [],
    amplitude: [],
  };

  // 全スライドのtalksを収集
  const allTalks: any[] = [];
  const globalFromFramesMap: Record<number, number> = {};
  let talkIndex = 0;

  // 一度スライドをループして、全データを収集
  const slideData: Array<{
    slide: typeof config.slides[0];
    startFrame: number;
    durationFrames: number;
    fromFramesMap: Record<number, number>;
    talks: any[];
  }> = [];

  config.slides.forEach((slide) => {
    const startFrame = currentFrame;
    const durationFrames = slide.totalDurationFrames;

    console.log(`Slide ${slide.id}: from=${startFrame}, duration=${durationFrames}`);

    // 複数のナレーションをtalksに変換
    let narrationFrame = 0;
    const fromFramesMap: Record<number, number> = {};
    const talks = slide.narrations.map((narration, idx) => {
      fromFramesMap[idx] = startFrame + narrationFrame;
      globalFromFramesMap[talkIndex] = startFrame + narrationFrame;
      talkIndex++;

      const talk = {
        text: narration.text,
        speaker: 'ayumi' as const,
        audioDurationFrames: narration.audioDurationFrames,
        audio: {
          src: narration.voicePath,
        },
      };
      narrationFrame += narration.audioDurationFrames;
      return talk;
    });

    allTalks.push(...talks);

    // 口パクマップを生成して統合
    const kuchipakuMap = generateKuchipakuMap(slide.narrations, startFrame);
    globalKuchipakuMap.frames.push(...kuchipakuMap.frames);
    globalKuchipakuMap.amplitude.push(...kuchipakuMap.amplitude);

    slideData.push({
      slide,
      startFrame,
      durationFrames,
      fromFramesMap,
      talks,
    });

    // 次のスライドの開始フレームを更新
    currentFrame += durationFrames;
  });

  console.log(`✅ 統合口パクマップ: ${globalKuchipakuMap.frames.length}フレーム (0 ~ ${config.totalFrames - 1})`);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      {/* 背景画像 - 全画面表示 */}
      <Img
        src={staticFile('background/okumono_wakusei5.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      />

      {/* BGM - 全体にループ再生 */}
      {config.bgmSrc && (
        <Audio
          loop
          src={staticFile(config.bgmSrc)}
          volume={config.bgmVolume || 0.2}
        />
      )}

      {slideData.map(({ slide, startFrame, durationFrames, fromFramesMap, talks }) => (
        <React.Fragment key={slide.id}>
          {/* スライド画像 */}
          <Sequence
            from={startFrame}
            durationInFrames={durationFrames}
          >
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '70%',
                height: '92%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <Img
                src={staticFile(slide.slidePath)}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
                onLoad={() => console.log(`✅ ${slide.id} 画像読み込み成功`)}
                onError={(e) => console.error(`❌ ${slide.id} 画像読み込みエラー`, e)}
              />
            </div>
          </Sequence>

          {/* 字幕と音声 */}
          <TalkSequence
            fromFramesMap={fromFramesMap}
            totalFrames={startFrame + durationFrames}
            talks={talks}
            kuchipakuMap={globalKuchipakuMap}
          />
        </React.Fragment>
      ))}

      {/* ゆっくりキャラクター - 全体で1つ */}
      <YukkuriSequence
        fromFramesMap={globalFromFramesMap}
        totalFrames={config.totalFrames}
        talks={allTalks}
        kuchipakuMap={globalKuchipakuMap}
      />

      {/* ロゴ - 非表示 */}
      {/* <div style={logoStyle}>
        <Img src={staticFile('image/yukkurilogo.png')} />
      </div> */}
    </AbsoluteFill>
  );
};

const logoStyle: React.CSSProperties = {
  position: 'absolute',
  top: '40px',
  left: '40px',
  opacity: 0.8,
  zIndex: zIndex.anyValue,
};
