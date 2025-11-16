import * as fs from 'fs';
import * as path from 'path';

// input.md を直接 movieyou.md に変換するスクリプト
// 55文字以内で句読点で区切り、話者はayumiのみ

const INPUT_FILE = path.join(process.cwd(), 'input.md');
const OUTPUT_FILE = path.join(process.cwd(), 'movieyou.md');
const MAX_LENGTH = 55;

/**
 * 「」を除いた実際の文字数をカウント
 */
function countCharsWithoutBrackets(text: string): number {
  return text.replace(/[「」]/g, '').length;
}

/**
 * テキストを55文字以内で句読点で分割
 */
function splitText(text: string): string[] {
  const result: string[] = [];
  let currentChunk = '';

  // 句読点で分割
  const sentences = text.split(/([。、])/);

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i];
    if (!part) continue;

    const testChunk = currentChunk + part;
    const charCount = countCharsWithoutBrackets(testChunk);

    if (charCount <= MAX_LENGTH) {
      currentChunk = testChunk;

      // 。で終わる場合は区切る
      if (part === '。') {
        if (currentChunk.trim()) {
          result.push(currentChunk.trim());
          currentChunk = '';
        }
      }
    } else {
      // 55文字を超える場合
      if (currentChunk.trim()) {
        result.push(currentChunk.trim());
      }
      currentChunk = part;
    }
  }

  // 残りを追加
  if (currentChunk.trim()) {
    result.push(currentChunk.trim());
  }

  return result;
}

/**
 * input.mdからmovieyou.mdを生成
 */
function convertInputToMovieyou() {
  try {
    console.log('📖 input.mdを読み込んでいます...');
    const content = fs.readFileSync(INPUT_FILE, 'utf-8');

    console.log('🔄 55文字以内で分割しています...');

    // 空行で分割して段落を取得
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim());

    let output = '';
    let sectionIndex = 1;
    let totalChunks = 0;

    for (const paragraph of paragraphs) {
      // 段落内の改行を削除して1つの文章にする
      const text = paragraph.replace(/\n/g, '');

      // 55文字以内で分割
      const chunks = splitText(text);

      if (chunks.length > 0) {
        output += `## セクション${sectionIndex}\n\n`;

        for (const chunk of chunks) {
          output += `### ayumi\n${chunk}\n\n`;
          totalChunks++;
        }

        sectionIndex++;
      }
    }

    console.log('💾 movieyou.mdに保存しています...');
    fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

    console.log(`✅ ${OUTPUT_FILE} を生成しました`);
    console.log(`セクション数: ${sectionIndex - 1}`);
    console.log(`総チャンク数: ${totalChunks}`);

    // 分割結果の詳細を表示
    console.log('\n📊 分割結果の詳細:');
    const lines = output.split('\n');
    let chunkNum = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('### ayumi')) {
        const nextLine = lines[i + 1];
        if (nextLine && nextLine.trim()) {
          chunkNum++;
          const charCount = countCharsWithoutBrackets(nextLine);
          const displayText = nextLine.length > 40 ? nextLine.substring(0, 40) + '...' : nextLine;
          console.log(`  [${chunkNum}] ${charCount}文字: ${displayText}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

convertInputToMovieyou();
