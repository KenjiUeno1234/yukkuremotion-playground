import {useMemo, memo} from 'react';
import {
  Img,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  AyumiEyeByFrame,
} from '../../../transcripts/FaceByFrame';
import {
  AyumiMouthByFrame,
} from '../../../transcripts/MouthByFrame';
import {zIndex} from '../../constants';

export type AyumiProps = {
  sizePx?: number;
  customImagePath?: string;
};

const DEFAULT_AYUMI_SIZE_PX = 320;

export const AyumiFace: React.FC<AyumiProps> = ({
  sizePx,
  customImagePath,
}) => {
  return (
    <Face
      sizePx={sizePx}
      customImagePath={customImagePath}
    />
  );
};

export const Face = (props: {
  sizePx?: number;
  customImagePath?: string;
}) => {
  const {sizePx, customImagePath} = props;

  const faceSizePx = sizePx ? sizePx : DEFAULT_AYUMI_SIZE_PX;
  const frame = useCurrentFrame();

  // Get eye and mouth state from frame maps
  const eyeState = useMemo(() => AyumiEyeByFrame[frame] || 0, [frame]);
  const mouthState = useMemo(() => AyumiMouthByFrame[frame] || 0, [frame]);

  if (customImagePath) {
    return (
      <MemoizedCustomFace
        faceSizePx={faceSizePx}
        customImagePath={customImagePath}
      />
    );
  }

  // Map eye and mouth states to image filenames
  // EyeState: 0 = open, 1 = open (transition), 2 = close
  // MouthState: 0 = close, 1 = open
  let imageName = 'eye-open&moth-close.png'; // Default

  if (eyeState === 0 || eyeState === 1) {
    // Eye open
    if (mouthState === 0) {
      imageName = 'eye-open&moth-close.png';
    } else {
      imageName = 'eye-open&moth-open.png';
    }
  } else if (eyeState === 2) {
    // Eye close
    imageName = 'eye-close&moth-open..png';
  }

  return (
    <MemoizedAyumiFace
      faceSizePx={faceSizePx}
      imageName={imageName}
    />
  );
};

export const PureAyumiFace = (props: {
  faceSizePx: number;
  imageName: string;
}) => {
  const {faceSizePx, imageName} = props;

  return (
    <div
      style={{
        ...containerStyle,
      }}
    >
      <Img
        style={{width: `${faceSizePx}px`}}
        src={staticFile(`jinbutu/${imageName}`)}
      />
    </div>
  );
};

const MemoizedAyumiFace = memo(PureAyumiFace, (prevProps, nextProps) => {
  return prevProps.imageName === nextProps.imageName;
});

export const PureCustomFace = (props: {
  faceSizePx: number;
  customImagePath: string;
}) => {
  const {faceSizePx, customImagePath} = props;

  return (
    <div
      style={{
        ...containerStyle,
      }}
    >
      <Img
        style={{width: `${faceSizePx}px`}}
        src={staticFile(customImagePath)}
      />
    </div>
  );
};

const MemoizedCustomFace = memo(PureCustomFace);

const containerStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: zIndex.yukkuri,
};
