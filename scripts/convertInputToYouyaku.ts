import * as fs from 'fs';
import * as path from 'path';

// input.md を youyaku.md に変換するスクリプト
// 長い文章を短く要約する

const INPUT_FILE = path.join(process.cwd(), 'input.md');
const OUTPUT_FILE = path.join(process.cwd(), 'youyaku.md');

interface Section {
  title: string;
  subsections: {
    subtitle: string;
    content: string;
  }[];
}

function parseInputMd(content: string): Section[] {
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

function shortenText(sections: Section[]): string {
  let output = '';

  for (const section of sections) {
    output += `## ${section.title}\n\n`;

    for (const subsection of section.subsections) {
      output += `### ${subsection.subtitle}\n\n`;
      output += subsection.content;
    }
  }

  return output;
}

function convertInputToYouyaku() {
  try {
    console.log('📖 input.mdを読み込んでいます...');
    const content = fs.readFileSync(INPUT_FILE, 'utf-8');

    console.log('🔄 要約版を作成しています...');
    const sections = parseInputMd(content);

    if (sections.length === 0) {
      console.warn('⚠️ セクションが見つかりませんでした');
      fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
      console.log(`✅ ${OUTPUT_FILE} を生成しました（変換なし）`);
      return;
    }

    const shortened = shortenText(sections);

    console.log('💾 youyaku.mdに保存しています...');
    fs.writeFileSync(OUTPUT_FILE, shortened, 'utf-8');

    console.log(`✅ ${OUTPUT_FILE} を生成しました`);
    console.log(`セクション数: ${sections.length}`);
    const totalSubsections = sections.reduce(
      (sum, s) => sum + s.subsections.length,
      0
    );
    console.log(`サブセクション数: ${totalSubsections}`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

convertInputToYouyaku();
