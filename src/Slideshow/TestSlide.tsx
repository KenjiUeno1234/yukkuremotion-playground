import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

export const TestSlide: React.FC = () => {
  const imagePath = 'slide/S001.png';
  const fullPath = staticFile(imagePath); // 既存のコードと同じ方法

  console.log('TestSlide:', {
    imagePath,
    fullPath,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: 'blue' }}>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          fontSize: 24,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
        }}
      >
        Testing image: {imagePath}
        <br />
        Full path: {fullPath}
      </div>
      <Img
        src={fullPath}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        onLoad={() => console.log('✅ TestSlide: Image loaded successfully!')}
        onError={(e) => console.error('❌ TestSlide: Image load error:', e)}
      />
    </AbsoluteFill>
  );
};
