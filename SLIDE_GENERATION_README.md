# スライド自動生成システム

## 概要

`script_final.md` から Marp 形式の PDF スライドを完全自動生成するシステムです。

## 実行方法

```bash
npm run generate:slides
```

## 処理フロー

### 手順1: dialogues.json の生成
**スクリプト**: `scripts/step1_generateDialogues.ts`

- `script_final.md` を解析
- `[S001]`, `[S002]` などのセクションIDとNARRATOR:セリフを抽出
- セクションごとにナレーションを配列化
- 出力: `slide-out/dialogues.json`

**フォーマット例**:
```json
[
  {
    "section_id": "S001",
    "slide_index": 1,
    "dialogue": "「自社データならRAGでしょ」と言われがちですが..."
  }
]
```

### 手順2: slides_plan.json の生成
**スクリプト**: `scripts/step2_generateSlidesPlan.ts`

- `dialogues.json` を読み込み
- AIロジックで各セクションに最適なテンプレートを選択:
  - **strong-message**: タイトルスライド（S001など）
  - **list-3**: 3つのポイント
  - **list-4**: 4つのポイント
  - **list-5**: 5つのポイント
- 出力: `slide-out/slides_plan.json`

**テンプレート選択ロジック**:
```typescript
// ナレーション数に基づいて自動選択
- S001 → strong-message（固定）
- 2〜3個 → list-3
- 4個 → list-4
- 5個 → list-5
```

### 手順3: slides_plan.md の生成
**スクリプト**: `scripts/renderSlides.ts`

- `slides_plan.json` を読み込み
- 各テンプレートタイプに応じた Marp Markdown を生成
- Canva互換性を考慮したシンプルなCSS
- 出力: `slide-out/slides_plan.md`

**特徴**:
- 最初のスライドだけにヘッダーとCSS定義
- 2枚目以降は `---` のみで区切り
- text-shadowなし（Canva互換性）
- シンプルなlinear-gradient背景

### 手順4: slides_plan.pdf の生成
**コマンド**: Marp CLI

```bash
npx @marp-team/marp-cli slide-out/slides_plan.md -o slide-out/slides_plan.pdf
```

- Markdown を PDF に変換
- 9ページのスライドPDFを生成

## 生成されるファイル

```
slide-out/
├── dialogues.json      # ナレーションテキスト配列（29エントリ）
├── slides_plan.json    # スライド設計JSON（9スライド）
├── slides_plan.md      # Marp Markdown
└── slides_plan.pdf     # 最終PDF（9ページ）
```

## デザイン仕様

### カラースキーム
- **背景**: 白→淡いブルーのグラデーション (`#ffffff` → `#e0f0ff`)
- **文字色**: 濃いブルー (`#003a8c`)
- **フォントサイズ**:
  - タイトル: 48px
  - 本文: 32px

### レイアウト
- パディング: 60px
- タイトル中央揃え
- リスト形式: Markdownネイティブな番号付きリスト

## Canva互換性

以下の対策により、Canvaでの表示問題を解決:

✅ **修正済み**:
- text-shadowを削除（黒いボックス表示の原因）
- 複雑なHTML構造（div, flexbox）を削除
- シンプルなMarkdown構造のみ使用

## 技術スタック

- **言語**: TypeScript
- **Markdown処理**: Marp
- **PDF生成**: @marp-team/marp-cli
- **実行環境**: Node.js + ts-node

## トラブルシューティング

### エラー: `script_final.md not found`
→ プロジェクトルートに `script_final.md` を配置してください

### PDFに黒いボックスが表示される
→ 既に対策済みです。最新版を使用してください

### スライド数が合わない
→ `script_final.md` のセクションID（[S001]等）とNARRATOR:の数を確認してください

## カスタマイズ

### テンプレートの追加

1. `scripts/renderSlides.ts` に新しいレンダー関数を追加
2. `SlideConfig` 型に新しいテンプレート型を追加
3. `renderSlide()` のswitch文に追加

### CSSのカスタマイズ

`scripts/renderSlides.ts` の `COMMON_STYLES` を編集:

```typescript
const COMMON_STYLES = `<style>
section {
  background: linear-gradient(to bottom right, #ffffff, #e0f0ff);
  color: #003a8c;
  // ... カスタマイズ
}
</style>`;
```

## 評価・品質保証

### ✅ 成功基準

- [x] script_final.md から完全自動生成
- [x] セクションIDとPDFページが1対1対応（9セクション→9ページ）
- [x] Canvaでの正しい表示（黒いボックスなし）
- [x] Marpヘッダー情報の重複なし
- [x] 文字が切れずに全て表示される
- [x] 一括実行コマンド対応（`npm run generate:slides`）

### 📊 パフォーマンス

- 実行時間: 約10〜15秒（全手順）
- 生成スライド数: 9ページ
- ナレーション総数: 29エントリ

## まとめ

このシステムにより、`script_final.md` を編集するだけで、プロフェッショナルなスライドPDFを自動生成できます。手動での作業は一切不要で、Canva互換性も確保されています。
