import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuidv4} from 'uuid';

// movieyou.md を transcripts/myvideo.tsx に変換するスクリプト

const INPUT_FILE = path.join(process.cwd(), 'movieyou.md');
const OUTPUT_FILE = path.join(process.cwd(), 'transcripts', 'myvideo.tsx');

interface Talk {
  text: string;
  speaker: 'reimu' | 'marisa';
  id: string;
  audioDurationFrames: number;
}

interface Section {
  title: string;
  talks: Talk[];
}

function parseMovieyou(content: string): Section[] {
  const lines = content.split('\n');
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentSpeaker: 'reimu' | 'marisa' | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // ## で始まる行はセクションタイトル
    if (line.startsWith('## ')) {
      const title = line.replace('## ', '').trim();
      // セクション番号を除去（例: "1. " や "1-1. " を除去）
      const cleanTitle = title.replace(/^[\d-]+\.\s*/, '');
      currentSection = {
        title: cleanTitle,
        talks: [],
      };
      sections.push(currentSection);
      currentSpeaker = null;
    }
    // ### で始まる行は話者
    else if (line.startsWith('### ')) {
      const speaker = line.replace('### ', '').trim();
      if (speaker.includes('霊夢')) {
        currentSpeaker = 'reimu';
      } else if (speaker.includes('魔理沙')) {
        currentSpeaker = 'marisa';
      }
    }
    // 空行やマークダウン以外の行はセリフとして扱う
    else if (
      line &&
      !line.startsWith('#') &&
      !line.startsWith('```') &&
      currentSection &&
      currentSpeaker
    ) {
      currentSection.talks.push({
        text: line,
        speaker: currentSpeaker,
        id: uuidv4().replace(/-/g, ''),
        audioDurationFrames: 0,
      });
    }
  }

  return sections;
}

function generateTypeScriptConfig(sections: Section[]): string {
  const sectionsCode = sections
    .map((section, sectionIndex) => {
      const talksCode = section.talks
        .map(
          (talk, talkIndex) => `        {
          text: '${talk.text.replace(/'/g, "\\'")}',
          speaker: '${talk.speaker}',
          id: '${talk.id}',
          audioDurationFrames: ${talk.audioDurationFrames},
        }`
        )
        .join(',\n');

      return `    {
      title: '${section.title.replace(/'/g, "\\'")}',
      fromFramesMap: {},
      totalFrames: 0,
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

function convertMovieyouToTranscript() {
  try {
    // movieyou.mdを読み込む
    const content = fs.readFileSync(INPUT_FILE, 'utf-8');

    // パース
    const sections = parseMovieyou(content);

    if (sections.length === 0) {
      console.warn('⚠️ セクションが見つかりませんでした');
      return;
    }

    // TypeScriptコードを生成
    const tsCode = generateTypeScriptConfig(sections);

    // transcripts/myvideo.tsxに書き込む
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {recursive: true});
    }

    fs.writeFileSync(OUTPUT_FILE, tsCode, 'utf-8');

    console.log(`✅ ${OUTPUT_FILE} を生成しました`);
    console.log(`セクション数: ${sections.length}`);
    const totalTalks = sections.reduce((sum, s) => sum + s.talks.length, 0);
    console.log(`総セリフ数: ${totalTalks}`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

convertMovieyouToTranscript();
