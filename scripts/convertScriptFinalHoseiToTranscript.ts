import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface ParsedTalk {
  slideNumber: string;
  text: string;
  textForDisplay: string;
  pauseAfter?: number;
}

interface SlideGroup {
  slideNumber: string;
  talks: ParsedTalk[];
}

/**
 * script_final_hosei.md をパースして、TypeScript形式の台本に変換する
 */
function parseScriptFinalHosei(filePath: string): SlideGroup[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const slideGroups: Map<string, ParsedTalk[]> = new Map();
  let currentSlideNumber: string | null = null;
  let inNarrator = false;
  let narratorText = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // スライド番号の検出: [S001] なんでもかんでもRAGじゃない
    const slideMatch = line.match(/^\[([A-Z]\d+)\]/);
    if (slideMatch) {
      currentSlideNumber = slideMatch[1];
      continue;
    }

    // NARRATOR: の検出
    if (line === 'NARRATOR:') {
      inNarrator = true;
      narratorText = '';
      continue;
    }

    // ナレーションテキストの収集
    if (inNarrator) {
      if (line === '') {
        // 空行でナレーション終了
        if (narratorText && currentSlideNumber) {
          // 発音修正版（textForDisplay用）と音声合成用（text用）を分離
          const textForDisplay = narratorText;
          const text = convertForVoiceSynthesis(narratorText);

          const talk: ParsedTalk = {
            slideNumber: currentSlideNumber,
            text: text,
            textForDisplay: textForDisplay,
          };

          if (!slideGroups.has(currentSlideNumber)) {
            slideGroups.set(currentSlideNumber, []);
          }
          slideGroups.get(currentSlideNumber)!.push(talk);
        }
        inNarrator = false;
        narratorText = '';
      } else {
        narratorText += (narratorText ? ' ' : '') + line;
      }
    }
  }

  // 最後のナレーションが空行なしで終わっている場合の処理
  if (inNarrator && narratorText && currentSlideNumber) {
    const textForDisplay = narratorText;
    const text = convertForVoiceSynthesis(narratorText);

    const talk: ParsedTalk = {
      slideNumber: currentSlideNumber,
      text: text,
      textForDisplay: textForDisplay,
    };

    if (!slideGroups.has(currentSlideNumber)) {
      slideGroups.set(currentSlideNumber, []);
    }
    slideGroups.get(currentSlideNumber)!.push(talk);
  }

  // Map を SlideGroup 配列に変換（スライド番号順にソート）
  const result: SlideGroup[] = [];
  const sortedSlideNumbers = Array.from(slideGroups.keys()).sort();

  for (const slideNumber of sortedSlideNumbers) {
    result.push({
      slideNumber: slideNumber,
      talks: slideGroups.get(slideNumber)!,
    });
  }

  return result;
}

/**
 * スライド番号からパート番号を判定
 */
function getPartNumber(slideNumber: string): number {
  const num = parseInt(slideNumber.substring(1));
  if (num <= 2) return 1; // パート1: 問題提起 (S001-S002)
  if (num <= 5) return 2; // パート2: 判断基準 (S003-S005)
  return 3; // パート3: まとめ (S006-S009)
}

/**
 * pauseAfterを自動設定
 */
function calculatePauseAfter(
  slideNumber: string,
  isLastInSlide: boolean,
  isLastSlide: boolean,
  nextSlideNumber?: string
): number | undefined {
  if (!isLastInSlide) {
    // スライド内の途中のセリフ → 間なし
    return undefined;
  }

  if (isLastSlide) {
    // 動画の最後 → 5.0秒
    return 5.0;
  }

  // 次のスライドがある場合、パート移行をチェック
  if (nextSlideNumber) {
    const currentPart = getPartNumber(slideNumber);
    const nextPart = getPartNumber(nextSlideNumber);

    if (currentPart !== nextPart) {
      // パート間移行 → 2.5秒
      return 2.5;
    }
  }

  // スライド終わり（パート内） → 1.5秒
  return 1.5;
}

/**
 * 音声合成用にテキストを変換（発音修正）
 * RAG → ラグ、AI → エーアイ など
 */
function convertForVoiceSynthesis(text: string): string {
  let result = text;

  // 発音修正のルール
  const replacements: [RegExp, string][] = [
    [/RAG/g, 'ラグ'],
    [/AI/g, 'エーアイ'],
    [/GPT/g, 'ジーピーティー'],
    [/Claude/g, 'クロード'],
    [/Gemini/g, 'ジェミニ'],
    [/(\d+)〜(\d+)/g, '$1から$2'], // 10〜20 → 10から20
    [/(\d+)～(\d+)/g, '$1から$2'], // 全角チルダも対応
  ];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

/**
 * TypeScript形式の台本ファイルを生成
 */
function generateTranscriptFile(slideGroups: SlideGroup[], outputPath: string): void {
  // pauseAfterを自動設定
  slideGroups.forEach((group, groupIndex) => {
    group.talks.forEach((talk, talkIndex) => {
      const isLastInSlide = talkIndex === group.talks.length - 1;
      const isLastSlide = groupIndex === slideGroups.length - 1;
      const nextSlideNumber = groupIndex < slideGroups.length - 1
        ? slideGroups[groupIndex + 1].slideNumber
        : undefined;

      const pauseAfter = calculatePauseAfter(
        group.slideNumber,
        isLastInSlide,
        isLastSlide,
        nextSlideNumber
      );

      if (pauseAfter !== undefined) {
        talk.pauseAfter = pauseAfter;
      }
    });
  });

  let talksCode = '';
  let talkIndex = 0;

  for (const group of slideGroups) {
    for (const talk of group.talks) {
      // IDを生成（スライド番号-出現順）
      const occurrenceIndex = group.talks.indexOf(talk) + 1;
      const id = `${group.slideNumber}-${occurrenceIndex}`;

      const pauseAfterLine = talk.pauseAfter
        ? `          pauseAfter: ${talk.pauseAfter},\n`
        : '';

      talksCode += `        {\n`;
      talksCode += `          text: '${escapeString(talk.text)}',\n`;
      if (talk.text !== talk.textForDisplay) {
        talksCode += `          textForDisplay: '${escapeString(talk.textForDisplay)}',\n`;
      }
      talksCode += `          speaker: 'ayumi',\n`;
      talksCode += `          id: '${id}',\n`;
      talksCode += `          audioDurationFrames: 0, // 後で update:audio-durations で自動設定\n`;
      talksCode += pauseAfterLine;
      talksCode += `        },\n`;

      talkIndex++;
    }
  }

  const fileContent = `import { VideoConfig } from '../src/yukkuri/yukkuriVideoConfig';

/**
 * このファイルは scripts/convertScriptFinalHoseiToTranscript.ts によって自動生成されました
 * script_final_hosei.md から変換されています
 */
export const MyVideoConfig: VideoConfig = {
  sections: [
    {
      title: 'メインセクション',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      fromFramesMap: {}, // 後で update:audio-durations で自動生成
      totalFrames: 0, // 後で update:audio-durations で自動生成
      kuchipakuMap: { frames: [], amplitude: [] }, // 後で update:audio-durations で自動生成
      talks: [
${talksCode}      ],
    },
  ],
};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`✅ TypeScript台本を生成しました: ${outputPath}`);
  console.log(`   総トーク数: ${talkIndex}`);
}

/**
 * 文字列をエスケープ（シングルクォート内で使用するため）
 */
function escapeString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

/**
 * メイン処理
 */
function main() {
  const scriptPath = path.join(process.cwd(), 'script_final_hosei.md');
  const outputPath = path.join(process.cwd(), 'transcripts', 'myvideo.tsx');

  console.log('📄 script_final_hosei.md を読み込んでいます...');

  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ エラー: ${scriptPath} が見つかりません`);
    process.exit(1);
  }

  const slideGroups = parseScriptFinalHosei(scriptPath);

  console.log(`📊 パース結果:`);
  console.log(`   スライド数: ${slideGroups.length}`);

  let totalTalks = 0;
  for (const group of slideGroups) {
    console.log(`   ${group.slideNumber}: ${group.talks.length} トーク`);
    totalTalks += group.talks.length;
  }
  console.log(`   総トーク数: ${totalTalks}`);

  console.log('\n🔄 TypeScript台本を生成しています...');
  generateTranscriptFile(slideGroups, outputPath);

  console.log('\n✨ 完了しました！');
  console.log('\n次のステップ:');
  console.log('  1. npm run generate:voicepeak    # 音声ファイルを生成');
  console.log('  2. npm run update:audio-durations # 音声の長さを台本に反映');
  console.log('  3. npm start                      # プレビュー確認');
}

main();
