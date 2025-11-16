import {getTotalVideoFrames} from '../src/utils/getTotalVideoFrames';
import {VideoConfig} from '../src/yukkuri/yukkuriVideoConfig';
import * as fs from 'fs';
import {getTotalFramesBeforeSection} from '../src/utils/getTotalFramesBeforeSection';

export async function generateMouthFrameMap(videoConfig: VideoConfig) {
  const totalFrames = getTotalVideoFrames(videoConfig);

  // AyumiMouthByFrame: 0 = mouth close, 1 = mouth open
  const AyumiMouthByFrame = new Array(totalFrames).fill(0);

  videoConfig.sections.forEach((section, sectionIndex) => {
    const beforeFrames = getTotalFramesBeforeSection(videoConfig, sectionIndex);
    section.talks.forEach((talk, index) => {
      const startFrame = beforeFrames + section.fromFramesMap[index];

      // During talking: alternate between frame 0 (close) and frame 1 (open)
      for (let i = startFrame; i <= startFrame + talk.audioDurationFrames; i++) {
        // Alternate between 0 and 1 every frame
        AyumiMouthByFrame[i] = (i - startFrame) % 2;
      }
    });
  });

  fs.writeFileSync(
    `./transcripts/MouthByFrame.ts`,
    `export const AyumiMouthByFrame = ${JSON.stringify(AyumiMouthByFrame)};`
  );
}
