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
    items: string[];
  };
};

type List4Slide = {
  section_id: string;
  type: "list-4";
  props: {
    title: string;
    items: string[];
  };
};

type List5Slide = {
  section_id: string;
  type: "list-5";
  props: {
    title: string;
    items: string[];
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

// strong-messageスライド用のCSSスタイル
const STRONG_MESSAGE_STYLES = `<style>
section.strong-message-slide {
  font-family: "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", "Noto Serif JP", serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

section.strong-message-slide .big-center {
  font-size: 64px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.1em;
}
</style>`;

// listスライド用のCSSスタイル
const LIST_SLIDE_STYLES = `<style>
section.list-slide {
  font-family: "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", "Noto Serif JP", serif;
  color: #ffffff;
  font-size: 40px;
  padding: 24px 72px 40px 72px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}

section.list-slide h1 {
  align-self: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 55px;
  margin-top: 8px;
  margin-bottom: 24px;
  letter-spacing: 0.08em;
}

section.list-slide .list-index {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  margin-right: 16px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 32px;
  background: #d0bc89;
  color: #0d0701;
}

section.list-slide .list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>`;

// strong-message テンプレートのレンダー関数
function renderStrongMessage(slide: StrongMessageSlide, isFirst: boolean): string {
  const parts = [];

  if (isFirst) {
    parts.push("---");
    parts.push("marp: true");
    parts.push("paginate: false");
    parts.push("backgroundImage: url('../src/slide-pattern/makimono.png')");
    parts.push("theme: default");
    parts.push("class: strong-message-slide");
    parts.push("---");
    parts.push("");
    parts.push(STRONG_MESSAGE_STYLES);
    parts.push("");
    parts.push(`<!-- ${slide.section_id} -->`);
    parts.push('<div class="big-center">');
    parts.push(slide.props.text);
    parts.push("</div>");
  } else {
    parts.push("---");
    parts.push("");
    parts.push("<!-- _class: strong-message-slide -->");
    parts.push("");
    parts.push(STRONG_MESSAGE_STYLES);
    parts.push("");
    parts.push(`<!-- ${slide.section_id} -->`);
    parts.push('<div class="big-center">');
    parts.push(slide.props.text);
    parts.push("</div>");
  }

  return parts.join("\n");
}

// list テンプレートの共通レンダー関数
function renderListSlide(
  slide: List3Slide | List4Slide | List5Slide,
  isFirstList: boolean
): string {
  const listItems = slide.props.items
    .map((item, index) => {
      return `<div class="list-item">
  <div class="list-index">${index + 1}</div>
  <div>${item}</div>
</div>`;
    })
    .join("\n\n");

  const parts = [];

  if (isFirstList) {
    parts.push("---");
    parts.push("");
    parts.push("<!-- _class: list-slide -->");
    parts.push("");
    parts.push(LIST_SLIDE_STYLES);
    parts.push("");
    parts.push(`<!-- ${slide.section_id} -->`);
    parts.push(`# ${slide.props.title}`);
    parts.push("");
    parts.push(listItems);
  } else {
    parts.push("---");
    parts.push("");
    parts.push("<!-- _class: list-slide -->");
    parts.push("");
    parts.push(`<!-- ${slide.section_id} -->`);
    parts.push(`# ${slide.props.title}`);
    parts.push("");
    parts.push(listItems);
  }

  return parts.join("\n");
}

// list-3 テンプレートのレンダー関数
function renderList3(slide: List3Slide, isFirstList: boolean): string {
  return renderListSlide(slide, isFirstList);
}

// list-4 テンプレートのレンダー関数
function renderList4(slide: List4Slide, isFirstList: boolean): string {
  return renderListSlide(slide, isFirstList);
}

// list-5 テンプレートのレンダー関数
function renderList5(slide: List5Slide, isFirstList: boolean): string {
  return renderListSlide(slide, isFirstList);
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
  const inputPath = path.join(projectRoot, "slides_plan.json");
  const outputPath = path.join(projectRoot, "slide-out", "slides_plan.md");

  console.log("Reading slides_plan.json...");
  const slidesJson = fs.readFileSync(inputPath, "utf-8");
  const slidesData = JSON.parse(slidesJson);
  const slides: SlideConfig[] = slidesData.slides || slidesData;

  console.log(`Found ${slides.length} slides to render.`);

  // 各スライドをMarkdown形式にレンダリング
  let isFirstSlide = true;
  let isFirstList = true;

  const markdownSlides = slides.map((slide) => {
    let rendered: string;

    if (slide.type === "strong-message") {
      rendered = renderSlide(slide, isFirstSlide);
      isFirstSlide = false;
    } else if (slide.type.startsWith("list-")) {
      rendered = renderSlide(slide, isFirstList);
      isFirstList = false;
      isFirstSlide = false;
    } else {
      rendered = renderSlide(slide, isFirstSlide);
      isFirstSlide = false;
    }

    return rendered;
  });

  // 全スライドを結合
  const fullMarkdown = markdownSlides.join("\n\n");

  // Markdownファイルを出力
  fs.writeFileSync(outputPath, fullMarkdown, "utf-8");

  console.log(`✓ Successfully generated: ${outputPath}`);
  console.log(
    `\nNext step: Run "npx @marp-team/marp-cli slide-out/slides_plan.md -o slide-out/slides_plan.pdf --allow-local-files"`
  );
}

main();
