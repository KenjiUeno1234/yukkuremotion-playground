import * as fs from 'fs';
import {FPS} from '../src/constants';
import {getTotalFramesBeforeSection} from '../src/utils/getTotalFramesBeforeSection';
import {getTotalVideoFrames} from '../src/utils/getTotalVideoFrames';
import {VideoConfig} from '../src/yukkuri/yukkuriVideoConfig';

export async function generateFaceFrameMap(videoConfig: VideoConfig) {
  const totalFrames = getTotalVideoFrames(videoConfig);

  // AyumiEyeByFrame: 0 = eye open, 1 = eye close (for blinking during talking)
  const AyumiEyeByFrame = new Array(totalFrames).fill(0);

  const BLINK_INTERVAL_FRAMES = 5 * FPS; // 5 seconds
  const BLINK_DURATION_FRAMES = 4; // frames 1->2->2->1 takes 4 frames total

  videoConfig.sections.forEach((section, sectionIndex) => {
    const beforeFrames = getTotalFramesBeforeSection(videoConfig, sectionIndex);
    section.talks.forEach((talk, index) => {
      const startFrame = beforeFrames + section.fromFramesMap[index];
      const endFrame = startFrame + talk.audioDurationFrames;

      // Add blinks during talking (every 5 seconds)
      for (let blinkStart = startFrame; blinkStart < endFrame; blinkStart += BLINK_INTERVAL_FRAMES) {
        // Blink pattern: frame 1 -> 2 -> 2 -> 1
        if (blinkStart < endFrame) AyumiEyeByFrame[blinkStart] = 1;
        if (blinkStart + 1 < endFrame) AyumiEyeByFrame[blinkStart + 1] = 2;
        if (blinkStart + 2 < endFrame) AyumiEyeByFrame[blinkStart + 2] = 2;
        if (blinkStart + 3 < endFrame) AyumiEyeByFrame[blinkStart + 3] = 1;
      }
    });
  });

  fs.writeFileSync(
    `./transcripts/FaceByFrame.ts`,
    `export const AyumiEyeByFrame = ${JSON.stringify(AyumiEyeByFrame)};`
  );
}
