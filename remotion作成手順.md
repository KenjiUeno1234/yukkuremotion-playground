# Remotion動画作成 実行手順書

このドキュメントは、**script_final.md** (字幕用) と **script_final_hosei.md** (音声用) から、Remotionでスライド同期型の動画を作成する手順を説明します。

## 前提条件

- Node.js v22以上がインストール済み
- VOICEPEAK がインストール済み（パス: C:\\voicepeak\\VOICEPEAK\\voicepeak.exe）
- 依存パッケージがインストール済み（npm install 実行済み）
- BGMファイル（Floraria.mp3）が `public/bgm/` に配置済み
- スライド画像（S001.png ~ S009.png など）が `public/slide/` に配置済み
- 背景画像（kyaradeza-back.png）が `src/BACKGROUND_LAYER/` または `public/background/` に配置済み
- **重要**: ゆっくりキャラクター画像ファイル名に特殊文字が含まれていないこと
  - `public/jinbutu/` 内のファイル名は `&` などの特殊文字を使わず、ハイフン `-` を使用
  - 正しい例: `eye-open-moth-close.png`
  - 誤った例: `eye-open&moth-close.png` (URLエンコード問題が発生)

---

## 動画作成の全体フロー

```
script_final.md（字幕表示用：RAG、AIなど表示）
script_final_hosei.md（音声生成用：ラグ、エーアイなど発音補正）
    ↓ スクリプトで音声生成
音声ファイル生成（VOICEPEAK）→ public/voices/S001-1.wav, S001-2.wav...
    ↓ スクリプトでスライドショー設定生成
slideshowConfig.ts 生成（字幕はscript_final.md、音声ファイルは既存のwavファイル）
    ↓ npm start
プレビュー確認（http://localhost:3000）
```

**重要な仕様:**
- **字幕**: script_final.md から読み込み（「RAG」「AI」などそのまま表示）
- **音声**: script_final_hosei.md から生成（「ラグ」「エーアイ」など発音補正済み）
- この仕様により、字幕は技術用語を正確に表示しつつ、音声は自然な読み上げを実現

---

## ファイル構成の理解

### script_final.md と script_final_hosei.md の違い

**script_final.md**: 字幕表示用（技術用語そのまま）
- 字幕に「RAG」「AI」などと表示される
- 視聴者が読みやすい形式

**script_final_hosei.md**: 音声生成用（発音修正版）
- 音声合成エンジンが正しく読み上げられるように修正
- 「RAG」→「ラグ」、「AI」→「エーアイ」など

#### フォーマット例:

**script_final.md** (字幕用):
```markdown
[S001] なんでもかんでもRAGじゃない
NARRATOR:
最近、「自社データならRAGでしょ」っていう空気がありますよね。

[S001] なんでもかんでもRAGじゃない
NARRATOR:
でも、実はそうとも限らないんです。
```

**script_final_hosei.md** (音声用):
```markdown
[S001] なんでもかんでもRAGじゃない
NARRATOR:
最近、「自社データならラグでしょ」っていう空気がありますよね。

[S001] なんでもかんでもRAGじゃない
NARRATOR:
でも、実はそうとも限らないんです。
```

#### 重要なポイント:

1. **[S001]などのスライド番号**
   - `public/slide/S001.png` と対応
   - 同じスライド番号が複数回出現する場合、複数のナレーションに分割される
   - 例: [S001]が3回 → S001-1.wav, S001-2.wav, S001-3.wav

2. **NARRATOR部分**
   - script_final.md: 字幕として画面下部に表示される
   - script_final_hosei.md: 音声ファイル生成の元データとなる

3. **PNGスライドとの同期**
   - [S001] → `public/slide/S001.png`
   - [S002] → `public/slide/S002.png`
   - スライド、字幕、音声のタイミングが自動的に同期される

---

## 🚀 自動実行スクリプト（推奨）

全ての手順を自動実行するスクリプトを用意しています。以下のコマンドで一括実行できます：

### 基本的な使い方

```bash
# 方法1: npm スクリプトで実行（推奨）
npm run workflow

# 方法2: バッチファイルを直接実行
run-remotion-workflow.bat

# 方法3: PowerShell スクリプトを直接実行
powershell -ExecutionPolicy Bypass -File run-remotion-workflow.ps1
```

このスクリプトは以下を自動的に実行します：
1. ✅ 前提条件のチェック（必要なファイルの存在確認）
2. 📁 背景画像の準備
3. 🎤 音声ファイルの生成（--force で強制再生成）
4. ⚙️ スライドショー設定ファイルの生成
5. 🎬 プレビューサーバーの起動

**プレビュー確認:**
スクリプト実行後、コンソールに表示されるURLをブラウザで開いてください：
```
Server ready - Local: http://localhost:3000
```
上記のような表示が出たら、そのURLをブラウザで開きます。

### オプション

```bash
# 音声生成をスキップ（既存の音声ファイルを使用）
npm run workflow:skip-voice

# プレビューサーバーの起動をスキップ
npm run workflow:no-preview

# PowerShell で直接実行する場合のオプション
powershell -ExecutionPolicy Bypass -File run-remotion-workflow.ps1 -SkipVoiceGeneration
powershell -ExecutionPolicy Bypass -File run-remotion-workflow.ps1 -SkipPreview
powershell -ExecutionPolicy Bypass -File run-remotion-workflow.ps1 -NoForce  # 既存ファイルをスキップ
```

---

## 手動実行手順（詳細）

自動スクリプトを使わずに手動で実行する場合は、以下の手順に従ってください。

---

## ステップ1: 音声ファイルの生成

### 1-1. script_final_hosei.md から音声を生成

以下のコマンドを実行して、全てのナレーションの音声ファイルを生成します：

```bash
# 推奨: --forceオプションで常に最新版を生成
npx ts-node scripts/generateScriptFinalHoseiVoices.ts --force
```

**--force オプションの使用を推奨する理由:**
- script_final_hosei.mdの内容が常に最新版で音声化される
- 古い音声ファイルとの不一致を防げる
- 字幕と音声の内容が確実に一致する

**--force なしで実行した場合:**
```bash
npx ts-node scripts/generateScriptFinalHoseiVoices.ts
```
- **既存ファイルは自動的にスキップ**される
- script_final_hosei.mdを修正しても音声は更新されない

このコマンドは：
- **script_final_hosei.md** からナレーションテキストを読み取る
- [S001]などのスライドマーカーを解析
- 各ナレーションごとにVOICEPEAKで音声生成
- **public/voices/S001-1.wav, S001-2.wav...** として保存

**生成される音声ファイルの例:**
```
public/voices/
├── S001-1.wav  （「最近、「自社データならラグでしょ」っていう空気がありますよね。」）
├── S001-2.wav  （「でも、実はそうとも限らないんです。」）
├── S001-3.wav  （「まずは、その思い込みを静かにほどいてみましょう。」）
├── S002-1.wav
├── S002-2.wav
└── ...
```

### 1-2. 音声設定のカスタマイズ

音声の設定を変更する場合は、**scripts/generateScriptFinalHoseiVoices.ts** を編集：

```typescript
const VOICE_CONFIG = {
  voice: 'Haruno Sora',
  speed: 120,
  pitch: -30,
  pause: 130,
  volume: 80,
  emotion: 'happy=30,sad=10,angry=0,whisper=20,cool=15',
};
```

### 1-3. 音声の強制再生成

**重要:** 既存の音声ファイルがある場合はスキップされます。script_final_hosei.md を修正した場合は、以下のいずれかの方法で再生成してください。

#### 方法1: --force オプションを使用（推奨）

既存ファイルを強制的に上書きします：

```bash
# 全ファイルを強制再生成
npx ts-node scripts/generateScriptFinalHoseiVoices.ts --force
```

**メリット:**
- ファイルを削除する手間が不要
- script_final_hosei.md を修正後、このコマンド一つで全ファイルを最新化
- 既存ファイルは自動的に上書きされる

#### 方法2: ファイルを削除してから再生成

特定のファイルのみ再生成したい場合：

```bash
# 特定のファイルのみ削除して再生成（例: S001-1.wav）
rm public/voices/S001-1.wav
rm public/voices/S001-2.wav
npx ts-node scripts/generateScriptFinalHoseiVoices.ts

# 全ファイルを削除して再生成
rm -rf public/voices/*.wav
npx ts-node scripts/generateScriptFinalHoseiVoices.ts
```

---

## ステップ2: スライドショー設定ファイルの生成

### 2-1. slideshowConfig.ts を生成

音声ファイル生成後、以下のコマンドでスライドショー設定ファイルを生成します：

```bash
npx ts-node scripts/generateSlideshowConfig.ts
```

このコマンドは：
1. **script_final.md** から字幕テキストを読み込む（RAG、AIなどそのまま）
2. **public/voices/** から音声ファイル（S001-1.wav など）を読み込む
3. 音声ファイルの長さを自動計算（フレーム数に変換）
4. pauseAfter（間）を自動設定:
   - スライド終わり（パート内）: 0.5秒
   - パート間移行: 0.5秒
   - 動画終わり: 3.0秒
5. **src/data/slideshowConfig.ts** を生成

**生成例:**
```typescript
export const slideshowConfig: SlideshowConfig = {
  bgmSrc: 'bgm/Floraria.mp3',
  bgmVolume: 0.2,
  slides: [
    {
      id: "S001",
      slidePath: "slide/S001.png",
      narrations: [
        {
          text: "最近、「自社データならRAGでしょ」っていう空気がありますよね。",  // ← script_final.md から
          voicePath: "voices/S001-1.wav",  // ← script_final_hosei.md から生成
          audioDurationFrames: 128
        },
        {
          text: "でも、実はそうとも限らないんです。",
          voicePath: "voices/S001-2.wav",
          audioDurationFrames: 91
        }
      ],
      totalDurationFrames: 375,  // 音声フレーム数 + pauseAfterフレーム数
      pauseAfter: 0.5
    }
  ],
  totalFrames: 4655
};
```

### 2-2. pauseAfter（間）の調整

pauseAfterの秒数を変更したい場合は、**scripts/generateSlideshowConfig.ts** の `calculatePauseAfter` 関数を編集：

```typescript
function calculatePauseAfter(
  slideId: string,
  isLastSlide: boolean,
  nextSlideId?: string
): number | undefined {
  if (isLastSlide) {
    return 3.0;  // 動画の最後
  }

  if (nextSlideId) {
    const currentPart = getPartNumber(slideId);
    const nextPart = getPartNumber(nextSlideId);
    if (currentPart !== nextPart) {
      return 0.5;  // パート間移行
    }
  }

  return 0.5;  // スライド終わり（パート内）
}
```

---

## ステップ3: プレビューで確認

### 3-1. プレビューサーバーの起動

```bash
npm start
```

**起動確認:**
サーバーが正常に起動すると、以下のようなログが表示されます：
```
Server ready - Local: http://localhost:3000
Built in 1363ms
```

**重要**:
- ログに表示されたURLをメモしてください（ポート番号は3000、3006など変わる可能性があります）
- サーバーが起動するまで10～20秒かかる場合があります

**起動確認方法:**
```bash
# Windowsの場合（別のターミナルで実行）
netstat -ano | findstr :3000
# または
netstat -ano | findstr :3006
```

何か表示されれば、そのポートでサーバーが起動しています。

ブラウザで以下のURLを開きます：
- **ログに表示されたURL**（例: http://localhost:3000 または http://localhost:3006）
- **重要**: 必ずサーバー起動時のログに表示されたURLを使用してください

### 3-2. プレビューでの確認事項

✅ **スライド画像**: PNG画像が正しく表示されるか
✅ **音声再生**: 音声が正しく再生されるか（順次再生、重複なし）
✅ **字幕表示**: 字幕が正しく表示されるか（「RAG」「AI」など技術用語が表示される）
✅ **音声発音**: 音声は「ラグ」「エーアイ」と発音されているか
✅ **同期**: スライドと字幕と音声のタイミングが同期しているか
✅ **口パクアニメーション**:
　　- ナレーション中: ゆっくりの口がパクパク動く
　　- 間（pauseAfter）の部分: ゆっくりの口が閉じて停止している
✅ **間の長さ**: pauseAfterが適切に設定されているか（0.5秒または3秒）
✅ **BGM**: BGMが適切な音量で流れているか（デフォルト20%）

---

## クイックスタート（要約）

### 🚀 自動実行（推奨）

**前提条件:**
- `script_final.md`（字幕用）と `script_final_hosei.md`（音声用）を配置済み
- `public/slide/` にスライドPNG配置済み（S001.png, S002.png など）
- VOICEPEAK がインストール済み（パス: `C:\voicepeak\VOICEPEAK\voicepeak.exe`）
- BGMファイル `public/bgm/Floraria.mp3` が配置済み

**実行コマンド:**

```bash
# 全自動で実行（推奨）
npm run workflow
```

たったこれだけで、以下が自動的に実行されます：
- ✅ 前提条件のチェック
- 📁 背景画像の準備
- 🎤 音声ファイルの生成
- ⚙️ スライドショー設定ファイルの生成
- 🎬 プレビューサーバーの起動

---

### 手動実行（詳細な制御が必要な場合）

```bash
# 0. 背景画像の準備（必要な場合）
#    src/BACKGROUND_LAYER/kyaradeza-back.png を public/background/ にコピー
powershell -Command "Copy-Item -Path 'src/BACKGROUND_LAYER/kyaradeza-back.png' -Destination 'public/background/kyaradeza-back.png' -Force"

# 1. 音声ファイルを強制再生成（script_final_hosei.md から）
#    --force オプションで既存ファイルを上書きし、常に最新版を生成
npx ts-node scripts/generateScriptFinalHoseiVoices.ts --force

# 2. スライドショー設定ファイルを生成（字幕はscript_final.md、音声は最新wav）
npx ts-node scripts/generateSlideshowConfig.ts

# 3. プレビュー確認（バックグラウンドで起動）
npm start

# ブラウザで表示されるURL（例: http://localhost:3006）を開いて確認
```

**注意事項:**
- プレビューサーバーのポート番号は起動時のコンソール出力で確認してください
- サーバーを停止する場合は、Ctrl+C を押してください

**⚠️ 重要な注意事項:**
- **推奨:** 常に`--force`オプションを使用して音声ファイルを最新版に更新することで、字幕と音声の不一致を防げます
- 既存の音声ファイルをそのまま使いたい場合のみ、`--force`なしで実行（既存ファイルはスキップされます）
- 音声ファイルを再生成した場合は、必ずステップ2（slideshowConfig生成）を再実行
- [S001]などのスライド番号は、public/slide/ 内のPNGファイル名と一致させる
- script_final.md と script_final_hosei.md のスライド構造（[S001]の数など）は一致させる

---

## トラブルシューティング

### ブラウザで「このサイトにアクセスできません」と表示される

**症状:**
- プレビューURLを開いても「このサイトにアクセスできません」エラーが出る

**原因:**
- プレビューサーバーが起動していない
- または、間違ったポート番号でアクセスしている

**解決方法:**

1. プレビューサーバーが起動しているか確認：
```bash
# Windowsの場合
netstat -ano | findstr :3000
netstat -ano | findstr :3006
```

2. 何も表示されない場合、サーバーが起動していないので起動：
```bash
npm start
```

3. サーバー起動時のログで正しいURLを確認：
```
Server ready - Local: http://localhost:3000
```

4. ブラウザで表示されたURLを開く（ポート番号は3000または3006など、ログに表示された番号を使用）

### ゆっくりキャラクターが表示されない / 画像読み込みエラー

**症状:**
- ブラウザのコンソールに画像読み込みエラーが表示される
- 例: `Error loading image with src: .../eye-open&moth-close.png`

**原因:**
- 画像ファイル名に特殊文字（`&`など）が含まれている

**解決方法:**

このプロジェクトでは既に修正済みですが、同様の問題を防ぐため：

1. **ファイル名の確認**:
   - `public/jinbutu/` フォルダ内の画像ファイル名を確認
   - 正しいファイル名:
     - `eye-open-moth-close.png` ✅
     - `eye-open-moth-open.png` ✅
     - `eye-close-moth-open.png` ✅
   - 避けるべきファイル名:
     - `eye-open&moth-close.png` ❌（`&`記号）
     - `eye-close&moth-open..png` ❌（二重ピリオド）

2. **ファイル名を修正する場合**:
```bash
cd public/jinbutu
mv "eye-open&moth-close.png" "eye-open-moth-close.png"
mv "eye-open&moth-open.png" "eye-open-moth-open.png"
mv "eye-close&moth-open..png" "eye-close-moth-open.png"
```

3. **コード側の参照も更新**:
   - `src/yukkuri/Face/YukkuriFace.tsx` で新しいファイル名を参照

### 字幕と音声の内容が合わない

**症状:**
- 字幕に「ラグ」と表示されるが、「RAG」と表示されるべき
- または、音声が「アールエージー」と読み上げられる

**原因と解決方法:**

#### ケース1: 字幕が発音補正版になっている
**原因:** generateSlideshowConfig.ts が script_final_hosei.md を読み込んでいる

**解決方法:**
1. scripts/generateSlideshowConfig.ts を確認
2. `SCRIPT_FILE_FOR_SUBTITLE` が `script_final.md` を指しているか確認：
```typescript
const SCRIPT_FILE_FOR_SUBTITLE = path.join(process.cwd(), 'script_final.md');
```
3. 修正後、再生成：
```bash
npx ts-node scripts/generateSlideshowConfig.ts
```

#### ケース2: 音声ファイルが古いバージョンから生成されている
**原因:** script_final_hosei.md を更新したが、音声ファイルが古いまま

**解決方法（推奨）:**
1. --force オプションで音声を強制再生成：
```bash
npx ts-node scripts/generateScriptFinalHoseiVoices.ts --force
```
2. slideshowConfig を再生成：
```bash
npx ts-node scripts/generateSlideshowConfig.ts
```

**解決方法（代替）:**
1. 古い音声ファイルを削除：
```bash
rm public/voices/S001-1.wav
rm public/voices/S001-2.wav
# または全削除
rm -rf public/voices/*.wav
```
2. 音声を再生成：
```bash
npx ts-node scripts/generateScriptFinalHoseiVoices.ts
```
3. slideshowConfig を再生成：
```bash
npx ts-node scripts/generateSlideshowConfig.ts
```

### 音声ファイルが見つからない

**症状:**
- generateSlideshowConfig.ts 実行時に「❌ 音声ファイルが見つかりません」エラー

**原因:**
- script_final.md と script_final_hosei.md のスライド構造が一致していない
- 例: script_final.md には S001 が3回あるが、script_final_hosei.md では2回しかない

**解決方法:**
1. script_final.md と script_final_hosei.md を比較
2. [S001]などのスライドマーカーの出現回数を一致させる
3. 音声ファイルを再生成：
```bash
npx ts-node scripts/generateScriptFinalHoseiVoices.ts
```
4. slideshowConfig を再生成：
```bash
npx ts-node scripts/generateSlideshowConfig.ts
```

### スライドが表示されない

**症状:**
- スライド画像が表示されず、背景だけが表示される

**原因:**
- `public/slide/` にPNGファイルが配置されていない
- スライド番号（[S001]）とファイル名（S001.png）が一致していない

**解決方法:**
1. `public/slide/` フォルダを確認
2. script_final.md の [S001] に対応する S001.png があるか確認
3. ファイル名が大文字・小文字も含めて完全一致しているか確認

### 口パクが間の部分も動いている

**症状:**
- pauseAfter（間）の部分でも口パクアニメーションが続いている

**原因:**
- [YukkuriFace.tsx:51-63](src/yukkuri/Face/YukkuriFace.tsx#L51-L63)で、kuchipakuMapに該当フレームが見つからない場合、`AyumiMouthByFrame[frame]`にフォールバックしていた
- `AyumiMouthByFrame`は全フレームに対して口パクパターン（0または1）が定義されている配列なので、間（pauseAfter）の部分でも口パクが動き続けていた

**解決方法:**
このプロジェクトでは既に修正済みです。[YukkuriFace.tsx:59-60](src/yukkuri/Face/YukkuriFace.tsx#L59-L60)で以下の修正を実施：

```typescript
// kuchipakuMapが提供されているが、該当フレームがない場合は口を閉じる（間の部分）
return 0;
```

**修正の効果:**
- **音声再生中のフレーム**: `kuchipakuMap.amplitude[index]`の値（0または1）で口パク
- **間（pauseAfter）のフレーム**: kuchipakuMapに含まれないため、常に0（口を閉じる）を返す
- `kuchipakuMap.frames.indexOf(frame)`を使用してギャップを正しく処理

### BGM設定

**デフォルト設定：**
- BGMファイル: `Floraria.mp3`
- 配置場所: `public/bgm/Floraria.mp3`
- 音量: 20%（0.2）

**BGM設定のカスタマイズ:**

scripts/generateSlideshowConfig.ts を編集：
```typescript
const fileContent = `// This file is auto-generated by scripts/generateSlideshowConfig.ts
// Do not edit manually

import { SlideshowConfig } from '../types/slideshow';

export const slideshowConfig: SlideshowConfig = {
  bgmSrc: 'bgm/Floraria.mp3',  // BGMファイルのパス
  bgmVolume: 0.2,               // 音量（0.0〜1.0）
  slides: ${JSON.stringify(slides, null, 2)},
  totalFrames: ${totalFrames},
};
`;
```

---

## まとめ

このワークフローにより、**script_final.md（字幕用）** と **script_final_hosei.md（音声用）** から **スライド同期型のRemotionプレビュー動画** を作成できます！

**主な特徴:**
- 字幕と音声で異なるスクリプトファイルを使用
  - 字幕: 技術用語を正確に表示（「RAG」「AI」）
  - 音声: 自然な読み上げ（「ラグ」「エーアイ」）
- スライド番号（[S001]）でPNG、字幕、音声を自動同期
- pauseAfter で適切な間を自動設定（0.5秒または3.0秒）
- **口パクアニメーションが音声に完全同期**
  - 音声再生中: 口パクが動く（8フレームサイクル: 4フレーム開いて4フレーム閉じる）
  - 間（pauseAfter）: 口を閉じて停止
  - YukkuriFace.tsxで`kuchipakuMap`を使用して正確に制御
- **--forceオプションで常に最新版の音声を生成し、字幕と音声の不一致を防止**

**推奨ワークフロー:**

```bash
# 🚀 自動実行（一番簡単！）
npm run workflow
```

または、手動で実行する場合：

```bash
# 0. 背景画像の準備（初回のみ）
powershell -Command "Copy-Item -Path 'src/BACKGROUND_LAYER/kyaradeza-back.png' -Destination 'public/background/kyaradeza-back.png' -Force"

# 1. 音声を最新版で強制再生成
npx ts-node scripts/generateScriptFinalHoseiVoices.ts --force

# 2. スライドショー設定を生成
npx ts-node scripts/generateSlideshowConfig.ts

# 3. プレビュー確認（起動時に表示されるURLをブラウザで開く）
npm start
```

**注意**: 動画のレンダリング（MP4ファイル出力）は実施しません。プレビュー確認までを実施します。

以上で完了です！
