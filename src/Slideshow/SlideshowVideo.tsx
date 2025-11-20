import React from 'react';
import { AbsoluteFill, Sequence, Img, Audio, staticFile } from 'remotion';
import { SlideshowConfig } from '../types/slideshow';
import { YukkuriSequence } from '../yukkuri/YukkuriSequence';
import { TalkSequence } from '../yukkuri/Talk/TalkSequence';
import { zIndex } from '../constants';

interface SlideshowVideoProps {
  config: SlideshowConfig;
}

export const SlideshowVideo: React.FC<SlideshowVideoProps> = ({ config }) => {
  console.log('SlideshowVideo config:', {
    totalSlides: config.slides.length,
    totalFrames: config.totalFrames,
  });

  // 各スライドの開始フレームを計算
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* BGM - 全体にループ再生 */}
      {config.bgmSrc && (
        <Audio
          loop
          src={staticFile(config.bgmSrc)}
          volume={config.bgmVolume || 0.2}
        />
      )}

      {config.slides.map((slide, index) => {
        const startFrame = currentFrame;
        const durationFrames = slide.totalDurationFrames;

        console.log(`Slide ${slide.id}: from=${startFrame}, duration=${durationFrames}`);

        // 次のスライドの開始フレームを更新
        currentFrame += durationFrames;

        // 複数のナレーションをtalksに変換
        let narrationFrame = 0;
        const fromFramesMap: Record<number, number> = {};
        const talks = slide.narrations.map((narration, idx) => {
          fromFramesMap[idx] = startFrame + narrationFrame;
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

        return (
          <React.Fragment key={slide.id}>
            {/* スライド画像 */}
            <Sequence
              from={startFrame}
              durationInFrames={durationFrames}
            >
              <Img
                src={staticFile(slide.slidePath)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                onLoad={() => console.log(`✅ ${slide.id} 画像読み込み成功`)}
                onError={(e) => console.error(`❌ ${slide.id} 画像読み込みエラー`, e)}
              />
            </Sequence>

            {/* 字幕と音声 */}
            <TalkSequence
              fromFramesMap={fromFramesMap}
              totalFrames={startFrame + durationFrames}
              talks={talks}
              kuchipakuMap={{ frames: [], amplitude: [] }}
            />

            {/* ゆっくりキャラクター */}
            <YukkuriSequence
              fromFramesMap={fromFramesMap}
              totalFrames={startFrame + durationFrames}
              talks={talks}
              kuchipakuMap={{ frames: [], amplitude: [] }}
            />
          </React.Fragment>
        );
      })}

      {/* ロゴ */}
      <div style={logoStyle}>
        <Img src={staticFile('image/yukkurilogo.png')} />
      </div>
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
