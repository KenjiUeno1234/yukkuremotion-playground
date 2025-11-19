import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from 'remotion';

interface SlideItemProps {
  narration: string;
  slidePath: string;
  voicePath: string;
  startFrame: number;
  durationFrames: number;
}

export const SlideItem: React.FC<SlideItemProps> = ({
  narration,
  slidePath,
  voicePath,
  startFrame,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  // publicフォルダからの相対パス（既存のコードと同じ方法）
  const imageFullPath = staticFile(slidePath);
  const voiceFullPath = staticFile(voicePath);

  // デバッグログ
  if (frame % 30 === 0) {
    console.log('SlideItem', {
      slidePath,
      imageFullPath,
      frame,
      startFrame,
      relativeFrame,
      durationFrames,
      isVisible: relativeFrame >= 0 && relativeFrame < durationFrames,
    });
  }

  // このスライドの表示期間外なら何も表示しない
  if (relativeFrame < 0 || relativeFrame >= durationFrames) {
    return null;
  }

  return (
    <AbsoluteFill>
      {/* スライド画像 */}
      <AbsoluteFill>
        <Img
          src={imageFullPath}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            backgroundColor: 'red', // デバッグ用：画像が読み込まれない場合は赤背景が見える
          }}
          onLoad={() => {
            console.log('✅ Image loaded successfully:', imageFullPath);
          }}
          onError={(e) => {
            console.error('❌ Image load error:', slidePath, imageFullPath, e);
          }}
        />
      </AbsoluteFill>

      {/* 字幕（画面下部） */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 60,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontSize: 42,
            padding: '20px 60px',
            borderRadius: 8,
            maxWidth: '90%',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            lineHeight: 1.6,
          }}
        >
          {narration}
        </div>
      </AbsoluteFill>

      {/* 音声 */}
      {relativeFrame === 0 && (
        <Audio src={voiceFullPath} />
      )}
    </AbsoluteFill>
  );
};
