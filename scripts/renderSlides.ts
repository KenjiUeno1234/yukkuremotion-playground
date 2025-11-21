import * as fs from "fs";
import * as path from "path";

// スライド設計JSONの型定義
type StrongMessageSlide = {
  section_id: string;
  type: "strong-message";
  props: {
    text: string;
  };
};

type List3Slide = {
  section_id: string;
  type: "list-3";
  props: {
    title: string;
    items: [string, string, string];
  };
};

type List4Slide = {
  section_id: string;
  type: "list-4";
  props: {
    title: string;
    items: [string, string, string, string];
  };
};

type List5Slide = {
  section_id: string;
  type: "list-5";
  props: {
    title: string;
    items: [string, string, string, string, string];
  };
};

type IllustrationsSlide = {
  section_id: string;
  type: "illustrations";
  props: {
    title: string;
    imagePrompt: string;
    caption?: string;
  };
};

type ScreenshotsSlide = {
  section_id: string;
  type: "screenshots";
  props: {
    title: string;
    target: string;
    note: string;
  };
};

type SlideConfig =
  | StrongMessageSlide
  | List3Slide
  | List4Slide
  | List5Slide
  | IllustrationsSlide
  | ScreenshotsSlide;

// 共通のCSSスタイル
const COMMON_STYLES = `<style>
/* 全体：左上寄せ＋淡いブルー背景＋濃いブルー文字 */
section {
  background: radial-gradient(circle at top left,
    #ffffff 0%,
    #f4f8ff 40%,
    #e0efff 100%);
  color: #003a8c;
  text-shadow: 0 0 6px rgba(255,255,255,0.8);
  font-size: 36px;
  padding: 40px 60px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
}

/* タイトル */
h1 {
  align-self: center;
  color: #003a8c;
  font-weight: 700;
  font-size: 52px;
  margin-top: 0px;
  margin-bottom: 20px;
}

h2, h3 {
  color: #003a8c;
  font-weight: 700;
}

/* 丸番号アイコン */
.list-index {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  margin-right: 14px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 28px;
  background: #ffeb99;   /* 明るいイエロー */
  color: #003a8c;        /* 濃いブルー文字 */
  flex-shrink: 0;
}

/* リスト1行のブロック */
.list-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  line-height: 1.4;
}

/* 中央のメッセージ（strong-message用） */
.big-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-size: 60px;
  font-weight: 700;
  color: #003a8c;
  text-shadow: 0 0 8px rgba(255,255,255,0.9);
  text-align: center;
  padding: 40px;
}
</style>
`;

// strong-message テンプレートのレンダー関数
function renderStrongMessage(slide: StrongMessageSlide, isFirst: boolean): string {
  const parts = [];

  if (isFirst) {
    parts.push("---");
    parts.push("marp: true");
    parts.push("theme: default");
    parts.push("paginate: true");
    parts.push("---");
    parts.push("");
    parts.push(COMMON_STYLES);
  } else {
    parts.push("---");
  }

  parts.push("");
  parts.push(`<!-- ${slide.section_id} -->`);
  parts.push("");
  parts.push('<div class="big-center">');
  parts.push(slide.props.text);
  parts.push("</div>");

  return parts.join("\n");
}

// list-3 テンプレートのレンダー関数
function renderList3(slide: List3Slide, isFirst: boolean): string {
  const items = slide.props.items
    .map(
      (item, index) => `<div class="list-item">
  <div class="list-index">${index + 1}</div>
  <div>${item}</div>
</div>`
    )
    .join("\n\n");

  const parts = [];

  if (isFirst) {
    parts.push("---");
    parts.push("marp: true");
    parts.push("theme: default");
    parts.push("paginate: true");
    parts.push("---");
    parts.push("");
    parts.push(COMMON_STYLES);
  } else {
    parts.push("---");
  }

  parts.push("");
  parts.push(`<!-- ${slide.section_id} -->`);
  parts.push("");
  parts.push(`# ${slide.props.title}`);
  parts.push("");
  parts.push(items);

  return parts.join("\n");
}

// list-4 テンプレートのレンダー関数
function renderList4(slide: List4Slide, isFirst: boolean): string {
  const items = slide.props.items
    .map(
      (item, index) => `<div class="list-item">
  <div class="list-index">${index + 1}</div>
  <div>${item}</div>
</div>`
    )
    .join("\n\n");

  const parts = [];

  if (isFirst) {
    parts.push("---");
    parts.push("marp: true");
    parts.push("theme: default");
    parts.push("paginate: true");
    parts.push("---");
    parts.push("");
    parts.push(COMMON_STYLES);
  } else {
    parts.push("---");
  }

  parts.push("");
  parts.push(`<!-- ${slide.section_id} -->`);
  parts.push("");
  parts.push(`# ${slide.props.title}`);
  parts.push("");
  parts.push(items);

  return parts.join("\n");
}

// list-5 テンプレートのレンダー関数
function renderList5(slide: List5Slide, isFirst: boolean): string {
  const items = slide.props.items
    .map(
      (item, index) => `<div class="list-item">
  <div class="list-index">${index + 1}</div>
  <div>${item}</div>
</div>`
    )
    .join("\n\n");

  const parts = [];

  if (isFirst) {
    parts.push("---");
    parts.push("marp: true");
    parts.push("theme: default");
    parts.push("paginate: true");
    parts.push("---");
    parts.push("");
    parts.push(COMMON_STYLES);
  } else {
    parts.push("---");
  }

  parts.push("");
  parts.push(`<!-- ${slide.section_id} -->`);
  parts.push("");
  parts.push(`# ${slide.props.title}`);
  parts.push("");
  parts.push(items);

  return parts.join("\n");
}

// illustrations テンプレートのレンダー関数
function renderIllustrations(slide: IllustrationsSlide, isFirst: boolean): string {
  const parts = [];

  if (isFirst) {
    parts.push("---");
    parts.push("marp: true");
    parts.push("theme: default");
    parts.push("paginate: true");
    parts.push("---");
    parts.push("");
    parts.push(COMMON_STYLES);
  } else {
    parts.push("---");
  }

  parts.push("");
  parts.push(`<!-- ${slide.section_id} -->`);
  parts.push("");
  parts.push(`# ${slide.props.title}`);
  parts.push("");
  parts.push(`<!-- Image Prompt: ${slide.props.imagePrompt} -->`);
  if (slide.props.caption) {
    parts.push("");
    parts.push(slide.props.caption);
  }

  return parts.join("\n");
}

// screenshots テンプレートのレンダー関数
function renderScreenshots(slide: ScreenshotsSlide, isFirst: boolean): string {
  const parts = [];

  if (isFirst) {
    parts.push("---");
    parts.push("marp: true");
    parts.push("theme: default");
    parts.push("paginate: true");
    parts.push("---");
    parts.push("");
    parts.push(COMMON_STYLES);
  } else {
    parts.push("---");
  }

  parts.push("");
  parts.push(`<!-- ${slide.section_id} -->`);
  parts.push("");
  parts.push(`# ${slide.props.title}`);
  parts.push("");
  parts.push(`<!-- Screenshot Target: ${slide.props.target} -->`);
  parts.push(`<!-- Note: ${slide.props.note} -->`);

  return parts.join("\n");
}

// メインのレンダー関数
function renderSlide(slide: SlideConfig, isFirst: boolean): string {
  switch (slide.type) {
    case "strong-message":
      return renderStrongMessage(slide, isFirst);
    case "list-3":
      return renderList3(slide, isFirst);
    case "list-4":
      return renderList4(slide, isFirst);
    case "list-5":
      return renderList5(slide, isFirst);
    case "illustrations":
      return renderIllustrations(slide, isFirst);
    case "screenshots":
      return renderScreenshots(slide, isFirst);
    default:
      throw new Error(`Unknown slide type: ${(slide as any).type}`);
  }
}

// メイン処理
function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const inputPath = path.join(projectRoot, "slide-out", "slides_plan.json");
  const outputPath = path.join(projectRoot, "slide-out", "slides_plan.md");

  console.log("Reading slides_plan.json...");
  const slidesJson = fs.readFileSync(inputPath, "utf-8");
  const slides: SlideConfig[] = JSON.parse(slidesJson);

  console.log(`Found ${slides.length} slides to render.`);

  // 各スライドをMarkdown形式にレンダリング
  const markdownSlides = slides.map((slide, index) => renderSlide(slide, index === 0));

  // 全スライドを結合
  const fullMarkdown = markdownSlides.join("\n\n");

  // Markdownファイルを出力
  fs.writeFileSync(outputPath, fullMarkdown, "utf-8");

  console.log(`✓ Successfully generated: ${outputPath}`);
  console.log(
    `\nNext step: Run "npx @marp-team/marp-cli slide-out/slides_plan.md -o slide-out/slides_plan.pdf"`
  );
}

main();
