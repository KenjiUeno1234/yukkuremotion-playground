# トラブルシューティング: スライドが表示されない問題

## 問題
音声は流れるが、スライド画像が表示されず、真っ黒の画面になる。

## 原因
Remotionでは、`staticFile()`で読み込む静的ファイルは**publicフォルダ**に配置する必要があります。
`src`フォルダ内のファイルは`staticFile()`では読み込めません。

当初、以下のように配置していました：
- ❌ `src/slide/*.png` → Remotionが読み込めない
- ❌ `src/voices/*.wav` → Remotionが読み込めない

## 解決方法

### ✅ 修正済み
画像と音声ファイルを`public`フォルダに移動しました：

```bash
# 画像ファイルをコピー
public/slide/S001.png ~ S009.png

# 音声ファイルをコピー
public/voices/S001.wav ~ S009.wav
```

### 自動生成スクリプトの修正
今後、音声を再生成する際に自動的に正しい場所に出力されるよう、スクリプトを修正しました：

**scripts/generateScriptFinalVoices.ts**:
```typescript
// 修正前
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'voices');

// 修正後
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'voices');
```

**scripts/generateSlideshowConfig.ts**:
```typescript
// 修正前
const VOICES_DIR = path.join(process.cwd(), 'src', 'voices');

// 修正後
const VOICES_DIR = path.join(process.cwd(), 'public', 'voices');
```

## 確認方法

### 1. ブラウザをリフレッシュ
プレビューが開いている場合、ブラウザをリフレッシュ（F5またはCtrl+R）してください。

### 2. プレビューURLを開く
http://localhost:3000 を開いて、"Slideshow"を選択してください。

### 3. 正しく動作している場合
- ✅ S001のスライド画像が表示される
- ✅ 音声と同時にスライドが表示される
- ✅ 画面下部に字幕が表示される
- ✅ 音声の長さに合わせてスライドが切り替わる

## ファイル構成（修正後）

```
yukkuremotion-playground/
├── public/                          # 静的ファイル（Remotionが読み込める）
│   ├── slide/                       # ✅ スライド画像
│   │   ├── S001.png ~ S009.png
│   └── voices/                      # ✅ 音声ファイル
│       ├── S001.wav ~ S009.wav
├── src/
│   ├── slide/                       # ❌ 元の場所（参照用に残す）
│   │   ├── S001.png ~ S009.png
│   ├── voices/                      # ❌ 元の場所（参照用に残す）
│   │   ├── S001.wav ~ S009.wav
│   ├── Slideshow/
│   │   ├── SlideItem.tsx
│   │   └── SlideshowVideo.tsx
│   └── data/
│       └── slideshowConfig.ts
└── scripts/
    ├── generateScriptFinalVoices.ts # ✅ public/voicesに出力するよう修正済み
    └── generateSlideshowConfig.ts   # ✅ public/voicesを参照するよう修正済み
```

## 今後の手順

### スライド画像を追加・更新する場合
1. `public/slide/`フォルダに画像を配置
2. ファイル名は`S001.png`形式（IDと一致させる）
3. プレビューをリフレッシュ

### 音声を再生成する場合
```bash
# 1. script_final.mdを編集

# 2. 音声ファイルを再生成（自動的にpublic/voicesに出力される）
npm run generate:script-final

# 3. 設定ファイルを更新
npm run generate:slideshow-config

# 4. プレビューで確認
npm start
```

## 技術的な詳細

### Remotionの静的ファイル読み込み
Remotionでは、`staticFile()`関数を使用して静的ファイルを読み込みます：

```typescript
import { staticFile } from 'remotion';

// ✅ 正しい: publicフォルダからの相対パス
<Img src={staticFile('slide/S001.png')} />

// ❌ 間違い: srcフォルダは読み込めない
<Img src={staticFile('src/slide/S001.png')} />
```

`staticFile()`は、プロジェクトルートの`public`フォルダをルートとして解決します。

### なぜpublicフォルダなのか？
- Remotionは動画レンダリング時に静的ファイルを`public`フォルダから読み込む
- `src`フォルダはWebpackでバンドルされるコード用
- 画像・音声などのアセットは`public`フォルダに配置するのがベストプラクティス

## まとめ
✅ 画像と音声ファイルを`public`フォルダに移動することで、スライドが正しく表示されるようになりました。
✅ 今後の再生成では自動的に正しい場所に出力されます。
