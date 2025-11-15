import * as fs from 'fs';
import * as path from 'path';
import getAudioDurationInSeconds from 'get-audio-duration';
import {FPS} from '../src/constants';

// myvideo.tsxの音声の長さを更新するスクリプト

const TRANSCRIPT_FILE = path.join(
  process.cwd(),
  'transcripts',
  'myvideo.tsx'
);

async function updateAudioDurations() {
  try {
    console.log('📖 myvideo.tsxを読み込んでいます...');
    const content = fs.readFileSync(TRANSCRIPT_FILE, 'utf-8');

    // MyVideoConfigをインポートして使用
    const {MyVideoConfig} = require(TRANSCRIPT_FILE.replace('.tsx', ''));

    console.log('🔄 音声ファイルの長さを取得しています...');

    let totalTalks = 0;
    let updatedTalks = 0;

    for (const section of MyVideoConfig.sections) {
      let sectionTotalFrames = 60; // 初期ディレイ（デフォルト60フレーム）

      for (const talk of section.talks) {
        totalTalks++;

        if (talk.id) {
          const audioPath = path.join(
            process.cwd(),
            'public',
            'audio',
            'yukkuri',
            `${talk.id}.wav`
          );

          if (fs.existsSync(audioPath)) {
            const durationSec = await getAudioDurationInSeconds(audioPath);
            const durationFrames = Math.floor(durationSec * FPS);
            talk.audioDurationFrames = durationFrames;
            sectionTotalFrames += durationFrames;
            updatedTalks++;
            console.log(
              `  ✓ ${talk.id}.wav: ${durationSec.toFixed(2)}秒 (${durationFrames}フレーム)`
            );
          } else {
            console.warn(`  ⚠️ 音声ファイルが見つかりません: ${audioPath}`);
          }
        }
      }

      // セクションの総フレーム数を設定
      section.totalFrames = sectionTotalFrames;
      console.log(
        `\nセクション "${section.title}" の総フレーム数: ${sectionTotalFrames}`
      );
    }

    console.log('\n💾 myvideo.tsxを更新しています...');

    // ファイルを再生成
    const updatedContent = generateTypeScriptFile(MyVideoConfig);
    fs.writeFileSync(TRANSCRIPT_FILE, updatedContent, 'utf-8');

    console.log('✅ myvideo.tsxを更新しました');
    console.log(`総セリフ数: ${totalTalks}`);
    console.log(`更新されたセリフ数: ${updatedTalks}`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

function generateTypeScriptFile(config: any): string {
  const sectionsCode = config.sections
    .map((section: any) => {
      const talksCode = section.talks
        .map(
          (talk: any) => `        {
          text: '${talk.text.replace(/'/g, "\\'")}',
          speaker: '${talk.speaker}',
          id: '${talk.id}',
          audioDurationFrames: ${talk.audioDurationFrames},
        }`
        )
        .join(',\n');

      return `    {
      title: '${section.title.replace(/'/g, "\\'")}',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      fromFramesMap: {},
      totalFrames: ${section.totalFrames},
      kuchipakuMap: {frames: [], amplitude: []},
      reimuKuchipakuMap: {frames: [], amplitude: []},
      marisaKuchipakuMap: {frames: [], amplitude: []},
      talks: [
${talksCode}
      ],
    }`;
    })
    .join(',\n');

  return `import {VideoConfig} from '../src/yukkuri/yukkuriVideoConfig';

export const MyVideoConfig: VideoConfig = {
  sections: [
${sectionsCode}
  ],
};
`;
}

updateAudioDurations();
