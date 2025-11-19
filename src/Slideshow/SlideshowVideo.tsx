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
        const durationFrames = slide.audioDurationFrames;

        console.log(`Slide ${slide.id}: from=${startFrame}, duration=${durationFrames}`);

        // fromFramesMapを作成（音声が開始するフレーム）
        const fromFramesMap = { 0: 0 };

        // 次のスライドの開始フレームを更新
        currentFrame += durationFrames;

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
              fromFramesMap={{ 0: startFrame }}
              totalFrames={startFrame + durationFrames}
              talks={[
                {
                  text: slide.narration,
                  speaker: 'ayumi',
                  audioDurationFrames: durationFrames,
                  audio: {
                    src: slide.voicePath,
                  },
                },
              ]}
              kuchipakuMap={{ frames: [], amplitude: [] }}
            />

            {/* ゆっくりキャラクター */}
            <YukkuriSequence
              fromFramesMap={{ 0: startFrame }}
              totalFrames={startFrame + durationFrames}
              talks={[
                {
                  text: slide.narration,
                  speaker: 'ayumi',
                  audioDurationFrames: durationFrames,
                  audio: {
                    src: slide.voicePath,
                  },
                },
              ]}
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
