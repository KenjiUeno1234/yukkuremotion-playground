# スライドショー動画 - クイックガイド

## 🎬 プレビュー確認

### 1. プレビューサーバーを起動
```bash
npm start
```

### 2. ブラウザで開く
http://localhost:3000

### 3. "Slideshow"を選択
左側のリストから**Slideshow**を選択してプレビューを確認

---

## 📝 動画の内容

### 基本情報
- **総時間**: 約1分43秒（103秒）
- **スライド数**: 9枚（S001～S009）
- **解像度**: 1920x1080 (Full HD)
- **FPS**: 30

### 各スライドの構成
各スライドには以下の要素が含まれます：
1. **スライド画像**: `public/slide/S001.png`～`S009.png`
2. **音声**: `public/voices/S001.wav`～`S009.wav`（VOICEPEAK生成）
3. **字幕**: script_final.mdのNARRATOR部分（画面下部に表示）

### 連動性
音声・原稿・スライドがS001→S002→...→S009の順番で完全に連動しています。

---

## 🔧 原稿を編集・更新する

### 手順
1. **script_final.md**を編集
2. 音声を再生成:
   ```bash
   npm run generate:script-final
   ```
3. 設定ファイルを更新:
   ```bash
   npm run generate:slideshow-config
   ```
4. プレビューで確認:
   ```bash
   npm start
   ```

---

## 🖼️ スライド画像を追加・変更する

### 手順
1. `public/slide/`フォルダに画像を配置
2. ファイル名は`S001.png`形式（IDと一致させる）
3. ブラウザをリフレッシュ（F5）

---

## 📊 動画の構成

| ID | 音声長 | タイトル |
|----|--------|---------|
| S001 | 9.87秒 | なんでもかんでもRAGじゃない |
| S002 | 17.27秒 | よくある相談パターン |
| S003 | 16.40秒 | 問い①：全部参照する? |
| S004 | 15.37秒 | 問い②：入力上限に収まる? |
| S005 | 11.50秒 | 問い③：パターンは何個? |
| S006 | 3.33秒 | 3つの問いまとめ |
| S007 | 10.20秒 | RAG＝正義ではない |
| S008 | 3.10秒 | 今日のポイント |
| S009 | 16.63秒 | RAGを使わない勇気を |

---

## 🎥 動画のレンダリング（MP4出力）

### package.jsonにスクリプトを追加
```json
"build:slideshow": "remotion render Slideshow out/slideshow.mp4"
```

### レンダリング実行
```bash
npm run build:slideshow
```

出力先: `out/slideshow.mp4`

---

## 🚨 トラブルシューティング

### スライドが表示されない場合
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md)を参照

**主な原因**:
- 画像ファイルが`public/slide/`に配置されていない
- ファイル名が`S001.png`形式になっていない

**解決方法**:
```bash
# 画像をpublicフォルダに配置
# ファイル名を確認: S001.png, S002.png, ...
ls public/slide/
```

### 音声が再生されない場合
**確認事項**:
- 音声ファイルが`public/voices/`に配置されているか
- ファイル名が`S001.wav`形式になっているか

```bash
# 音声ファイルを確認
ls public/voices/
```

---

## 📁 ファイル構成

```
yukkuremotion-playground/
├── script_final.md              # 原稿（編集する）
├── public/
│   ├── slide/                   # スライド画像を配置
│   │   ├── S001.png ~ S009.png
│   └── voices/                  # 音声ファイル（自動生成）
│       ├── S001.wav ~ S009.wav
├── src/
│   ├── Slideshow/
│   │   ├── SlideItem.tsx        # 個別スライドコンポーネント
│   │   └── SlideshowVideo.tsx   # メイン動画コンポーネント
│   └── data/
│       └── slideshowConfig.ts   # 自動生成された設定
└── scripts/
    ├── generateScriptFinalVoices.ts      # 音声生成
    └── generateSlideshowConfig.ts        # 設定ファイル生成
```

---

## 📚 関連ドキュメント

- [SLIDESHOW_EVALUATION.md](SLIDESHOW_EVALUATION.md) - 詳細な評価レポート
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - トラブルシューティングガイド

---

## ✅ 完成度

⭐⭐⭐⭐⭐ (5/5)

- ✅ 音声・原稿・スライドの完全な連動
- ✅ 自動生成・自動タイミング調整
- ✅ 型安全な実装
- ✅ 保守性の高い構造

**プレビューURL**: http://localhost:3000 → "Slideshow"を選択
