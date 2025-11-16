import {Sequence} from 'remotion';
import {zIndex} from '../constants';
import {AyumiFace} from './Face/YukkuriFace';
import {VoiceConfig} from './yukkuriVideoConfig';

export type Props = {
  talks: VoiceConfig[];
  fromFramesMap: {[key in number]: number};
  customAyumiImagePath?: string;
};

export const YukkuriSequence: React.FC<Props> = ({
  customAyumiImagePath,
}) => {
  return (
    <Sequence>
      <div style={centerCharacterStyle}>
        <AyumiFace customImagePath={customAyumiImagePath} sizePx={650} />
      </div>
    </Sequence>
  );
};

const centerCharacterStyle: React.CSSProperties = {
  position: 'absolute',
  right: '-30px',
  bottom: '-300px',
  zIndex: zIndex.yukkuri,
};
