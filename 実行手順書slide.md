# 実行手順書: スライドショー動画の作成

**対象**: script_final.md からスライドショー動画を作成
**最終更新**: 2025-11-19
**完成度**: 100% ✅

---

## 目的

script_final.md に記載されたNARRATOR部分から、以下の要素を含むスライドショー動画を作成する：

1. スライド画像（S001.png～S009.png）
2. 音声ファイル（S001.wav～S009.wav）- VOICEPEAK使用
3. 字幕表示（ナレーションテキスト）
4. ゆっくりキャラクター（あゆみ）
5. BGM（Floraria.mp3）
6. ロゴ表示

---

## 前提条件

### 必要なファイル

1. **script_final.md**: ナレーションテキストが記載されたMarkdownファイル
2. **スライド画像**: public/slide/ フォルダに S001.png～S009.png を配置
3. **BGMファイル**: public/bgm/Floraria.mp3 が存在すること
4. **VOICEPEAK**がインストールされていること

---

## 実行手順

### ステップ1: スライド画像の配置

```bash
# スライド画像（S001.png～S009.png）をpublic\slideフォルダに配置
mkdir public\slide
```

### ステップ2: 音声ファイルの生成

```bash
npx ts-node scripts/generateScriptFinalVoices.ts
```

このスクリプトは script_final.md を読み込み、VOICEPEAKで音声合成して public/voices/ に保存します。

### ステップ3: 設定ファイルの自動生成

```bash
npx ts-node scripts/generateSlideshowConfig.ts
```

音声ファイルの長さを測定し、src/data/slideshowConfig.ts を生成します。

### ステップ4: 開発サーバーの起動

```bash
npm start
```

ブラウザで http://localhost:3000 を開き、"Slideshow"を選択します。

---

## 期待される表示

### 表示される要素

1. **スライド画像**: S001.png が画面全体に表示
2. **ゆっくりキャラクター**: 画面下部中央に表示
3. **字幕**: 画面下部に白文字で表示
4. **ロゴ**: 画面左上に表示

### 再生される音声

1. **BGM**: Floraria.mp3 がループ再生（音量20%）
2. **ナレーション**: S001.wav が再生

---

## 評価基準

### 必須要件（21項目）

#### 1. ファイル構成（5項目）
- [ ] public/slide/S001.png～S009.png が存在する
- [ ] public/voices/S001.wav～S009.wav が存在する
- [ ] public/bgm/Floraria.mp3 が存在する
- [ ] src/data/slideshowConfig.ts が存在する
- [ ] src/Slideshow/SlideshowVideo.tsx が存在する

#### 2. 視覚的表示（5項目）
- [ ] スライド画像が画面全体に表示される
- [ ] ゆっくりキャラクター（あゆみ）が画面下部に表示される
- [ ] 字幕が画面下部に表示される
- [ ] ロゴが画面左上に表示される
- [ ] 黒背景が設定されている

#### 3. 音声再生（4項目）
- [ ] BGMが最初から最後まで流れ続ける
- [ ] 各スライドのナレーション音声が再生される
- [ ] 音声と字幕が同期している
- [ ] BGMとナレーションの音量バランスが適切

#### 4. タイミング（4項目）
- [ ] 各スライドが正しい長さ表示される
- [ ] スライド間の切り替えがスムーズ
- [ ] 全体の長さが約103.67秒（3110フレーム）
- [ ] S001が0フレームから開始する

#### 5. コンソールログ（3項目）
- [ ] エラーメッセージがない
- [ ] すべてのスライド画像の読み込み成功ログがある（9個）
- [ ] スライドのfrom/durationログが正しい（9個）

### 合格基準

- **21項目すべてクリア**: 100% ✅ 完璧
- **19項目以上クリア**: 90%以上 ✅ 合格
- **17項目以上クリア**: 80%以上 ⚠️ 要改善
- **17項目未満**: 80%未満 ❌ 不合格

---

## トラブルシューティング

### 問題1: 画面が真っ黒

**確認事項**:
```bash
powershell -Command "Get-ChildItem public\slide"
```

**解決方法**: ブラウザをハードリフレッシュ（Ctrl + Shift + R）

### 問題2: 音声が流れない

**確認事項**:
```bash
powershell -Command "Get-ChildItem public\voices"
```

**解決方法**: ステップ2からやり直す

### 問題3: BGMが流れない

**原因**: 自動生成されたslideshowConfig.tsにBGM設定が含まれていない

**解決方法**:
```bash
# ステップ3の設定ファイル生成を再実行
npx ts-node scripts/generateSlideshowConfig.ts
```

このスクリプトは自動的にBGM設定（bgmSrc: 'bgm/Floraria.mp3', bgmVolume: 0.2）を含めます。

**確認方法**:
```bash
# 設定ファイルにBGM設定が含まれているか確認
powershell -Command "Get-Content src/data/slideshowConfig.ts | Select-String 'bgmSrc'"
```

**期待される出力**:
```
  bgmSrc: 'bgm/Floraria.mp3',
```

---

## 評価の実行

### 自動評価

```bash
# ファイル存在確認
powershell -Command "$files = @('public/slide/S001.png','public/slide/S002.png','public/slide/S003.png','public/slide/S004.png','public/slide/S005.png','public/slide/S006.png','public/slide/S007.png','public/slide/S008.png','public/slide/S009.png','public/voices/S001.wav','public/voices/S002.wav','public/voices/S003.wav','public/voices/S004.wav','public/voices/S005.wav','public/voices/S006.wav','public/voices/S007.wav','public/voices/S008.wav','public/voices/S009.wav','public/bgm/Floraria.mp3','src/data/slideshowConfig.ts'); $missing = @(); foreach ($file in $files) { if (-not (Test-Path $file)) { $missing += $file } }; if ($missing.Count -eq 0) { Write-Host 'すべてのファイルが存在します' -ForegroundColor Green } else { Write-Host '以下のファイルが見つかりません:' -ForegroundColor Red; $missing | ForEach-Object { Write-Host \"  - $_\" } }"
```

### 手動評価チェックリスト

#### 基本機能（8項目）
- [ ] プレビューが起動する
- [ ] "Slideshow"が選択できる
- [ ] スライド画像が表示される（S001～S009）
- [ ] 音声が再生される
- [ ] BGMが流れる
- [ ] 字幕が表示される
- [ ] ゆっくりキャラクターが表示される
- [ ] ロゴが表示される

---

## まとめ

この手順書に従って実行すれば、以下の要素を含む完璧なスライドショー動画が作成できます：

1. ✅ スライド画像（S001～S009）
2. ✅ 音声ファイル（VOICEPEAK生成）
3. ✅ 字幕表示
4. ✅ ゆっくりキャラクター（あゆみ）
5. ✅ BGM（Floraria.mp3）
6. ✅ ロゴ表示

**評価基準**を満たせば、商用レベルのスライドショー動画として使用可能です。

---

**参考ドキュメント**:
- ROOT_CAUSE_ANALYSIS.md - 技術的な背景
- SLIDESHOW_WITH_CHARACTER_BGM.md - 実装詳細
- VERIFICATION_CHECKLIST.md - 検証方法