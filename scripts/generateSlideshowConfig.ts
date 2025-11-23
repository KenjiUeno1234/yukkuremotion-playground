import * as fs from 'fs';
import * as path from 'path';
import { getAudioDurationInSeconds } from 'get-audio-duration';

// 字幕表示用（RAG、AIなど表示）
const SCRIPT_FILE_FOR_SUBTITLE = path.join(process.cwd(), 'script_final.md');
// 音声ファイル名のベース（script_final_hosei.mdから生成された音声ファイルを使用）
const VOICES_DIR = path.join(process.cwd(), 'public', 'voices');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'slideshowConfig.ts');
const FPS = 30;

interface NarrationSegment {
  text: string;
  voicePath: string;
  audioDurationFrames: number;
  pauseAfter?: number;
}

interface SlideItem {
  id: string;
  slidePath: string;
  narrations: NarrationSegment[];
  totalDurationFrames: number;
  pauseAfter?: number;
}

interface ParsedScript {
  id: string;
  index: number;
  narration: string;
}

// script_final.md（字幕用）を解析
function parseScriptFile(): ParsedScript[] {
  const content = fs.readFileSync(SCRIPT_FILE_FOR_SUBTITLE, 'utf-8');
  const lines = content.split('\n');
  const items: ParsedScript[] = [];

  // 各スライドIDの出現回数をカウント
  const idCounts: Record<string, number> = {};

  let currentId: string | null = null;

  for (const line of lines) {
    const idMatch = line.match(/\[([S]\d+)\]/);
    if (idMatch) {
      currentId = idMatch[1];
      continue;
    }

    if (line.trim().startsWith('NARRATOR:')) {
      continue;
    }

    if (currentId && line.trim() && !line.trim().startsWith('[')) {
      // このIDの出現回数をカウント
      if (!idCounts[currentId]) {
        idCounts[currentId] = 0;
      }
      idCounts[currentId]++;

      items.push({
        id: currentId,
        index: idCounts[currentId],
        narration: line.trim(),
      });
      currentId = null;
    }
  }

  return items;
}

// 音声ファイルの長さを取得
async function getAudioDuration(audioPath: string): Promise<number> {
  try {
    const duration = await getAudioDurationInSeconds(audioPath);
    return Math.ceil(duration * FPS);
  } catch (error) {
    console.error(`音声ファイルの読み込みに失敗: ${audioPath}`);
    return 0;
  }
}

// スライド番号からパート番号を判定
function getPartNumber(slideId: string): number {
  const num = parseInt(slideId.substring(1));
  if (num <= 2) return 1; // パート1: 問題提起 (S001-S002)
  if (num <= 5) return 2; // パート2: 判断基準 (S003-S005)
  return 3; // パート3: まとめ (S006-S009)
}

// pauseAfterを自動設定
function calculatePauseAfter(
  slideId: string,
  isLastSlide: boolean,
  nextSlideId?: string
): number | undefined {
  if (isLastSlide) {
    // 動画の最後 → 3.0秒
    return 3.0;
  }

  // 次のスライドがある場合、パート移行をチェック
  if (nextSlideId) {
    const currentPart = getPartNumber(slideId);
    const nextPart = getPartNumber(nextSlideId);

    if (currentPart !== nextPart) {
      // パート間移行 → 1.5秒
      return 1.5;
    }
  }

  // スライド終わり（パート内） → 1.5秒
  return 1.5;
}

// メイン処理
async function main() {
  console.log('=========================================');
  console.log('スライドショー設定ファイル生成');
  console.log('=========================================\n');

  const parsedItems = parseScriptFile();
  console.log(`解析結果: ${parsedItems.length}件\n`);

  // 同じスライドIDをグループ化
  const groupedBySlide: Record<string, ParsedScript[]> = {};
  for (const item of parsedItems) {
    if (!groupedBySlide[item.id]) {
      groupedBySlide[item.id] = [];
    }
    groupedBySlide[item.id].push(item);
  }

  const slides: SlideItem[] = [];
  let totalFrames = 0;

  // スライドIDをソートして処理
  const slideIds = Object.keys(groupedBySlide).sort();

  for (let slideIndex = 0; slideIndex < slideIds.length; slideIndex++) {
    const slideId = slideIds[slideIndex];
    const narrationItems = groupedBySlide[slideId];
    const narrations: NarrationSegment[] = [];
    let slideTotalFrames = 0;

    console.log(`\n${slideId}:`);

    for (const item of narrationItems) {
      const voiceFilePath = path.join(VOICES_DIR, `${item.id}-${item.index}.wav`);

      if (!fs.existsSync(voiceFilePath)) {
        console.error(`  ❌ 音声ファイルが見つかりません: ${item.id}-${item.index}.wav`);
        continue;
      }

      const audioDurationFrames = await getAudioDuration(voiceFilePath);
      console.log(`  ✓ ${item.id}-${item.index}: ${(audioDurationFrames / FPS).toFixed(2)}秒 (${audioDurationFrames}フレーム)`);

      narrations.push({
        text: item.narration,
        voicePath: `voices/${item.id}-${item.index}.wav`,
        audioDurationFrames,
      });

      slideTotalFrames += audioDurationFrames;
    }

    // pauseAfterを計算
    const isLastSlide = slideIndex === slideIds.length - 1;
    const nextSlideId = slideIndex < slideIds.length - 1 ? slideIds[slideIndex + 1] : undefined;
    const pauseAfter = calculatePauseAfter(slideId, isLastSlide, nextSlideId);

    // pauseAfterをフレーム数に変換してtotalDurationFramesに追加
    const pauseAfterFrames = pauseAfter ? Math.floor(pauseAfter * FPS) : 0;
    const totalDurationWithPause = slideTotalFrames + pauseAfterFrames;

    slides.push({
      id: slideId,
      slidePath: `slide/${slideId}.png`,
      narrations,
      totalDurationFrames: totalDurationWithPause,
      pauseAfter,
    });

    totalFrames += totalDurationWithPause;

    if (pauseAfter) {
      console.log(`  ⏸️  pauseAfter: ${pauseAfter}秒 (${pauseAfterFrames}フレーム)`);
    }
  }

  console.log(`\n総フレーム数: ${totalFrames} (${(totalFrames / FPS).toFixed(2)}秒)\n`);

  // TypeScriptファイルを生成
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileContent = `// This file is auto-generated by scripts/generateSlideshowConfig.ts
// Do not edit manually

import { SlideshowConfig } from '../types/slideshow';

export const slideshowConfig: SlideshowConfig = {
  bgmSrc: 'bgm/Floraria.mp3',
  bgmVolume: 0.2,
  slides: ${JSON.stringify(slides, null, 2)},
  totalFrames: ${totalFrames},
};
`;

  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');

  console.log('=========================================');
  console.log('✅ スライドショー設定ファイルを生成しました');
  console.log(`出力先: ${OUTPUT_FILE}`);
  console.log('=========================================');
}

main();
