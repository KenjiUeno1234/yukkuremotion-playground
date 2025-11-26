import React from 'react';
import { AbsoluteFill, Img, Audio, staticFile, useCurrentFrame } from 'remotion';

export const DiagnosticTest: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#f0f0f0' }}>
      {/* フレーム番号表示 */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: 40,
          fontWeight: 'bold',
          color: 'black',
          zIndex: 1000,
        }}
      >
        Frame: {frame}
      </div>

      {/* 背景画像テスト */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 20,
          color: 'black',
          fontSize: 20,
        }}
      >
        <div>背景画像テスト:</div>
        <Img
          src={staticFile('background/kyaradeza-back.png')}
          style={{
            width: 300,
            height: 200,
            objectFit: 'contain',
            border: '2px solid red',
          }}
          onLoad={() => console.log('✅ 背景画像読み込み成功')}
          onError={(e) => console.error('❌ 背景画像読み込みエラー', e)}
        />
      </div>

      {/* スライド画像テスト */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 350,
          color: 'black',
          fontSize: 20,
        }}
      >
        <div>スライドS001テスト:</div>
        <Img
          src={staticFile('slide/S001.png')}
          style={{
            width: 300,
            height: 200,
            objectFit: 'contain',
            border: '2px solid blue',
          }}
          onLoad={() => console.log('✅ S001画像読み込み成功')}
          onError={(e) => console.error('❌ S001画像読み込みエラー', e)}
        />
      </div>

      {/* 音声テスト */}
      <div
        style={{
          position: 'absolute',
          top: 350,
          left: 20,
          color: 'black',
          fontSize: 20,
        }}
      >
        音声テスト: S001-1.wav (frame 0-143で再生)
      </div>
      {frame >= 0 && frame < 143 && (
        <Audio
          src={staticFile('voices/S001-1.wav')}
          startFrom={0}
          volume={1.0}
          onError={(e) => console.error('❌ 音声再生エラー', e)}
        />
      )}

      {/* BGMテスト */}
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: 20,
          color: 'black',
          fontSize: 20,
        }}
      >
        BGMテスト: Floraria.mp3 (ループ)
      </div>
      <Audio
        loop
        src={staticFile('bgm/Floraria.mp3')}
        volume={0.1}
        onError={(e) => console.error('❌ BGM再生エラー', e)}
      />

      {/* コンソールログ */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          color: 'black',
          fontSize: 16,
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: 10,
        }}
      >
        <div>📊 診断情報:</div>
        <div>- ブラウザのコンソール（F12）でログを確認してください</div>
        <div>- 画像が表示されない場合は赤/青の枠だけが表示されます</div>
        <div>- 音声が聞こえない場合はコンソールでエラーを確認してください</div>
      </div>
    </AbsoluteFill>
  );
};
