import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// コマンドライン引数を解析
const args = process.argv.slice(2);
const FORCE_MODE = args.includes('--force');

// VOICEPEAKのパス
const VOICEPEAK_PATH = 'C:\\voicepeak\\VOICEPEAK\\voicepeak.exe';

// 出力先フォルダ
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'voices');

// script_final_hosei.mdのパス
const SCRIPT_FILE = path.join(process.cwd(), 'script_final_hosei.md');

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
  index: number; // 同じスライド内での順番（1, 2, 3...）
  text: string;
}

// script_final_hosei.mdを解析
function parseScriptFile(): ScriptItem[] {
  const content = fs.readFileSync(SCRIPT_FILE, 'utf-8');
  const lines = content.split('\n');
  const items: ScriptItem[] = [];

  // 各スライドIDの出現回数をカウント
  const idCounts: Record<string, number> = {};

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
      // このIDの出現回数をカウント
      if (!idCounts[currentId]) {
        idCounts[currentId] = 0;
      }
      idCounts[currentId]++;

      items.push({
        id: currentId,
        index: idCounts[currentId],
        text: line.trim(),
      });
      currentId = null;
    }
  }

  return items;
}

// 音声ファイルを生成
function generateVoice(id: string, index: number, text: string, force: boolean = false): void {
  const filename = `${id}-${index}.wav`;
  const outputPath = path.join(OUTPUT_DIR, filename);

  // 既存ファイルがあればスキップ（forceモードでない場合）
  if (fs.existsSync(outputPath) && !force) {
    console.log(`  スキップ: ${filename} (既存)`);
    return;
  }

  if (fs.existsSync(outputPath) && force) {
    console.log(`  上書き: ${filename} - ${text.substring(0, 50)}...`);
  } else {
    console.log(`  生成中: ${filename} - ${text.substring(0, 50)}...`);
  }

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
    console.log(`    成功: ${filename}`);
  } catch (error) {
    console.error(`    失敗: ${filename}`, error);
  }
}

// メイン処理
function main() {
  console.log('=========================================');
  console.log('script_final_hosei.md 音声生成');
  if (FORCE_MODE) {
    console.log('モード: 強制再生成 (--force)');
  } else {
    console.log('モード: 既存ファイルスキップ');
  }
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
    const filename = `${item.id}-${item.index}.wav`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    // forceモードまたは既存ファイルがない場合は生成
    if (FORCE_MODE || !fs.existsSync(outputPath)) {
      try {
        generateVoice(item.id, item.index, item.text, FORCE_MODE);
        successCount++;
      } catch {
        failCount++;
      }
    } else {
      // 既存ファイルがあり、forceモードでない場合はスキップ
      console.log(`  スキップ: ${filename} (既存)`);
      skipCount++;
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
