import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

// 既存のコードと完全に同じ方法で画像を表示する最小限のテスト
export const MinimalTest: React.FC = () => {
  console.log('MinimalTest rendering...');

  // 既存のYukkuriVideoと全く同じ方法で画像を読み込む
  const imagePath = 'image/yukkurilogo.png'; // 既存の画像ファイル
  const slideImagePath = 'slide/S001.png'; // 新しい画像ファイル

  console.log('Image paths:', {
    existing: imagePath,
    new: slideImagePath,
    existingResolved: staticFile(imagePath),
    newResolved: staticFile(slideImagePath),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#333' }}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* 左半分: 既存の動作している画像 */}
        <div style={{ width: '50%', borderRight: '5px solid yellow', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              color: 'yellow',
              fontSize: 20,
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '10px',
              zIndex: 100,
            }}
          >
            既存の画像（動作するはず）
            <br />
            {imagePath}
          </div>
          <Img
            src={staticFile(imagePath)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            onLoad={() => console.log('✅ 既存の画像が読み込まれました')}
            onError={(e) => console.error('❌ 既存の画像の読み込みエラー', e)}
          />
        </div>

        {/* 右半分: 新しいスライド画像 */}
        <div style={{ width: '50%', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              color: 'lime',
              fontSize: 20,
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '10px',
              zIndex: 100,
            }}
          >
            新しいスライド画像
            <br />
            {slideImagePath}
          </div>
          <Img
            src={staticFile(slideImagePath)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: 'red', // 読み込まれない場合は赤背景
            }}
            onLoad={() => console.log('✅ スライド画像が読み込まれました')}
            onError={(e) => console.error('❌ スライド画像の読み込みエラー', e)}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
