import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// VOICEPEAKのパス
const VOICEPEAK_PATH = 'C:\\voicepeak\\VOICEPEAK\\voicepeak.exe';

// 出力先フォルダ
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'voices');

// script_final.mdのパス
const SCRIPT_FILE = path.join(process.cwd(), 'script_final.md');

// VOICEPEAKの設定
const VOICE_CONFIG = {
  voice: 'Haruno Sora',
  speed: 120,
  pitch: -30,
  pause: 130,
  volume: 80,
  emotion: 'happy=30,sad=10,angry=0,whisper=20,cool=15',
};

interface ScriptItem {
  id: string;
  text: string;
}

// script_final.mdを解析
function parseScriptFile(): ScriptItem[] {
  const content = fs.readFileSync(SCRIPT_FILE, 'utf-8');
  const lines = content.split('\n');
  const items: ScriptItem[] = [];

  let currentId: string | null = null;

  for (const line of lines) {
    // [S001] などのIDを検出
    const idMatch = line.match(/\[([S]\d+)\]/);
    if (idMatch) {
      currentId = idMatch[1];
      continue;
    }

    // NARRATOR: の次の行がテキスト
    if (line.trim().startsWith('NARRATOR:')) {
      continue;
    }

    // テキスト行を取得
    if (currentId && line.trim() && !line.trim().startsWith('[')) {
      items.push({
        id: currentId,
        text: line.trim(),
      });
      currentId = null;
    }
  }

  return items;
}

// 音声ファイルを生成
function generateVoice(id: string, text: string): void {
  const outputPath = path.join(OUTPUT_DIR, `${id}.wav`);

  // 既存ファイルがあればスキップ
  if (fs.existsSync(outputPath)) {
    console.log(`  スキップ: ${id}.wav (既存)`);
    return;
  }

  console.log(`  生成中: ${id} - ${text.substring(0, 50)}...`);

  const command = [
    `"${VOICEPEAK_PATH}"`,
    `-s "${text}"`,
    `-n "${VOICE_CONFIG.voice}"`,
    `-o "${outputPath}"`,
    `-e "${VOICE_CONFIG.emotion}"`,
    `--speed ${VOICE_CONFIG.speed}`,
    `--pitch ${VOICE_CONFIG.pitch}`,
    `--pause ${VOICE_CONFIG.pause}`,
  ].join(' ');

  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`    成功: ${id}.wav`);
  } catch (error) {
    console.error(`    失敗: ${id}.wav`, error);
  }
}

// メイン処理
function main() {
  console.log('=========================================');
  console.log('script_final.md 音声生成');
  console.log('=========================================\n');

  // 出力フォルダを確認
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // スクリプトを解析
  const items = parseScriptFile();

  console.log(`解析結果: ${items.length}件\n`);

  // 音声を生成
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const item of items) {
    const outputPath = path.join(OUTPUT_DIR, `${item.id}.wav`);

    if (fs.existsSync(outputPath)) {
      skipCount++;
    } else {
      try {
        generateVoice(item.id, item.text);
        successCount++;
      } catch {
        failCount++;
      }
    }
  }

  console.log('\n=========================================');
  console.log('音声生成完了');
  console.log('=========================================');
  console.log(`合計: ${items.length} ファイル`);
  console.log(`成功: ${successCount} ファイル`);
  console.log(`スキップ: ${skipCount} ファイル`);
  console.log(`失敗: ${failCount} ファイル`);
  console.log('=========================================');
}

main();
