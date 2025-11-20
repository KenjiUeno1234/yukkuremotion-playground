import React from 'react';
import {SUBTITLE_HEIGHT_PX, zIndex} from '../constants';
import {SPEAKER_TYPE} from '../yukkuri/yukkuriVideoConfig';
import {Subtitle} from './Subtitle';

export const SubtitleWithBackground = (props: {
  subtitle: string;
  speaker: SPEAKER_TYPE;
}) => (
  <div style={jimakuContainer}>
    <div style={jimakuTextBox}>
      <div style={jimakuText}>{props.subtitle}</div>
    </div>
  </div>
);

// コンテナ: 画面下部に配置（少し上に移動）
const jimakuContainer: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: 'auto',
  bottom: '80px',
  left: 0,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingBottom: '10px',
  zIndex: zIndex.subtitle,
};

// テキストボックス: 文字部分のみ黒背景
const jimakuTextBox: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  padding: '10px 20px',
  borderRadius: '4px',
};

// テキスト: 白文字（サイズを大きく）
const jimakuText: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '38px',
  fontWeight: 'bold',
  textAlign: 'left',
  whiteSpace: 'pre-wrap',
  lineHeight: '1.5',
};
