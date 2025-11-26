import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface StrongMessageSlide {
  section_id: string;
  type: 'strong-message';
  props: {
    text: string;
  };
}

interface ListSlide {
  section_id: string;
  type: 'list-3' | 'list-4' | 'list-5';
  props: {
    title: string;
    items: string[];
  };
}

type Slide = StrongMessageSlide | ListSlide;

interface SlidesData {
  slides: Slide[];
}

function renderStrongMessageSlide(slide: StrongMessageSlide, isFirst: boolean): string {
  if (isFirst) {
    return `---
marp: true
paginate: false
backgroundImage: url('../src/slide-pattern/makimono.png')
theme: default
class: strong-message-slide
---

<style>
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
</style>

<!-- ${slide.section_id} -->
<div class="big-center">
${slide.props.text}
</div>`;
  } else {
    return `---

<!-- _class: strong-message-slide -->

<style>
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
</style>

<!-- ${slide.section_id} -->
<div class="big-center">
${slide.props.text}
</div>`;
  }
}

function renderListSlide(slide: ListSlide, isFirstList: boolean): string {
  const listItems = slide.props.items
    .map((item, index) => {
      return `<div class="list-item">
  <div class="list-index">${index + 1}</div>
  <div>${item}</div>
</div>`;
    })
    .join('\n\n');

  if (isFirstList) {
    return `---

<!-- _class: list-slide -->

<style>
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
</style>

<!-- ${slide.section_id} -->
# ${slide.props.title}

${listItems}`;
  } else {
    return `---

<!-- _class: list-slide -->

<!-- ${slide.section_id} -->
# ${slide.props.title}

${listItems}`;
  }
}

function generateMarkdown(slidesData: SlidesData): string {
  let isFirstSlide = true;
  let isFirstList = true;

  const slideContents = slidesData.slides.map((slide) => {
    let content: string;

    if (slide.type === 'strong-message') {
      content = renderStrongMessageSlide(slide, isFirstSlide);
      isFirstSlide = false;
    } else {
      content = renderListSlide(slide, isFirstList);
      isFirstList = false;
      isFirstSlide = false;
    }

    return content;
  });

  return slideContents.join('\n\n');
}

function main() {
  console.log('📖 Reading slides_plan.json...');
  const jsonPath = path.join(process.cwd(), 'slides_plan.json');
  const slidesData: SlidesData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log('✍️  Generating slides_plan.md...');
  const markdown = generateMarkdown(slidesData);

  const outputDir = path.join(process.cwd(), 'slide-out');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const mdPath = path.join(outputDir, 'slides_plan.md');
  fs.writeFileSync(mdPath, markdown, 'utf-8');
  console.log(`✅ Created: ${mdPath}`);

  console.log('📄 Generating PDF...');
  const pdfPath = path.join(outputDir, 'slides_plan.pdf');

  try {
    execSync(
      `npx @marp-team/marp-cli "${mdPath}" -o "${pdfPath}" --allow-local-files`,
      { stdio: 'inherit' }
    );
    console.log(`✅ Created: ${pdfPath}`);

    // Open PDF
    console.log('🚀 Opening PDF...');
    execSync(`start "${pdfPath}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }

  console.log('🎉 All done!');
}

main();
