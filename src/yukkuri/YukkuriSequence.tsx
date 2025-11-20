import {Sequence} from 'remotion';
import {zIndex} from '../constants';
import {AyumiFace} from './Face/YukkuriFace';
import {VoiceConfig} from './yukkuriVideoConfig';

export type Props = {
  talks: VoiceConfig[];
  fromFramesMap: {[key in number]: number};
  customAyumiImagePath?: string;
  kuchipakuMap: { frames: number[]; amplitude: number[] };
};

export const YukkuriSequence: React.FC<Props> = ({
  customAyumiImagePath,
  kuchipakuMap,
}) => {
  return (
    <Sequence>
      <div style={centerCharacterStyle}>
        <AyumiFace
          customImagePath={customAyumiImagePath}
          sizePx={650}
          kuchipakuMap={kuchipakuMap}
        />
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
