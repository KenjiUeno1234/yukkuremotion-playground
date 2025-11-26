import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

/**
 * スライド作成手順の完全自動化スクリプト
 *
 * 実行手順:
 * 1. script_final.md から dialogues.json を生成
 * 2. dialogues.json から slides_plan.json を生成（AI判断）
 * 3. slides_plan.json から slides_plan.md を生成（Marp形式）
 * 4. slides_plan.md から slides_plan.pdf を生成（Marp CLI）
 */

function executeStep(
  stepName: string,
  command: string,
  cwd: string = process.cwd()
): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`${stepName}`);
  console.log(`${"=".repeat(60)}\n`);

  try {
    execSync(command, {
      cwd,
      stdio: "inherit",
      encoding: "utf-8",
    });
  } catch (error) {
    console.error(`\n❌ Error in ${stepName}`);
    process.exit(1);
  }
}

function checkFileExists(filePath: string, description: string): void {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: ${description} not found at ${filePath}`);
    process.exit(1);
  }
  console.log(`✓ ${description} exists`);
}

function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const scriptFinalPath = path.join(projectRoot, "script_final.md");
  const slideOutDir = path.join(projectRoot, "slide-out");

  console.log("🎬 Starting Slide Generation Process");
  console.log(`Project Root: ${projectRoot}`);

  // 前提条件チェック
  console.log("\n📋 Checking prerequisites...");
  checkFileExists(scriptFinalPath, "script_final.md");

  // slide-outディレクトリの確認・作成
  if (!fs.existsSync(slideOutDir)) {
    console.log("Creating slide-out directory...");
    fs.mkdirSync(slideOutDir, { recursive: true });
  }

  // 手順1: script_final.md → dialogues.json
  executeStep(
    "Step 1: Generate dialogues.json",
    "npx ts-node scripts/step1_generateDialogues.ts",
    projectRoot
  );

  // 手順2: dialogues.json → slides_plan.json
  executeStep(
    "Step 2: Generate slides_plan.json",
    "npx ts-node scripts/step2_generateSlidesPlan.ts",
    projectRoot
  );

  // 手順3: slides_plan.json → slides_plan.md
  executeStep(
    "Step 3: Generate slides_plan.md",
    "npx ts-node scripts/renderSlides.ts",
    projectRoot
  );

  // 手順4: slides_plan.md → slides_plan.pdf
  executeStep(
    "Step 4: Generate slides_plan.pdf",
    "npx @marp-team/marp-cli slide-out/slides_plan.md -o slide-out/slides_plan.pdf --allow-local-files",
    projectRoot
  );

  // 完了メッセージ
  console.log(`\n${"=".repeat(60)}`);
  console.log("🎉 Slide Generation Complete!");
  console.log(`${"=".repeat(60)}\n`);

  console.log("Generated files:");
  console.log(`  📄 ${path.join(slideOutDir, "dialogues.json")}`);
  console.log(`  📄 ${path.join(slideOutDir, "slides_plan.json")}`);
  console.log(`  📄 ${path.join(slideOutDir, "slides_plan.md")}`);
  console.log(`  📄 ${path.join(slideOutDir, "slides_plan.pdf")}`);

  console.log("\n✓ All steps completed successfully!");

  // PDFを自動で開く
  console.log("\n🚀 Opening PDF...");
  const pdfPath = path.join(slideOutDir, "slides_plan.pdf");
  try {
    execSync(`start "${pdfPath}"`, { stdio: "inherit" });
  } catch (error) {
    console.log("⚠️  Could not auto-open PDF. Please open it manually.");
  }
}

main();
