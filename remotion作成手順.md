# Remotion動画作成 実行手順書

このドキュメントは、**script_final_hosei.md** から、Remotionでスライド同期型の動画を作成する手順を説明します。

## 前提条件

- Node.js v22以上がインストール済み
- VOICEPEAK がインストール済み（パス: C:\\voicepeak\\VOICEPEAK\\voicepeak.exe）
- 依存パッケージがインストール済み（npm install 実行済み）
- BGMファイル（Floraria.mp3）が `public/bgm/` に配置済み
- スライド画像（S001.png ~ S009.png など）が `public/slide/` に配置済み

---

## 動画作成の全体フロー

```
script_final_hosei.md（発音修正済み原稿：[S001]マーカー付き）
    ↓ 新規スクリプトで変換（今後実装予定）
transcripts/myvideo.tsx（TypeScript台本）自動生成
    ↓ npm run generate:voicepeak
音声ファイル生成（VOICEPEAK）
    ↓ npm run update:audio-durations ⚠️ 必須
音声長 + fromFramesMap 設定（音声重複防止）
    ↓ npm start
プレビュー確認（http://localhost:3000）
```

**重要:** `npm run update:audio-durations` は必ず実行してください。このステップで `fromFramesMap` が生成され、各セリフが順次再生されるようになります。

---

## ファイル構成の理解

### script_final.md と script_final_hosei.md

**script_final.md**: オリジナルの原稿（技術用語そのまま）

**script_final_hosei.md**: 発音修正版の原稿（音声合成用に最適化）

#### フォーマット例:

```markdown
[S001] なんでもかんでもRAGじゃない
NARRATOR:
最近、「自社データならラグでしょ」っていう空気がありますよね。

[S001] なんでもかんでもRAGじゃない
NARRATOR:
でも、実はそうとも限らないんです。

[S002] RAGが向いているケース
NARRATOR:
ラグが向いているのは、こんなケースです。
```

#### 重要なポイント:

1. **[S001]などのスライド番号**
   - `public/slide/S001.png` と対応
   - 同じスライド番号が複数回出現する場合、複数のナレーションに分割される
   - 例: [S001]が3回 → S001-1.wav, S001-2.wav, S001-3.wav

2. **NARRATOR部分**
   - 字幕として画面下部に表示される
   - 音声ファイル生成の元データとなる
   - script_final_hosei.md では発音が修正されている
     - 「RAG」→「ラグ」
     - 「AI」→「エーアイ」
     - 「10〜20」→「10から20」

3. **PNGスライドとの同期**
   - [S001] → `public/slide/S001.png`
   - [S002] → `public/slide/S002.png`
   - スライド、字幕、音声のタイミングが自動的に同期される

---

## ステップ1: TypeScript台本ファイルの生成

### 1-1. script_final_hosei.md から transcripts/myvideo.tsx への変換

**現在、この変換スクリプトは開発中です。** 完成するまでは、以下の手順で手動または別のワークフローを使用してください。

**今後実装予定のコマンド:**
```bash
npm run convert:script-final-hosei
```

このコマンドは以下の処理を行う予定です：
- script_final_hosei.md を読み取る
- [S001]などのスライドマーカーを解析
- NARRATOR部分のテキストを抽出
- 各セリフにUUIDを自動生成
- TypeScript形式の台本ファイルを作成

**生成されるファイルの例:**

```typescript
export const MyVideoConfig: VideoConfig = {
  sections: [
    {
      title: 'セクション1',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      fromFramesMap: {},  // 後でupdate:audio-durationsで自動生成
      totalFrames: 0,     // 後でupdate:audio-durationsで自動生成
      kuchipakuMap: {frames: [], amplitude: []},
      talks: [
        {
          text: '最近、「自社データならラグでしょ」っていう空気がありますよね。',
          speaker: 'ayumi',
          id: 'af3682ce89ed4a638609016c6d4bb03f',
          audioDurationFrames: 0,  // 後でupdate:audio-durationsで自動生成
          slideNumber: 'S001',      // スライド番号
        },
        {
          text: 'でも、実はそうとも限らないんです。',
          speaker: 'ayumi',
          id: 'b1234567890abcdef1234567890abcd',
          audioDurationFrames: 0,
          slideNumber: 'S001',
        },
        // ...
      ],
    },
  ],
};
```

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

### 2-2. 音声設定のカスタマイズ

音声の設定を変更する場合は、**scripts/generateVoicepeakAudios.ts** を編集：

```typescript
// ayumiの声設定
const AYUMI_CONFIG = {
  voice: 'Haruno Sora',
  speed: 120,
  pitch: -30,
  pause: 130,
  volume: 80,
  emotion: 'happy=30,sad=10,angry=0,whisper=20,cool=15',
};
```

### 2-3. 音声の長さを台本に反映（重要）

音声ファイル生成後、以下のコマンドで音声の長さを台本に反映します：

```bash
npm run update:audio-durations
```

**⚠️ このステップは必須です！** スキップすると音声が重複して再生されます。

このコマンドは以下を実行します：

1. **`audioDurationFrames`の設定**
   - 生成された音声ファイルの長さを取得
   - 各セリフの音声長をフレーム数に変換して設定（30 FPS基準）

2. **`fromFramesMap`の自動生成（音声重複防止のために必須）**
   - 各セリフの開始フレーム位置を自動計算
   - 例: `{"0":30,"1":315,"2":416}` → 1つ目は30フレーム目から、2つ目は315フレーム目から、3つ目は416フレーム目から開始
   - このマップがないと、全セリフが同時に再生されて音声が重複します

3. **`totalFrames`の計算**
   - セクション全体の総フレーム数を計算
   - プレビューと動画レンダリングに必要な情報を設定

4. **`kuchipakuMap`の生成**
   - 口パク（くちぱく）アニメーション用のデータを生成
   - 6フレーム周期で口の開閉を制御（3フレーム開く、3フレーム閉じる）

**生成例:**
```typescript
fromFramesMap: {"0":30,"1":315,"2":416},  // ← 各セリフの開始位置
totalFrames: 2490,                         // ← セクション全体の長さ
kuchipakuMap: {
  frames: [0, 1, 2, 3, ...],              // ← フレーム番号
  amplitude: [1, 1, 1, 0, 0, 0, 1, ...]   // ← 口の開閉（1=開く、0=閉じる）
},
talks: [
  {
    text: '...',
    audioDurationFrames: 260,              // ← 音声の長さ
  },
  // ...
]
```

### 2-4. 強制再生成

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

## ステップ3: スライド同期の確認

### 3-1. スライドファイルの確認

`public/slide/` フォルダに、script_final_hosei.md の [S001] などに対応するPNGファイルが配置されているか確認します：

```
public/slide/
├── S001.png
├── S002.png
├── S003.png
└── ...
```

### 3-2. スライド番号とナレーションの対応

script_final_hosei.md の構造に基づいて、以下のように同期されます：

| スライド番号 | PNGファイル | ナレーション音声 | 字幕表示 |
|------------|------------|----------------|---------|
| [S001] | S001.png | S001-1.wav, S001-2.wav | NARRATOR部分 |
| [S002] | S002.png | S002-1.wav, S002-2.wav, S002-3.wav | NARRATOR部分 |
| [S003] | S003.png | S003-1.wav | NARRATOR部分 |

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
✅ 字幕が表示されるか（NARRATOR部分）
✅ スライドと字幕と音声のタイミングが同期しているか
✅ キャラクターの口パク（くちぱく）が音声に合っているか
✅ BGMが適切な音量で流れているか

---

## クイックスタート（要約）

```bash
# 前提: script_final_hosei.md に原稿を配置済み
# 前提: public/slide/ にスライドPNG配置済み

# 1. TypeScript台本を生成（今後実装予定）
npm run convert:script-final-hosei

# 2. 音声ファイルを生成
npm run generate:voicepeak

# 3. 音声の長さを台本に反映（⚠️ 必須: スキップすると音声が重複します）
npm run update:audio-durations

# 4. プレビュー確認
npm start
```

**⚠️ 重要な注意事項:**
- **ステップ3 (`npm run update:audio-durations`) は必ず実行してください**
- このステップをスキップすると、`fromFramesMap`が生成されず、全セリフが同時に再生されて音声が重複します
- 音声ファイルを再生成した場合は、必ずステップ3を再実行してください
- [S001]などのスライド番号は、public/slide/ 内のPNGファイル名と一致させてください

---

## トラブルシューティング

### 音声が重複して再生される

**症状:**
- 複数のセリフが同時に再生され、音声が重なって聞こえる

**原因:**
- `transcripts/myvideo.tsx` の `fromFramesMap` が空オブジェクト `{}` になっている
- `npm run update:audio-durations` を実行していない、または実行し忘れた

**解決方法:**
```bash
# 音声の長さとfromFramesMapを再生成
npm run update:audio-durations
```

**確認方法:**
[transcripts/myvideo.tsx](transcripts/myvideo.tsx) を開いて、以下のように `fromFramesMap` に値が設定されているか確認：

```typescript
fromFramesMap: {"0":30,"1":315,"2":416},  // ✅ 正しい
```

以下の場合は修正が必要：
```typescript
fromFramesMap: {},  // ❌ 空オブジェクト → 音声が重複する
```

---

### スライドが表示されない

**症状:**
- スライド画像が表示されず、背景だけが表示される

**原因:**
- `public/slide/` にPNGファイルが配置されていない
- スライド番号（[S001]）とファイル名（S001.png）が一致していない

**解決方法:**
1. `public/slide/` フォルダを確認
2. script_final_hosei.md の [S001] に対応する S001.png があるか確認
3. ファイル名が大文字・小文字も含めて完全一致しているか確認

---

### 字幕とスライドのタイミングがずれる

**症状:**
- スライドの切り替わりと字幕の表示タイミングが合っていない

**原因:**
- script_final_hosei.md の [S001] マーカーの配置が正しくない
- transcripts/myvideo.tsx の slideNumber プロパティが正しく設定されていない

**解決方法:**
1. script_final_hosei.md で各NARRATOR部分の直前に正しいスライド番号があるか確認
2. transcripts/myvideo.tsx を再生成
3. `npm run update:audio-durations` を再実行

---

### 音声が生成されない

- VOICEPEAKのパスを確認: `C:\\voicepeak\\VOICEPEAK\\voicepeak.exe`
- `scripts/generateVoicepeakAudios.ts` の `VOICEPEAK_PATH` を修正

### プレビューでエラー

- `public/audio/yukkuri/` に音声ファイルがあるか確認
- ブラウザのコンソールでエラー内容を確認

---

## 参考ファイル

- **台本サンプル**: transcripts/firstvideo.tsx
- **音声生成スクリプト**: scripts/generateVoicepeakAudios.ts
- **動画設定型定義**: src/yukkuri/yukkuriVideoConfig.ts
- **スライド用原稿サンプル**: script_final.md, script_final_hosei.md

---

## BGM設定

### BGMファイルの準備

動画に背景音楽を追加するには、BGMファイルを **public/bgm/** フォルダに配置します。

**デフォルト設定：**
- BGMファイル: `Floraria.mp3`
- 配置場所: `public/bgm/Floraria.mp3`
- 音量: 20%（0.2）

### BGMの自動設定

TypeScript台本生成時に、自動的にBGM設定が追加されます。

### BGM設定のカスタマイズ

BGMを変更したい場合は、以下のファイルを編集してください：

**transcripts/myvideo.tsx** (手動編集):
```typescript
{
  title: 'セクションタイトル',
  bgmSrc: 'bgm/Floraria.mp3',  // BGMファイルのパス（先頭のスラッシュなし）
  bgmVolume: 0.2,               // 音量（0.0〜1.0）
  // ...
}
```

**推奨音量：**
- `0.1` - 10%（非常に控えめ）
- `0.2` - 20%（デフォルト、推奨）
- `0.3` - 30%（やや大きめ）

---

## カスタムレイアウト設定

### 背景画像の設定

動画に背景画像を追加するには、以下の手順に従ってください：

#### 1. 背景画像ファイルの配置

背景画像を **public/background/** フォルダに配置します。

**推奨設定：**
- 画像形式: JPG、PNG
- 解像度: 1920x1080 以上
- アスペクト比: 16:9

**例：**
```
public/background/okumono_wakusei5.png
```

#### 2. transcripts/myvideo.tsx での設定

**transcripts/myvideo.tsx** を編集して、背景画像を追加：

```typescript
export const MyVideoConfig: VideoConfig = {
  sections: [
    {
      title: 'セクションタイトル',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      backgroundImage: 'background/okumono_wakusei5.png',  // 背景画像のパス
      // ...
    }
  ],
};
```

**注意事項：**
- パスは `public/` からの相対パスで指定（先頭のスラッシュなし）
- `backgroundImage` が設定されている場合、背景色の代わりに画像が表示されます

---

### カスタム人物画像の設定

デフォルトのゆっくりキャラクターの代わりに、カスタム人物画像を使用できます。

#### 1. 人物画像ファイルの配置

人物画像を **public/jinbutu/** フォルダに配置します。

**推奨設定：**
- 画像形式: PNG（透過背景推奨）
- サイズ: 全身が収まるように適切なサイズ
- アスペクト比: 人物の縦横比に応じて調整

**例：**
```
public/jinbutu/目を開けている顔.png
public/jinbutu/目を閉じている顔.png
```

#### 2. transcripts/myvideo.tsx での設定

**transcripts/myvideo.tsx** を編集して、人物画像を追加：

```typescript
export const MyVideoConfig: VideoConfig = {
  sections: [
    {
      title: 'セクションタイトル',
      bgmSrc: 'bgm/Floraria.mp3',
      bgmVolume: 0.2,
      backgroundImage: 'background/okumono_wakusei5.png',
      customReimuImagePath: 'jinbutu/目を開けている顔.png',  // 右側に表示される人物画像
      customMarisaImagePath: 'jinbutu/目を閉じている顔.png',  // （オプション）
      // ...
    }
  ],
};
```

**動作：**
- `customReimuImagePath` が設定されている場合、画面右側に1人の人物が表示されます
- デフォルトのゆっくりキャラクター（霊夢・魔理沙）は非表示になります
- カスタム人物画像は静止画として表示され、ふわふわアニメーションは適用されません

**サイズ調整：**
- 人物画像のサイズは自動的に380px幅に調整されます
- 配置位置: 画面右下（`right: 60px`, `bottom: 120px`）

---

### 字幕スタイルのカスタマイズ

字幕のスタイルは以下のファイルで設定されています：

**src/Subtitle/SubtitleBackground.tsx**
```typescript
const jimakuBackground: React.CSSProperties = {
  backgroundColor: '#062722',  // 背景色（濃い緑）
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
};
```

**src/Subtitle/Subtitle.tsx**
```typescript
const subtitle: React.CSSProperties = {
  fontFamily: 'GenshinGothic',
  fontSize: 48,
  fontWeight: 'bold',
  color: '#DEFFEE',  // フォント色（明るい緑）
  textAlign: 'left',
};
```

**カスタマイズポイント：**
- `backgroundColor`: 字幕背景の色
- `fontSize`: フォントサイズ（デフォルト: 48px）
- `color`: テキストの色
- `textAlign`: テキストの配置（left/center/right）

---

## まとめ

このワークフローにより、**script_final_hosei.md に配置した原稿** から **スライド同期型のRemotionプレビュー動画** を作成できます！

1. **script_final_hosei.md** に発音修正済み原稿を配置（[S001]マーカー + NARRATOR）
2. **public/slide/** にスライドPNGを配置（S001.png, S002.png など）
3. **TypeScript台本** で動画設定を自動生成（今後実装予定）
4. **VOICEPEAK** で音声を自動生成
5. **fromFramesMap** で音声のタイミングを自動調整
6. **Remotion** でスライド・字幕・音声が同期したプレビュー確認

**主な特徴:**
- スライド番号（[S001]）でPNG、字幕、音声を自動同期
- NARRATOR部分が字幕として表示
- 発音修正版（script_final_hosei.md）で自然な音声生成
- fromFramesMapで音声の重複を自動防止
- 口パク（くちぱく）アニメーションが音声に同期

**注意**: 動画のレンダリング（MP4ファイル出力）は実施しません。プレビュー確認までを実施します。

以上で完了です！
