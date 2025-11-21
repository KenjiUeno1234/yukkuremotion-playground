import * as fs from "fs";
import * as path from "path";

/**
 * 手順1: script_final.md から dialogues.json を生成
 *
 * script_final.md のフォーマット:
 * [S001] タイトル
 * NARRATOR:
 * セリフ1
 *
 * [S001] タイトル
 * NARRATOR:
 * セリフ2
 */

interface DialogueItem {
  section_id: string;
  slide_index: number;
  dialogue: string;
}

function extractDialogues(scriptContent: string): DialogueItem[] {
  const lines = scriptContent.split("\n");
  const dialogues: DialogueItem[] = [];
  const sectionCounts: { [key: string]: number } = {};

  let currentSection: string | null = null;
  let expectingNarrator = false;
  let expectingDialogue = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // セクションIDを検出 [S001] 形式
    const sectionMatch = line.match(/^\[([A-Z0-9]+)\]/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      expectingNarrator = true;
      expectingDialogue = false;

      // セクションカウントを初期化
      if (!sectionCounts[currentSection]) {
        sectionCounts[currentSection] = 0;
      }
      continue;
    }

    // NARRATOR: を検出
    if (line === "NARRATOR:" && currentSection) {
      expectingNarrator = false;
      expectingDialogue = true;
      continue;
    }

    // セリフを検出（空行でない、かつ期待中の場合）
    if (expectingDialogue && line.length > 0 && currentSection) {
      sectionCounts[currentSection]++;
      dialogues.push({
        section_id: currentSection,
        slide_index: sectionCounts[currentSection],
        dialogue: line,
      });
      expectingDialogue = false;
    }
  }

  return dialogues;
}

function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const inputPath = path.join(projectRoot, "script_final.md");
  const outputPath = path.join(projectRoot, "slide-out", "dialogues.json");

  console.log("Step 1: Generating dialogues.json from script_final.md");
  console.log(`Reading: ${inputPath}`);

  // script_final.md を読み込み
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: ${inputPath} not found!`);
    process.exit(1);
  }

  const scriptContent = fs.readFileSync(inputPath, "utf-8");

  // ナレーションを抽出
  const dialogues = extractDialogues(scriptContent);

  console.log(`Extracted ${dialogues.length} dialogue entries`);

  // セクションごとのサマリー
  const sectionSummary: { [key: string]: number } = {};
  dialogues.forEach((d) => {
    sectionSummary[d.section_id] = (sectionSummary[d.section_id] || 0) + 1;
  });

  console.log("\nSections summary:");
  Object.entries(sectionSummary)
    .sort()
    .forEach(([id, count]) => {
      console.log(`  ${id}: ${count} dialogue(s)`);
    });

  // JSONとして出力
  fs.writeFileSync(outputPath, JSON.stringify(dialogues, null, 2), "utf-8");

  console.log(`\n✓ Successfully generated: ${outputPath}`);
}

main();
