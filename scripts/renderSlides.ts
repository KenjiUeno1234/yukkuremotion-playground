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
section {
  background: linear-gradient(to bottom right, #ffffff, #e0f0ff);
  color: #003a8c;
  font-size: 32px;
  padding: 60px;
}

h1 {
  text-align: center;
  color: #003a8c;
  font-size: 48px;
  margin-bottom: 40px;
}

ol {
  font-size: 32px;
  line-height: 1.6;
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
  parts.push(`# ${slide.props.text}`);

  return parts.join("\n");
}

// list-3 テンプレートのレンダー関数
function renderList3(slide: List3Slide, isFirst: boolean): string {
  const items = slide.props.items
    .map((item, index) => `${index + 1}. ${item}`)
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
    .map((item, index) => `${index + 1}. ${item}`)
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
    .map((item, index) => `${index + 1}. ${item}`)
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
