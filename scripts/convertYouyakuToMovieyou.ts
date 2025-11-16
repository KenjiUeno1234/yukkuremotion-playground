import * as fs from 'fs';
import * as path from 'path';

// youyaku.md を movieyou.md に変換するスクリプト
// 説明文をayumiの解説形式に変換する

const INPUT_FILE = path.join(process.cwd(), 'youyaku.md');
const OUTPUT_FILE = path.join(process.cwd(), 'movieyou.md');

interface Section {
  title: string;
  subsections: {
    subtitle: string;
    content: string;
  }[];
}

function parseYouyakuMd(content: string): Section[] {
  const lines = content.split('\n');
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentSubsection: {subtitle: string; content: string} | null = null;

  for (const line of lines) {
    // ## で始まる行はセクション
    if (line.startsWith('## ')) {
      if (currentSection && currentSubsection) {
        currentSection.subsections.push(currentSubsection);
      }
      currentSection = {
        title: line.replace('## ', '').trim(),
        subsections: [],
      };
      sections.push(currentSection);
      currentSubsection = null;
    }
    // ### で始まる行はサブセクション
    else if (line.startsWith('### ')) {
      if (currentSection && currentSubsection) {
        currentSection.subsections.push(currentSubsection);
      }
      currentSubsection = {
        subtitle: line.replace('### ', '').trim(),
        content: '',
      };
    }
    // その他の行はコンテンツ
    else if (line.trim() && currentSubsection) {
      currentSubsection.content += line + '\n';
    }
  }

  // 最後のサブセクションを追加
  if (currentSection && currentSubsection) {
    currentSection.subsections.push(currentSubsection);
  }

  return sections;
}

function convertToMovieyou(sections: Section[]): string {
  let output = '';

  for (const section of sections) {
    output += `## ${section.title}\n\n`;

    for (const subsection of section.subsections) {
      // 内容を整形（改行を削除してスペースで結合、末尾のスペースを削除）
      const cleanContent = subsection.content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line)
        .join('')
        .replace(/\s+$/g, '');

      if (!cleanContent) continue;

      const speaker = 'ayumi';
      output += `### ${speaker}\n`;

      // サブタイトルを含めて解説形式に
      const subtitle = subsection.subtitle;
      output += `${subtitle}について説明するわね。${cleanContent}\n\n`;
    }
  }

  return output;
}

function convertYouyakuToMovieyou() {
  try {
    console.log('📖 youyaku.mdを読み込んでいます...');
    const content = fs.readFileSync(INPUT_FILE, 'utf-8');

    console.log('🔄 解説形式に変換しています...');
    const sections = parseYouyakuMd(content);

    if (sections.length === 0) {
      console.warn('⚠️ セクションが見つかりませんでした');
      fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
      console.log(`✅ ${OUTPUT_FILE} を生成しました（変換なし）`);
      return;
    }

    const movieyou = convertToMovieyou(sections);

    console.log('💾 movieyou.mdに保存しています...');
    fs.writeFileSync(OUTPUT_FILE, movieyou, 'utf-8');

    console.log(`✅ ${OUTPUT_FILE} を生成しました`);
    console.log(`セクション数: ${sections.length}`);
    const totalSubsections = sections.reduce(
      (sum, s) => sum + s.subsections.length,
      0
    );
    console.log(`会話数: ${totalSubsections}`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

convertYouyakuToMovieyou();
