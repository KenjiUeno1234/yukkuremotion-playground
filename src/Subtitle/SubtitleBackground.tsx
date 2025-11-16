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
  width: '100%',
  height: `${SUBTITLE_HEIGHT_PX}px`,
  bottom: 0,
  left: 0,
  backgroundColor: '#062722',
  opacity: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingLeft: '40px',
  paddingRight: '500px',
  textAlign: 'left',
  whiteSpace: 'pre-wrap',
  zIndex: zIndex.subtitle,
};
