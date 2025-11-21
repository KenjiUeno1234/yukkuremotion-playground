# 実行手順書: スライドショー動画の作成

**対象**: script_final.md からスライドショー動画を作成
**最終更新**: 2025-11-20
**完成度**: 100% ✅

---

## 目的

script_final.md に記載されたNARRATOR部分から、以下の要素を含むスライドショー動画を作成する：

1. スライド画像（S001.png～S009.png）
2. 音声ファイル（S001-1.wav～S009-3.wav）- VOICEPEAK使用（複数ナレーション対応）
3. 背景画像（okumono_tanabata0259.png）- 常時表示
4. 字幕表示（黒背景付きテキストボックス）
5. ゆっくりキャラクター（あゆみ）- 口パク機能付き
6. BGM（Floraria.mp3）

---

## 前提条件

### 必要なファイル

1. **script_final.md**: ナレーションテキストが記載されたMarkdownファイル（同じスライドIDで複数のNARRATOR記述可能）
2. **スライド画像**: public/slide/ フォルダに S001.png～S009.png を配置
3. **背景画像**: public/background/ フォルダに okumono_wakusei5.png を配置
4. **BGMファイル**: public/bgm/Floraria.mp3 が存在すること
5. **VOICEPEAK**がインストールされていること

### オプションファイル

- **フォントファイル**: public/font/LanobePOPv2/LightNovelPOPv2.otf（オプション）
  - フォントファイルが存在しない場合でも、レンダリングは正常に動作します
  - デフォルトフォントが使用されます
  - フォント読み込みエラーが発生しても、自動的にスキップされます

### script_final.mdの形式

同じスライドIDで複数のNARRATORを記述できます：

```markdown
[S001] タイトル
NARRATOR:
最初のナレーション文章

[S001] タイトル
NARRATOR:
2番目のナレーション文章
```

この場合、S001-1.wav と S001-2.wav が生成され、同じスライド画像を表示しながら順次再生されます。

---

## 実行手順

### ステップ1: 必要なフォルダとファイルの配置

```bash
# 各フォルダを作成（存在しない場合）
mkdir public\slide
mkdir public\background
mkdir public\bgm
mkdir public\voices

# スライド画像（S001.png～S009.png）をpublic\slideフォルダに配置
# 背景画像（okumono_wakusei5.png）をpublic\backgroundフォルダに配置
# BGMファイル（Floraria.mp3）をpublic\bgmフォルダに配置
```

### ステップ2: 音声ファイルの生成

```bash
npx ts-node scripts/generateScriptFinalVoices.ts
```

このスクリプトは：
- script_final.md を解析
- 同じスライドIDの複数のNARRATORを検出
- S001-1.wav, S001-2.wav のように連番で音声ファイルを生成
- VOICEPEAKで音声合成して public/voices/ に保存

**生成されるファイル例**:
- S001-1.wav, S001-2.wav（S001に2つのNARRATOR）
- S002-1.wav, S002-2.wav, S002-3.wav（S002に3つのNARRATOR）
- 合計29ファイル

### ステップ3: 設定ファイルの自動生成

```bash
npx ts-node scripts/generateSlideshowConfig.ts
```

音声ファイルの長さを測定し、以下を含む src/data/slideshowConfig.ts を生成：
- 各スライドの複数ナレーション情報
- フレーム数計算（30 FPS）
- BGM設定（自動追加）

### ステップ4: 開発サーバーの起動

```bash
npm start
```

ブラウザで http://localhost:3001 を開き、"Slideshow"を選択します。

---

## 期待される表示

### 表示される要素

1. **背景画像**: okumono_wakusei5.png が画面全体に表示（zIndex: 1）
2. **スライド画像**: 画面左側70%の領域に表示（zIndex: 2）- キャラクターと重ならないように配置
3. **ゆっくりキャラクター**: 画面右下に表示（650px）- 口パク機能付き
4. **字幕**: 画面下部に表示（黒背景80%不透明、白文字38px、角丸4px、下から80px）

### レイアウト詳細

```
┌─────────────────────────────────────────┐
│ [背景画像 - 全画面]                     │
│ ┌──────────────────┐                    │
│ │                  │                    │
│ │  スライド画像    │      ゆっくり      │
│ │   (左70%)        │   キャラクター     │
│ │                  │    (右30%)         │
│ └──────────────────┘                    │
│ [字幕（黒背景付き）]                    │
└─────────────────────────────────────────┘
```

### 再生される音声

1. **BGM**: Floraria.mp3 がループ再生（音量20%）
2. **ナレーション**: 各スライドの複数音声が順次再生
   - S001: S001-1.wav → S001-2.wav（同じスライド表示のまま）
   - S002: S002-1.wav → S002-2.wav → S002-3.wav（同じスライド表示のまま）

### 口パク機能

- 音声再生中、キャラクターの口が3フレームサイクルで開閉（開→開→閉）
- 音声終了後は口を閉じた状態

---

## 評価基準

### 必須要件（26項目）

#### 1. ファイル構成（7項目）
- [ ] public/slide/S001.png～S009.png が存在する（9ファイル）
- [ ] public/voices/S001-1.wav～S009-3.wav が存在する（29ファイル）
- [ ] public/background/okumono_tanabata0259.png が存在する
- [ ] public/bgm/Floraria.mp3 が存在する
- [ ] src/data/slideshowConfig.ts が存在し、正しい形式である
- [ ] src/Slideshow/SlideshowVideo.tsx が存在する
- [ ] src/types/slideshow.ts に NarrationSegment 型が定義されている

#### 2. 視覚的表示（7項目）
- [ ] 背景画像が画面全体に表示される
- [ ] スライド画像が画面左70%の領域に表示される
- [ ] ゆっくりキャラクター（あゆみ）が画面右下に表示される
- [ ] 字幕が画面下部に黒背景付きで表示される
- [ ] 字幕の背景が80%不透明の黒色である
- [ ] ロゴが非表示になっている
- [ ] レイアウトが背景画像を透過表示している

#### 3. 音声再生（5項目）
- [ ] BGMが最初から最後まで流れ続ける
- [ ] 各スライドの複数ナレーション音声が順次再生される
- [ ] 音声と字幕が同期している
- [ ] BGMとナレーションの音量バランスが適切
- [ ] 同じスライドで複数の音声が連続再生される

#### 4. 口パク機能（3項目）
- [ ] 音声再生中、キャラクターの口が動く
- [ ] 口の動きが3フレームサイクル（開→開→閉）である
- [ ] 音声終了後、口が閉じた状態になる

#### 5. タイミング（4項目）
- [ ] 各スライドが正しい長さ表示される
- [ ] 複数ナレーション間の切り替えがスムーズ
- [ ] 全体の長さが約124.80秒（3744フレーム）
- [ ] S001が0フレームから開始する

### 合格基準

- **26項目すべてクリア**: 100% ✅ 完璧
- **24項目以上クリア**: 92%以上 ✅ 合格
- **21項目以上クリア**: 80%以上 ⚠️ 要改善
- **21項目未満**: 80%未満 ❌ 不合格

---

## トラブルシューティング

### 問題1: 背景画像が表示されない

**確認事項**:
```bash
powershell -Command "Test-Path public\background\okumono_wakusei5.png"
```

**解決方法**: 背景画像を public\background フォルダに配置し、ブラウザをハードリフレッシュ（Ctrl + Shift + R）

### 問題2: スライド画像が表示されない

**確認事項**:
```bash
powershell -Command "Get-ChildItem public\slide"
```

**解決方法**: 9個のスライド画像（S001.png～S009.png）が存在することを確認

### 問題3: 音声ファイルが生成されない

**確認事項**:
```bash
powershell -Command "Get-ChildItem public\voices"
```

**原因**: VOICEPEAKのパスが間違っているか、script_final.mdの形式が正しくない

**解決方法**:
1. scripts/generateScriptFinalVoices.ts の VOICEPEAK_PATH を確認
2. script_final.md の形式を確認（[S001] と NARRATOR: の記述）
3. ステップ2を再実行

### 問題4: 音声ファイル数が29個ではない

**原因**: script_final.md の NARRATOR 記述数が想定と異なる

**確認方法**:
```bash
powershell -Command "(Get-ChildItem public\voices\*.wav).Count"
```

**期待される出力**: `29`

**解決方法**: script_final.md を確認し、各スライドのNARRATOR数を確認

### 問題5: BGMが流れない

**確認事項**:
```bash
powershell -Command "Test-Path public\bgm\Floraria.mp3"
powershell -Command "Get-Content src\data\slideshowConfig.ts | Select-String 'bgmSrc'"
```

**期待される出力**:
```
  bgmSrc: 'bgm/Floraria.mp3',
```

**解決方法**: ステップ3の設定ファイル生成を再実行

### 問題6: 口パクが動かない

**確認事項**: ブラウザのコンソールにエラーがないか確認

**原因**: kuchipakuMapが正しく生成されていない

**解決方法**:
1. src/Slideshow/SlideshowVideo.tsx の generateKuchipakuMap 関数を確認
2. ブラウザをハードリフレッシュ
3. npm start を再実行

### 問題7: 複数ナレーションが順次再生されない

**確認事項**: slideshowConfig.ts の narrations 配列を確認

**期待される形式**:
```typescript
narrations: [
  {
    text: "最初のナレーション",
    voicePath: "voices/S001-1.wav",
    audioDurationFrames: 176
  },
  {
    text: "2番目のナレーション",
    voicePath: "voices/S001-2.wav",
    audioDurationFrames: 114
  }
]
```

**解決方法**: ステップ3を再実行して設定ファイルを再生成

### 問題8: 字幕が切り替わる時に重なって見える

**原因**: `TALK_GAP_FRAMES`がスライドショーモードで誤適用されていた

**確認事項**:
- src/yukkuri/Talk/TalkSequence.tsx で `isSlideshow={!!kuchipakuMap}` が設定されているか
- src/yukkuri/Talk/index.tsx で `isSlideshow` パラメータが使用されているか

**解決方法**:
1. 修正済みコードを使用（2025-11-20以降）
2. ブラウザをハードリフレッシュ（Ctrl + Shift + R）

**技術詳細**: スライドショーではナレーション間にギャップがないため、`isSlideshow`モードでは`TALK_GAP_FRAMES`（25フレーム）を追加しません。

### 問題9: 1分20秒付近で口パクが止まる

**原因**: 字幕とkuchipakuMapの長さの不一致（問題8と同じ根本原因）

**確認事項**:
- ブラウザコンソールで「口パクマップ生成」ログを確認
- 各スライドの開始/終了フレームが連続しているか確認

**解決方法**:
1. 問題8の解決方法を適用
2. ブラウザコンソールで以下のログを確認：
   ```
   口パクマップ生成: 500フレーム, 開始=2011, 終了=2510
   ```
   （S006が正しく生成されていることを確認）

**詳細**: [FIX_VERIFICATION_1min20sec.md](FIX_VERIFICATION_1min20sec.md) を参照

### 問題10: レンダリング時に「delayRender() timeout」エラーが発生する

**エラーメッセージ例**:
```
Error: A delayRender() was called but not cleared after 28000ms
The delayRender was called at: src/load-fonts.tsx:4
```

**原因**: フォントファイル（`public/font/LanobePOPv2/LightNovelPOPv2.otf`）が存在しないか、読み込みに失敗している

**確認事項**:
```bash
powershell -Command "Test-Path public\font\LanobePOPv2\LightNovelPOPv2.otf"
```

**解決方法**:

1. **フォントファイルは不要です**（2025-11-21以降の実装）
   - フォントファイルが存在しない場合でも、自動的にデフォルトフォントが使用されます
   - `src/load-fonts.tsx` には5秒のタイムアウトと自動スキップ機能が実装されています

2. **ブラウザコンソールで確認**:
   - `⚠️ フォント読み込みエラー` または `⚠️ フォント読み込みがタイムアウトしました` が表示される場合、フォントがスキップされています
   - `✅ フォント読み込み成功` が表示される場合、正常に読み込まれています

3. **キャッシュクリア（エラーが継続する場合）**:
   ```bash
   # Webpackキャッシュをクリア
   powershell -Command "Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue"

   # サーバーを再起動
   npm start
   ```

**技術詳細**:
- `src/load-fonts.tsx` には以下の安全機構が実装されています：
  - 5秒のタイムアウト設定
  - エラー発生時の自動`continueRender()`呼び出し
  - try-catchによる例外処理
- フォント読み込み失敗時でも、レンダリングは正常に続行されます

---

## 評価の実行

### 自動評価

#### ファイル存在確認

```bash
# スライド画像（9ファイル）
powershell -Command "if ((Get-ChildItem public\slide\*.png).Count -eq 9) { Write-Host '✅ スライド画像: 9ファイル' -ForegroundColor Green } else { Write-Host '❌ スライド画像の数が不正です' -ForegroundColor Red }"

# 音声ファイル（29ファイル）
powershell -Command "if ((Get-ChildItem public\voices\*.wav).Count -eq 29) { Write-Host '✅ 音声ファイル: 29ファイル' -ForegroundColor Green } else { Write-Host '❌ 音声ファイルの数が不正です' -ForegroundColor Red }"

# 背景画像
powershell -Command "if (Test-Path public\background\okumono_wakusei5.png) { Write-Host '✅ 背景画像あり' -ForegroundColor Green } else { Write-Host '❌ 背景画像なし' -ForegroundColor Red }"

# BGM
powershell -Command "if (Test-Path public\bgm\Floraria.mp3) { Write-Host '✅ BGMあり' -ForegroundColor Green } else { Write-Host '❌ BGMなし' -ForegroundColor Red }"

# 設定ファイル
powershell -Command "if (Test-Path src\data\slideshowConfig.ts) { Write-Host '✅ 設定ファイルあり' -ForegroundColor Green } else { Write-Host '❌ 設定ファイルなし' -ForegroundColor Red }"
```

#### 設定ファイル内容確認

```bash
# 総フレーム数確認
powershell -Command "Get-Content src\data\slideshowConfig.ts | Select-String 'totalFrames'"
# 期待される出力: totalFrames: 3744,

# BGM設定確認
powershell -Command "Get-Content src\data\slideshowConfig.ts | Select-String 'bgm'"
# 期待される出力:
#   bgmSrc: 'bgm/Floraria.mp3',
#   bgmVolume: 0.2,

# 複数ナレーション確認（S001の例）
powershell -Command "Get-Content src\data\slideshowConfig.ts -Raw | Select-String -Pattern 'S001-1.wav'"
# 期待される出力: "voicePath": "voices/S001-1.wav",
```

### 手動評価チェックリスト

#### 基本機能（10項目）
- [ ] プレビューが起動する（http://localhost:3001）
- [ ] "Slideshow"が選択できる
- [ ] 背景画像が全画面表示される
- [ ] スライド画像が左70%に表示される（S001～S009）
- [ ] 複数音声が順次再生される
- [ ] BGMが流れる
- [ ] 字幕が黒背景付きで表示される
- [ ] ゆっくりキャラクターが右下に表示される
- [ ] 口パクが音声に同期する
- [ ] ロゴが非表示である

---

## まとめ

この手順書に従って実行すれば、以下の要素を含む完璧なスライドショー動画が作成できます：

### 実装済み機能（7項目）

1. ✅ **スライド画像**（S001～S009）- 画面左70%に配置
2. ✅ **音声ファイル**（29ファイル）- VOICEPEAK生成、複数ナレーション対応
3. ✅ **背景画像** - 全画面表示、透過レイアウト
4. ✅ **字幕表示** - 黒背景付きテキストボックス（80%不透明）
5. ✅ **ゆっくりキャラクター**（あゆみ）- 画面右下、650px
6. ✅ **口パク機能** - 3フレームサイクル、音声同期
7. ✅ **BGM**（Floraria.mp3）- ループ再生、音量20%

### 技術仕様

- **総動画時間**: 約124.80秒（3744フレーム）
- **フレームレート**: 30 FPS
- **複数ナレーション**: 同じスライドで複数音声を順次再生
- **口パクパターン**: 開→開→閉（3フレーム）
- **レイアウト**: 背景画像 → スライド（左70%） → キャラクター（右下） → 字幕（下部）

### 生成されるファイル数

- スライド画像: 9ファイル（手動配置）
- 音声ファイル: 29ファイル（自動生成）
- 背景画像: 1ファイル（手動配置）
- BGM: 1ファイル（手動配置）
- 設定ファイル: 1ファイル（自動生成）

**評価基準**（26項目）を満たせば、商用レベルのスライドショー動画として使用可能です。

---

## 技術的な実装詳細

### 複数ナレーション機能

各スライドに複数のNARRATORを記述することで、同じスライド画像を表示しながら複数の音声を順次再生できます：

```typescript
// slideshowConfig.ts の例
{
  id: "S001",
  slidePath: "slide/S001.png",
  narrations: [
    {
      text: "最初のナレーション",
      voicePath: "voices/S001-1.wav",
      audioDurationFrames: 176
    },
    {
      text: "2番目のナレーション",
      voicePath: "voices/S001-2.wav",
      audioDurationFrames: 114
    }
  ],
  totalDurationFrames: 290  // 176 + 114
}
```

### 口パク機能の仕組み

```typescript
// generateKuchipakuMap 関数（SlideshowVideo.tsx）
// 各ナレーションの audioDurationFrames を元に
// 3フレームサイクルで口を開閉するパターンを生成
const cyclePosition = i % 3;
amplitude.push(cyclePosition < 2 ? 1 : 0);  // 開→開→閉
```

---

**参考ドキュメント**:
- BGM_FIX.md - BGM実装とトラブルシューティング
- script_final.md - ナレーションスクリプト（複数NARRATOR対応）
- src/types/slideshow.ts - 型定義（NarrationSegment, SlideItem）