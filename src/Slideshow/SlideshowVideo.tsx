import React from 'react';
import { AbsoluteFill, Sequence, Img, Audio, staticFile } from 'remotion';
import { SlideshowConfig } from '../types/slideshow';

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
      {config.slides.map((slide) => {
        const startFrame = currentFrame;
        const durationFrames = slide.audioDurationFrames;

        console.log(`Slide ${slide.id}: from=${startFrame}, duration=${durationFrames}`);

        // 次のスライドの開始フレームを更新
        currentFrame += durationFrames;

        return (
          <Sequence
            key={slide.id}
            from={startFrame}
            durationInFrames={durationFrames}
          >
            {/* スライド画像 */}
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

            {/* 音声ファイル */}
            <Audio src={staticFile(slide.voicePath)} />

            {/* 字幕（画面下部） */}
            <AbsoluteFill
              style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 60,
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  fontSize: 42,
                  padding: '20px 60px',
                  borderRadius: 8,
                  maxWidth: '90%',
                  textAlign: 'center',
                  fontFamily: 'sans-serif',
                  lineHeight: 1.6,
                }}
              >
                {slide.narration}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
