import {Composition} from 'remotion';
import {MyVideoConfig} from '../transcripts/myvideo';
import {FPS} from './constants';
import {YukkuriVideo} from './YukkuriVideo';
import {loadFont} from './load-fonts';
import {TransitionSpace} from './sozai/TransitionSpace';
import {getTotalVideoFrames} from './utils/getTotalVideoFrames';
import {slideshowConfig} from './data/slideshowConfig';
import {SlideshowVideo} from './Slideshow/SlideshowVideo';
import {TestSlide} from './Slideshow/TestSlide';
import {MinimalTest} from './Slideshow/MinimalTest';

export const RemotionRoot: React.FC = () => {
  loadFont();

  return (
    <>
      <Composition
        id="MyVideo"
        component={YukkuriVideo}
        durationInFrames={getTotalVideoFrames(MyVideoConfig)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{videoConfig: MyVideoConfig}}
      />
      <Composition
        id="TransitionSpace"
        component={TransitionSpace}
        durationInFrames={180}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Slideshow"
        component={SlideshowVideo}
        durationInFrames={slideshowConfig.totalFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{config: slideshowConfig}}
      />
      <Composition
        id="TestSlide"
        component={TestSlide}
        durationInFrames={150}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="MinimalTest"
        component={MinimalTest}
        durationInFrames={150}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
