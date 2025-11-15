import React from 'react';
import {zIndex} from '../constants';
import {SPEAKER, SPEAKER_TYPE} from '../yukkuri/yukkuriVideoConfig';

const subtitle: React.CSSProperties = {
  fontFamily: 'GenshinGothic',
  fontSize: 48,
  fontWeight: 'bold',
  lineHeight: 1.28,
  color: '#DEFFEE',
  textAlign: 'left',
  zIndex: zIndex.anyValue,
};

type Props = {
  speaker: SPEAKER_TYPE;
  children: React.ReactNode;
};

export const Subtitle: React.FC<Props> = ({speaker, children}) => {
  return (
    <p style={subtitle}>
      {children}
    </p>
  );
};
