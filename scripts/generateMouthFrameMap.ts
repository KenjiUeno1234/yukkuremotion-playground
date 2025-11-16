import {getTotalVideoFrames} from '../src/utils/getTotalVideoFrames';
import {VideoConfig} from '../src/yukkuri/yukkuriVideoConfig';
import * as fs from 'fs';
import {getTotalFramesBeforeSection} from '../src/utils/getTotalFramesBeforeSection';

export async function generateMouthFrameMap(videoConfig: VideoConfig) {
  const totalFrames = getTotalVideoFrames(videoConfig);

  // AyumiMouthByFrame: 0 = mouth close, 1 = mouth open
  const AyumiMouthByFrame = new Array(totalFrames).fill(0);

  // Mouth animation pattern: 0,0,0,1,1,1 (3 frames closed, 3 frames open)
  const FRAMES_PER_STATE = 3;

  videoConfig.sections.forEach((section, sectionIndex) => {
    const beforeFrames = getTotalFramesBeforeSection(videoConfig, sectionIndex);
    section.talks.forEach((talk, index) => {
      const startFrame = beforeFrames + section.fromFramesMap[index];

      // During talking: alternate between frame 0 (close) and frame 1 (open) every 3 frames
      for (let i = startFrame; i <= startFrame + talk.audioDurationFrames; i++) {
        // Create pattern: 0,0,0,1,1,1,0,0,0,1,1,1...
        const cyclePosition = (i - startFrame) % (FRAMES_PER_STATE * 2);
        AyumiMouthByFrame[i] = cyclePosition < FRAMES_PER_STATE ? 0 : 1;
      }
    });
  });

  fs.writeFileSync(
    `./transcripts/MouthByFrame.ts`,
    `export const AyumiMouthByFrame = ${JSON.stringify(AyumiMouthByFrame)};`
  );
}
