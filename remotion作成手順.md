# Remotion動画作成 実行手順書

このドキュメントは、**script_final.md** (字幕用) と **script_final_hosei.md** (音声用) から、Remotionでスライド同期型の動画を作成する手順を説明します。

## 前提条件

- Node.js v22以上がインストール済み
- VOICEPEAK がインストール済み（パス: C:\\voicepeak\\VOICEPEAK\\voicepeak.exe）
- 依存パッケージがインストール済み（npm install 実行済み）
- BGMファイル（Floraria.mp3）が `public/bgm/` に配置済み
- スライド画像（S001.png ~ S009.png など）が `public/slide/` に配置済み

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
   - スライド終わり（パート内）: 1.5秒
   - パート間移行: 1.5秒
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
      pauseAfter: 1.5
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
      return 1.5;  // パート間移行
    }
  }

  return 1.5;  // スライド終わり（パート内）
}
```

---

## ステップ3: プレビューで確認

### 3-1. プレビューサーバーの起動

```bash
npm start
```

ブラウザで以下のURLを開きます：
- **http://localhost:3000**

### 3-2. プレビューでの確認事項

✅ スライド画像（PNG）が正しく表示されるか
✅ 音声が正しく再生されるか（順次再生、重複なし）
✅ 字幕が正しく表示されるか（「RAG」「AI」など技術用語が表示される）
✅ 音声は「ラグ」「エーアイ」と発音されているか
✅ スライドと字幕と音声のタイミングが同期しているか
✅ キャラクターの口パクが音声に合っているか
✅ 間（pauseAfter）が適切に設定されているか
✅ BGMが適切な音量で流れているか

---

## クイックスタート（要約）

```bash
# 前提: script_final.md（字幕用）と script_final_hosei.md（音声用）を配置済み
# 前提: public/slide/ にスライドPNG配置済み

# 1. 音声ファイルを強制再生成（script_final_hosei.md から）
#    --force オプションで既存ファイルを上書きし、常に最新版を生成
npx ts-node scripts/generateScriptFinalHoseiVoices.ts --force

# 2. スライドショー設定ファイルを生成（字幕はscript_final.md、音声は最新wav）
npx ts-node scripts/generateSlideshowConfig.ts

# 3. プレビュー確認
npm start
```

**⚠️ 重要な注意事項:**
- **推奨:** 常に`--force`オプションを使用して音声ファイルを最新版に更新することで、字幕と音声の不一致を防げます
- 既存の音声ファイルをそのまま使いたい場合のみ、`--force`なしで実行（既存ファイルはスキップされます）
- 音声ファイルを再生成した場合は、必ずステップ2（slideshowConfig生成）を再実行
- [S001]などのスライド番号は、public/slide/ 内のPNGファイル名と一致させる
- script_final.md と script_final_hosei.md のスライド構造（[S001]の数など）は一致させる

---

## トラブルシューティング

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
- YukkuriFace.tsx の kuchipakuMap 処理が正しくない

**解決方法:**
このプロジェクトでは既に修正済みです。src/yukkuri/Face/YukkuriFace.tsx で `kuchipakuMap.frames.indexOf(frame)` を使用してギャップを正しく処理しています。

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
- pauseAfter で適切な間を自動設定
- 口パクアニメーションが音声に同期し、間では停止
- **--forceオプションで常に最新版の音声を生成し、字幕と音声の不一致を防止**

**推奨ワークフロー:**
```bash
# 1. 音声を最新版で強制再生成
npx ts-node scripts/generateScriptFinalHoseiVoices.ts --force

# 2. スライドショー設定を生成
npx ts-node scripts/generateSlideshowConfig.ts

# 3. プレビュー確認
npm start
```

**注意**: 動画のレンダリング（MP4ファイル出力）は実施しません。プレビュー確認までを実施します。

以上で完了です！
