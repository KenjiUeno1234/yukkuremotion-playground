# Remotion動画作成 実行手順書（新形式版）

このドキュメントは、**新しいTypeScript形式** を使用して、Remotionでスライド同期型の動画を作成する手順を説明します。

## 前提条件

- Node.js v22以上がインストール済み
- VOICEPEAK がインストール済み（パス: C:\\voicepeak\\VOICEPEAK\\voicepeak.exe）
- 依存パッケージがインストール済み（npm install 実行済み）
- BGMファイルが `public/bgm/` に配置済み
- スライド画像（S001.png ~ S009.png など）が `public/slide/` に配置済み
- 効果音ファイルが `src/koukaon/` に配置済み

---

## 動画作成の全体フロー

```
原稿作成
    ↓
transcripts/myvideo.tsx（新形式TypeScript台本）作成
    ↓ npm run generate:voicepeak
音声ファイル生成（VOICEPEAK）
    ↓ npm run update:audio-durations ⚠️ 必須
音声長 + フレームマップ設定
    ↓ npm start
プレビュー確認（http://localhost:3000）
```

**重要:** `npm run update:audio-durations` は必ず実行してください。このステップで音声のタイミングが調整され、各セリフが順次再生されるようになります。

---

## 新形式の TypeScript 台本フォーマット

### 基本構造

新形式では、以下のようなシンプルな構造でセクションと会話を定義します：

```typescript
export const MyVideoConfig: VideoConfig = {
  sections: [
    {
      title: "セクションタイトル",
      bgm: "bgm/Floraria.mp3",        // BGMファイルパス（オプション）
      bgmVolume: 0.2,                 // BGM音量 0.0〜1.0（オプション）
      talks: [
        {
          text: "最初にこの動画を制作するワークフローの全体像についてお話しします。",
          imageSrc: "/slide/S001.png",                // スライド画像のパス
          delayForNextTalkInSeconds: 0.1,             // 次のセリフまでの間（秒）
          seSounds: [                                 // 効果音（オプション、1つまで推奨）
            {
              src: "koukaon/和太鼓でドン.mp3",
              delaySeconds: 3                         // talk開始から3秒後に再生
            }
          ]
        },
        {
          text: "次のセリフです。",
          imageSrc: "/slide/S001.png",
          delayForNextTalkInSeconds: 0.3,
        },
        // ...
      ]
    }
  ]
};
```

### フィールド説明

#### セクションレベル（sections）

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `title` | string | ✅ | セクションのタイトル |
| `bgm` | string | ❌ | BGMファイルのパス（例: "bgm/Floraria.mp3"） |
| `bgmVolume` | number | ❌ | BGMの音量（0.0〜1.0、デフォルト: 0.2） |
| `talks` | array | ✅ | 会話の配列 |

#### トークレベル（talks）

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `text` | string | ✅ | セリフのテキスト |
| `imageSrc` | string | ❌ | 表示するスライド画像のパス（例: "/slide/S001.png"） |
| `durationInSeconds` | number | ❌ | 表示時間（秒）※通常は音声の長さが自動設定されます |
| `delayForNextTalkInSeconds` | number | ❌ | 次のセリフまでの間（秒）、ルールは下記参照 |
| `seSounds` | array | ❌ | 効果音の配列（1つまで推奨） |

#### 効果音（seSounds）

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `src` | string | ✅ | 効果音ファイルのパス（例: "koukaon/和太鼓でドン.mp3"） |
| `delaySeconds` | number | ✅ | talk開始からの再生タイミング（秒）、推奨: 3秒 |

---

## 効果音の指定

効果音は過度に用い過ぎず（**1つのセクションに最大5個ほど**）、しかし適切な場面では以下のルール通りに指定してください。

### 利用可能な効果音ファイル

効果音は **src/koukaon/** フォルダに配置されています：

| ファイル名 | 使用場面 |
|-----------|---------|
| `和太鼓でドン.mp3` | メインのメッセージを伝える、すごいものを紹介する |
| `きらきら輝く3.mp3` | 素晴らしいものが出来上がった時 |
| `ショック2.mp3` | 恐ろしいことが起きた時、注意喚起 |

### 効果音の指定例

```typescript
{
  text: "また、何と言っても無料で使えます",
  imageSrc: "/slide/S005.png",
  delayForNextTalkInSeconds: 0.1,
  seSounds: [
    {
      src: "koukaon/和太鼓でドン.mp3",
      delaySeconds: 3  // talk開始から3秒後に再生
    }
  ]
}
```

### 効果音使用時の注意点

1. **1つの talk につき効果音は1つまで推奨**
   - 複数の効果音候補がある場合は、意味の強い方を選んでください

2. **再生タイミングは talk 開始から3秒後**
   - `delaySeconds: 3` を指定してください

3. **過度な使用は避ける**
   - 1つのセクション（section）に最大5個程度に抑えてください

---

## 次のセリフまでの間の指定（delayForNextTalkInSeconds）

`delayForNextTalkInSeconds` は次のセリフを言い出し始めるまでの間を表しています。
大まかに次のルールで値を指定してください：

| 状況 | 推奨値（秒） | 説明 |
|------|------------|------|
| 一つの事柄に対して連続したセリフ | `0.1` | 話題が連続している場合 |
| 次のトピックに移る、長い文を読み上げ終わる | `0.3` | トピックの区切り |
| セクションの終わり | `0.5` | セクションの最後のセリフ |

### 指定例

```typescript
talks: [
  {
    text: "まず最初のポイントです。",
    imageSrc: "/slide/S001.png",
    delayForNextTalkInSeconds: 0.1,  // ← 連続したセリフなので短い間
  },
  {
    text: "これは同じトピックの続きです。",
    imageSrc: "/slide/S001.png",
    delayForNextTalkInSeconds: 0.3,  // ← トピックが変わるので少し長め
  },
  {
    text: "次に、別のトピックについてお話しします。",
    imageSrc: "/slide/S002.png",
    delayForNextTalkInSeconds: 0.1,
  },
  {
    text: "以上でこのセクションは終わりです。",
    imageSrc: "/slide/S002.png",
    delayForNextTalkInSeconds: 0.5,  // ← セクション終わりなので長めの間
  },
]
```

---

## TypeScript台本の作成例

### 完全な例

```typescript
import { VideoConfig } from '../src/yukkuri/yukkuriVideoConfig';

export const MyVideoConfig: VideoConfig = {
  sections: [
    {
      title: "全体像の説明",
      bgm: "bgm/Floraria.mp3",
      bgmVolume: 0.2,
      talks: [
        {
          text: "最初にこの動画を制作するワークフローの全体像についてお話しします。",
          imageSrc: "/slide/S001.png",
          delayForNextTalkInSeconds: 0.3,
          seSounds: [
            {
              src: "koukaon/和太鼓でドン.mp3",
              delaySeconds: 3
            }
          ]
        },
        {
          text: "この動画は、テキスト原稿から自動的に生成されています。",
          imageSrc: "/slide/S001.png",
          delayForNextTalkInSeconds: 0.1,
        },
        {
          text: "AIが台本を作成し、音声を生成し、スライドと同期させています。",
          imageSrc: "/slide/S002.png",
          delayForNextTalkInSeconds: 0.5,
        }
      ]
    },
    {
      title: "メリットの紹介",
      bgm: "bgm/Floraria.mp3",
      bgmVolume: 0.2,
      talks: [
        {
          text: "このシステムには、多くのメリットがあります。",
          imageSrc: "/slide/S003.png",
          delayForNextTalkInSeconds: 0.3,
        },
        {
          text: "また、何と言っても無料で使えます。",
          imageSrc: "/slide/S004.png",
          delayForNextTalkInSeconds: 0.1,
          seSounds: [
            {
              src: "koukaon/きらきら輝く3.mp3",
              delaySeconds: 3
            }
          ]
        },
        {
          text: "以上がメリットの紹介でした。",
          imageSrc: "/slide/S004.png",
          delayForNextTalkInSeconds: 0.5,
        }
      ]
    }
  ]
};
```

---

## ステップ1: TypeScript台本ファイルの作成

### 1-1. transcripts/myvideo.tsx を作成

**transcripts/myvideo.tsx** を新規作成または編集して、上記の新形式で台本を記述します。

**テンプレート:**

```typescript
import { VideoConfig } from '../src/yukkuri/yukkuriVideoConfig';

export const MyVideoConfig: VideoConfig = {
  sections: [
    {
      title: "セクション1",
      bgm: "bgm/Floraria.mp3",
      bgmVolume: 0.2,
      talks: [
        {
          text: "セリフをここに記述します。",
          imageSrc: "/slide/S001.png",
          delayForNextTalkInSeconds: 0.1,
        },
        // さらにセリフを追加...
      ]
    },
    // さらにセクションを追加...
  ]
};
```

### 1-2. 台本作成時のポイント

1. **セリフの分割**
   - 1つのセリフは1〜2文程度が目安
   - 長すぎるセリフは分割してください

2. **スライド画像の指定**
   - `imageSrc` には `/slide/S001.png` のように指定
   - スライド画像は **public/slide/** に配置

3. **効果音の追加**
   - 強調したいセリフに効果音を追加
   - 1つのセクションに最大5個程度

4. **間の調整**
   - `delayForNextTalkInSeconds` でセリフ間の間を調整
   - ルールに従って 0.1、0.3、0.5 のいずれかを指定

---

## ステップ2: 音声ファイルの生成

### 2-1. VOICEPEAKで音声を生成

以下のコマンドを実行して、全てのセリフの音声ファイルを生成します：

```bash
npm run generate:voicepeak
```

このコマンドは：
- **transcripts/myvideo.tsx** からセリフを読み取る
- 各セリフごとにVOICEPEAKで音声生成
- **public/audio/yukkuri/{id}.wav** として保存
- 既存ファイルは自動的にスキップ

### 2-2. 音声の長さを台本に反映（重要）

音声ファイル生成後、以下のコマンドで音声の長さとタイミングを台本に反映します：

```bash
npm run update:audio-durations
```

**⚠️ このステップは必須です！** スキップすると音声が重複して再生されます。

このコマンドは以下を実行します：

1. **音声の長さを取得**
   - 生成された音声ファイルの長さを取得
   - フレーム数に変換して設定（30 FPS基準）

2. **フレームマップの自動生成**
   - 各セリフの開始フレーム位置を自動計算
   - 音声の重複を防止

3. **効果音のタイミング設定**
   - `seSounds` で指定した効果音の再生タイミングを設定
   - `delaySeconds: 3` の場合、talk開始から3秒後に再生

### 2-3. 強制再生成

既存音声を削除して再生成したい場合：

```bash
# Windowsの場合
if exist public\audio\yukkuri rmdir /s /q public\audio\yukkuri
npm run generate:voicepeak
npm run update:audio-durations

# macOS/Linuxの場合
rm -rf public/audio/yukkuri
npm run generate:voicepeak
npm run update:audio-durations
```

---

## ステップ3: スライド画像の準備

### 3-1. スライドファイルの配置

`public/slide/` フォルダに、PNG形式のスライド画像を配置します：

```
public/slide/
├── S001.png
├── S002.png
├── S003.png
└── ...
```

### 3-2. スライド画像とセリフの対応

台本の `imageSrc` フィールドで指定したスライド画像が表示されます：

```typescript
{
  text: "セリフ",
  imageSrc: "/slide/S001.png",  // ← public/slide/S001.png が表示される
}
```

**重要:** スライドの切り替えタイミング、字幕の表示、音声の再生は全て自動的に同期されます。

---

## ステップ4: プレビューで確認

### 4-1. プレビューサーバーの起動

```bash
npm start
```

ブラウザで以下のURLを開きます：
- **http://localhost:3000**

### 4-2. プレビューでの確認事項

✅ スライド画像（PNG）が正しく表示されるか
✅ 音声が正しく再生されるか（順次再生、重複なし）
✅ 効果音が適切なタイミング（talk開始から3秒後）で再生されるか
✅ 字幕が表示されるか
✅ スライドと字幕と音声のタイミングが同期しているか
✅ BGMが適切な音量で流れているか

---

## クイックスタート（要約）

```bash
# 前提: transcripts/myvideo.tsx に新形式で台本を記述済み
# 前提: public/slide/ にスライドPNG配置済み
# 前提: src/koukaon/ に効果音ファイル配置済み

# 1. 音声ファイルを生成
npm run generate:voicepeak

# 2. 音声の長さとタイミングを台本に反映（⚠️ 必須）
npm run update:audio-durations

# 3. プレビュー確認
npm start
```

**⚠️ 重要な注意事項:**
- **ステップ2 (`npm run update:audio-durations`) は必ず実行してください**
- このステップをスキップすると、音声が重複して再生されます
- 音声ファイルを再生成した場合は、必ずステップ2を再実行してください

---

## トラブルシューティング

### 音声が重複して再生される

**症状:**
- 複数のセリフが同時に再生され、音声が重なって聞こえる

**原因:**
- `npm run update:audio-durations` を実行していない

**解決方法:**
```bash
npm run update:audio-durations
```

---

### 効果音が再生されない

**症状:**
- 効果音が再生されない

**原因:**
- `src/koukaon/` にファイルが配置されていない
- ファイル名が間違っている

**解決方法:**
1. `src/koukaon/` フォルダを確認
2. ファイル名が正しいか確認（例: `和太鼓でドン.mp3`）
3. `npm run update:audio-durations` を再実行

---

### スライドが表示されない

**症状:**
- スライド画像が表示されず、背景だけが表示される

**原因:**
- `public/slide/` にPNGファイルが配置されていない
- `imageSrc` のパスが間違っている

**解決方法:**
1. `public/slide/` フォルダを確認
2. `imageSrc` で指定したファイルがあるか確認
3. パスが `/slide/S001.png` のように正しく指定されているか確認

---

### 音声が生成されない

**原因:**
- VOICEPEAKのパスが正しくない

**解決方法:**
- VOICEPEAKのパスを確認: `C:\\voicepeak\\VOICEPEAK\\voicepeak.exe`
- `scripts/generateVoicepeakAudios.ts` の `VOICEPEAK_PATH` を修正

---

## 旧形式との互換性

この新形式は、旧形式との互換性を保ちながら使用できます。

### 旧形式との主な違い

| 項目 | 旧形式 | 新形式 |
|------|-------|-------|
| BGM指定 | `bgmSrc` | `bgm` |
| スライド指定 | `slideNumber: "S001"` | `imageSrc: "/slide/S001.png"` |
| セリフ間の間 | フレーム単位 | 秒単位（`delayForNextTalkInSeconds`） |
| 効果音 | - | `seSounds` 配列 |

### 移行のヒント

旧形式から新形式に移行する場合：

1. **BGM設定の変更**
   - `bgmSrc: "bgm/Floraria.mp3"` → `bgm: "bgm/Floraria.mp3"`

2. **スライド指定の変更**
   - `slideNumber: "S001"` → `imageSrc: "/slide/S001.png"`

3. **間の指定を追加**
   - `delayForNextTalkInSeconds: 0.1` などを追加

4. **効果音を追加**（オプション）
   - 適切な場所に `seSounds` を追加

---

## まとめ

この新形式のワークフローにより、よりシンプルで直感的に **スライド同期型のRemotion動画** を作成できます！

### 新形式の主な特徴

✅ **シンプルな構造**
   - 秒単位での時間指定
   - 直感的なフィールド名

✅ **効果音のサポート**
   - 簡単に効果音を追加可能
   - talk開始から3秒後に再生

✅ **柔軟な間の調整**
   - `delayForNextTalkInSeconds` で細かく調整可能
   - ルールに基づいた値の指定

✅ **旧形式との互換性**
   - 既存のシステムと並行利用可能

**注意**: 動画のレンダリング（MP4ファイル出力）は実施しません。プレビュー確認までを実施します。

以上で完了です！
