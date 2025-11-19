import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SlideshowConfig } from '../types/slideshow';
import { SlideItem } from './SlideItem';

interface SlideshowVideoProps {
  config: SlideshowConfig;
}

export const SlideshowVideo: React.FC<SlideshowVideoProps> = ({ config }) => {
  let currentFrame = 0;

  console.log('SlideshowVideo config:', {
    totalSlides: config.slides.length,
    totalFrames: config.totalFrames,
    slides: config.slides.map(s => ({
      id: s.id,
      slidePath: s.slidePath,
      audioDurationFrames: s.audioDurationFrames,
    })),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#f0f0f0' }}>
      {config.slides.map((slide, index) => {
        const startFrame = currentFrame;
        const durationFrames = slide.audioDurationFrames;

        console.log(`Slide ${slide.id}: startFrame=${startFrame}, duration=${durationFrames}`);

        const element = (
          <SlideItem
            key={slide.id}
            narration={slide.narration}
            slidePath={slide.slidePath}
            voicePath={slide.voicePath}
            startFrame={startFrame}
            durationFrames={durationFrames}
          />
        );

        // 次のスライドの開始フレームを計算
        currentFrame += durationFrames;

        return element;
      })}
    </AbsoluteFill>
  );
};
