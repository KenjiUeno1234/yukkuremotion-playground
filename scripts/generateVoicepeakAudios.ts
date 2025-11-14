import * as fs from 'fs';
import * as path from 'path';
import {execSync} from 'child_process';
import {FirstVideoConfig} from '../transcripts/firstvideo';
import {SPEAKER} from '../src/yukkuri/yukkuriVideoConfig';

// VOICEPEAK設定
const VOICEPEAK_PATH = 'C:\\voicepeak\\VOICEPEAK\\voicepeak.exe';
const OUTPUT_DIR = './public/audio/yukkuri';

// 霊夢の声設定
const REIMU_CONFIG = {
  voice: 'Haruno Sora',
  speed: 120,
  pitch: -30,
  pause: 130,
  volume: 80,
  emotion: 'happy=30,sad=10,angry=0,whisper=20,cool=15',
};

// 魔理沙の声設定
const MARISA_CONFIG = {
  voice: 'Haruno Sora',
  speed: 115,
  pitch: -50,
  pause: 130,
  volume: 80,
  emotion: 'happy=15,sad=15,angry=0,whisper=30,cool=35',
};

// VOICEPEAKの存在確認
function checkVoicepeakExists(): boolean {
  try {
    if (!fs.existsSync(VOICEPEAK_PATH)) {
      console.error(`エラー: VOICEPEAKが見つかりません: ${VOICEPEAK_PATH}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error('VOICEPEAKの確認中にエラーが発生しました:', error);
    return false;
  }
}

// 出力ディレクトリ作成
function ensureOutputDirectory() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, {recursive: true});
    console.log(`出力ディレクトリを作成しました: ${OUTPUT_DIR}`);
  }
}

// VOICEPEAK実行
function generateVoice(
  text: string,
  outputPath: string,
  config: typeof REIMU_CONFIG
): boolean {
  const tempFile = `temp_voice_${Date.now()}.txt`;

  try {
    // 一時テキストファイル作成
    fs.writeFileSync(tempFile, text, {encoding: 'utf8'});

    // VOICEPEAKコマンド構築
    const command = [
      `"${VOICEPEAK_PATH}"`,
      `-t "${tempFile}"`,
      `-n "${config.voice}"`,
      `--speed ${config.speed}`,
      `--pitch ${config.pitch}`,
      `--pause ${config.pause}`,
      `--volume ${config.volume}`,
      `-e ${config.emotion}`,
      `-o "${outputPath}"`,
    ].join(' ');

    // 実行
    execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      windowsHide: true,
    });

    // ファイル生成確認
    if (fs.existsSync(outputPath)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('音声生成エラー:', error);
    return false;
  } finally {
    // 一時ファイル削除
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

// メイン処理
async function main() {
  console.log('=========================================');
  console.log('VOICEPEAK ゆっくり音声一括生成');
  console.log('=========================================');
  console.log('');

  // VOICEPEAKチェック
  if (!checkVoicepeakExists()) {
    process.exit(1);
  }

  // 出力ディレクトリ作成
  ensureOutputDirectory();

  let count = 0;
  let success = 0;
  let failed = 0;
  let skipped = 0;

  // 各セクションの音声を生成
  for (const section of FirstVideoConfig.sections) {
    console.log(`\nセクション: ${section.title}`);
    console.log('---');

    for (const talk of section.talks) {
      count++;

      // speaker が reimuAndMarisa の場合
      if (talk.speaker === SPEAKER.reimuAndMarisa && talk.ids) {
        // 霊夢
        const reimuId = talk.ids[0];
        const reimuPath = path.join(OUTPUT_DIR, `${reimuId}.wav`);

        if (fs.existsSync(reimuPath)) {
          console.log(`[${count}] スキップ (既存): 霊夢 - ${talk.text}`);
          skipped++;
        } else {
          console.log(`[${count}] 生成中: 霊夢 - ${talk.text}`);
          if (generateVoice(talk.text, reimuPath, REIMU_CONFIG)) {
            console.log(`    成功: ${reimuPath}`);
            success++;
          } else {
            console.log(`    失敗: ${reimuPath}`);
            failed++;
          }
        }

        count++;

        // 魔理沙
        const marisaId = talk.ids[1];
        const marisaPath = path.join(OUTPUT_DIR, `${marisaId}.wav`);

        if (fs.existsSync(marisaPath)) {
          console.log(`[${count}] スキップ (既存): 魔理沙 - ${talk.text}`);
          skipped++;
        } else {
          console.log(`[${count}] 生成中: 魔理沙 - ${talk.text}`);
          if (generateVoice(talk.text, marisaPath, MARISA_CONFIG)) {
            console.log(`    成功: ${marisaPath}`);
            success++;
          } else {
            console.log(`    失敗: ${marisaPath}`);
            failed++;
          }
        }

        continue;
      }

      // 通常の音声
      if (!talk.id || talk.audioDurationFrames === 0) {
        continue;
      }

      const speakerLabel =
        talk.speaker === SPEAKER.reimu ? '霊夢' : '魔理沙';
      const config =
        talk.speaker === SPEAKER.reimu ? REIMU_CONFIG : MARISA_CONFIG;
      const outputPath = path.join(OUTPUT_DIR, `${talk.id}.wav`);

      // 既存チェック
      if (fs.existsSync(outputPath)) {
        console.log(`[${count}] スキップ (既存): ${speakerLabel} - ${talk.text}`);
        skipped++;
        continue;
      }

      console.log(`[${count}] 生成中: ${speakerLabel} - ${talk.text}`);

      if (generateVoice(talk.text, outputPath, config)) {
        console.log(`    成功: ${outputPath}`);
        success++;
      } else {
        console.log(`    失敗: ${outputPath}`);
        failed++;
      }
    }
  }

  console.log('');
  console.log('=========================================');
  console.log('音声生成完了');
  console.log('=========================================');
  console.log(`合計: ${count} ファイル`);
  console.log(`成功: ${success} ファイル`);
  console.log(`スキップ: ${skipped} ファイル`);
  console.log(`失敗: ${failed} ファイル`);
  console.log('=========================================');
}

main().catch(console.error);
