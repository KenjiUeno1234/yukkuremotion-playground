import React from 'react';
import {SUBTITLE_HEIGHT_PX, zIndex} from '../constants';
import {SPEAKER_TYPE} from '../yukkuri/yukkuriVideoConfig';
import {Subtitle} from './Subtitle';

export const SubtitleWithBackground = (props: {
  subtitle: string;
  speaker: SPEAKER_TYPE;
}) => (
  <div style={jimakuBackground}>
    <Subtitle speaker={props.speaker}>{props.subtitle}</Subtitle>
  </div>
);

const jimakuBackground: React.CSSProperties = {
  position: 'absolute',
  width: '70%',
  height: `${SUBTITLE_HEIGHT_PX}px`,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingLeft: '40px',
  textAlign: 'left',
  whiteSpace: 'pre-wrap',
  zIndex: zIndex.subtitle,
};
