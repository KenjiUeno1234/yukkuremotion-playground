import * as fs from "fs";
import * as path from "path";

/**
 * 手順2: dialogues.json から slides_plan.json を生成
 *
 * AIの判断ロジック:
 * - セクションのナレーション数と内容から最適なテンプレートを選択
 * - strong-message: タイトル的な1文のみ
 * - list-3/4/5: 複数のポイントがある場合
 */

interface DialogueItem {
  section_id: string;
  slide_index: number;
  dialogue: string;
}

type SlideTemplate =
  | "strong-message"
  | "list-3"
  | "list-4"
  | "list-5"
  | "illustrations"
  | "screenshots";

interface SlideConfig {
  section_id: string;
  type: SlideTemplate;
  props: any;
}

function groupBySection(dialogues: DialogueItem[]): {
  [section_id: string]: string[];
} {
  const groups: { [section_id: string]: string[] } = {};

  dialogues.forEach((d) => {
    if (!groups[d.section_id]) {
      groups[d.section_id] = [];
    }
    groups[d.section_id].push(d.dialogue);
  });

  return groups;
}

function extractTitle(sectionId: string, dialogues: string[]): string {
  // セクションIDから一般的なタイトルパターンを推測
  const titlePatterns: { [key: string]: string } = {
    S001: "なんでもかんでもRAGじゃない",
    S002: "よくある相談パターン",
    S003: "問い①：全部参照する？",
    S004: "問い②：入力上限に収まる？",
    S005: "問い③：パターンは何個？",
    S006: "3つの問いまとめ",
    S007: "RAG＝正義ではない",
    S008: "今日のポイント",
    S009: "RAGを使わない勇気を",
  };

  return titlePatterns[sectionId] || sectionId;
}

function selectTemplate(
  sectionId: string,
  dialogues: string[]
): SlideTemplate {
  const count = dialogues.length;

  // セクションS001は強調メッセージとして扱う
  if (sectionId === "S001") {
    return "strong-message";
  }

  // 複数のポイントがある場合はリスト形式
  if (count === 3) {
    return "list-3";
  } else if (count === 4) {
    return "list-4";
  } else if (count === 5) {
    return "list-5";
  } else if (count === 2) {
    return "list-3"; // 2つの場合も3行リストにする
  } else if (count > 5) {
    console.warn(
      `Warning: ${sectionId} has ${count} items. Consider splitting into multiple slides.`
    );
    return "list-5";
  }

  // デフォルトはstrong-message
  return "strong-message";
}

function summarizeDialogues(dialogues: string[]): string[] {
  // ナレーションをそのまま返す（簡潔化は不要）
  return dialogues;
}

function generateSlideConfig(
  sectionId: string,
  dialogues: string[]
): SlideConfig {
  const template = selectTemplate(sectionId, dialogues);
  const title = extractTitle(sectionId, dialogues);

  if (template === "strong-message") {
    return {
      section_id: sectionId,
      type: "strong-message",
      props: {
        text: title,
      },
    };
  }

  // list-3, list-4, list-5
  const summarized = summarizeDialogues(dialogues);

  return {
    section_id: sectionId,
    type: template,
    props: {
      title: title,
      items: summarized,
    },
  };
}

function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const inputPath = path.join(projectRoot, "slide-out", "dialogues.json");
  const outputPath = path.join(projectRoot, "slide-out", "slides_plan.json");

  console.log("Step 2: Generating slides_plan.json from dialogues.json");
  console.log(`Reading: ${inputPath}`);

  // dialogues.json を読み込み
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: ${inputPath} not found!`);
    console.error("Please run step1_generateDialogues.ts first.");
    process.exit(1);
  }

  const dialoguesJson = fs.readFileSync(inputPath, "utf-8");
  const dialogues: DialogueItem[] = JSON.parse(dialoguesJson);

  // セクションごとにグループ化
  const sections = groupBySection(dialogues);
  console.log(`Found ${Object.keys(sections).length} sections`);

  // 各セクションのスライド設定を生成
  const slides: SlideConfig[] = [];

  Object.entries(sections)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([sectionId, dialogueTexts]) => {
      const slide = generateSlideConfig(sectionId, dialogueTexts);
      slides.push(slide);
      console.log(
        `  ${sectionId}: ${slide.type} (${dialogueTexts.length} dialogues)`
      );
    });

  // JSONとして出力
  fs.writeFileSync(outputPath, JSON.stringify(slides, null, 2), "utf-8");

  console.log(`\n✓ Successfully generated: ${outputPath}`);
  console.log(`  Total slides: ${slides.length}`);
}

main();
