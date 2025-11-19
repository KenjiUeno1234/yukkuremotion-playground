# デバッグ調査レポート: スライド画像が表示されない問題

**作成日時**: 2025-11-19
**問題**: 音声は流れるが、PNG画像が表示されず、真っ黒の画面になる

---

## 🔍 調査内容

### 1. ファイルの存在確認 ✅
```bash
ls -la public/slide/
```

**結果**: 全9枚の画像ファイルが存在
- S001.png ~ S009.png
- ファイルサイズ: 17KB ~ 63KB
- 画像形式: PNG image data, 1280 x 720, 8-bit/color RGB

**結論**: ファイルは正しく配置されています ✅

---

### 2. 画像ファイルの整合性確認 ✅
```bash
file public/slide/S001.png
```

**結果**:
```
public/slide/S001.png: PNG image data, 1280 x 720, 8-bit/color RGB, non-interlaced
```

**結論**: 画像ファイルは正常なPNGファイルです ✅

---

### 3. 設定ファイルのパス確認 ✅

**src/data/slideshowConfig.ts**:
```typescript
{
  "id": "S001",
  "slidePath": "slide/S001.png",  // ✅ 正しいパス
  "voicePath": "voices/S001.wav",
  "audioDurationFrames": 296
}
```

**結論**: パス設定は正しいです ✅

---

### 4. コンポーネントの実装確認 ✅

**SlideItem.tsx**:
```typescript
<Img
  src={staticFile(slidePath)}  // staticFile("slide/S001.png")
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  }}
/>
```

**結論**: 実装は正しいです ✅

---

### 5. Remotion設定の確認 ✅

**remotion.config.ts**:
```typescript
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
```

**結論**: 最小限の設定で、問題なし ✅

---

## 🚨 推定される原因

### 可能性1: publicフォルダがWebpackに認識されていない ⚠️

Remotionのプレビューサーバーが`public`フォルダを正しく静的ファイルとして提供していない可能性があります。

**確認方法**:
ブラウザで以下のURLに直接アクセス:
```
http://localhost:3000/slide/S001.png
```

- **200 OK** → publicフォルダは正しく提供されている
- **404 Not Found** → publicフォルダの設定に問題あり

---

### 可能性2: RemotionのバージョンとstaticFile()の互換性 ⚠️

Remotionのバージョンによって、`staticFile()`の動作が異なる可能性があります。

**確認方法**:
```bash
npm list remotion
```

---

### 可能性3: スライドの表示ロジックの問題 ⚠️

`SlideItem`コンポーネントで、条件分岐により全てのスライドが非表示になっている可能性があります。

**デバッグ方法**:
ブラウザのコンソールを開いて、以下のログを確認:
```javascript
SlideItem { slidePath: '...', frame: 0, startFrame: 0, relativeFrame: 0, durationFrames: 296, isVisible: true }
```

---

## 🔧 実施したデバッグ対策

### 1. デバッグログの追加 ✅

**SlideItem.tsx**:
- フレーム情報をコンソールに出力
- 画像読み込みエラーをキャッチ
- 背景色を赤に設定（画像が読み込まれない場合に可視化）

**SlideshowVideo.tsx**:
- 設定情報をコンソールに出力
- 各スライドの開始フレームと期間を出力

### 2. テストコンポーネントの追加 ✅

**TestSlide.tsx**:
- 単一の画像を表示するシンプルなコンポーネント
- パス情報を画面に表示
- 画像読み込みの成功/失敗をログ出力

**使用方法**:
プレビューで "TestSlide" を選択して、画像が表示されるか確認

---

## 📋 次のステップ: ユーザーによる確認事項

### ✅ チェックリスト

1. **ブラウザのコンソールを開く**
   - F12キーを押す
   - Consoleタブを選択

2. **プレビューで "TestSlide" を選択**
   - http://localhost:3000 を開く
   - 左側のリストから "TestSlide" を選択
   - 青い背景にS001の画像が表示されるか確認

3. **コンソールログを確認**
   以下のようなログが表示されているか:
   ```
   TestSlide: { imagePath: 'slide/S001.png', fullPath: '/slide/S001.png' }
   Image loaded successfully!
   ```

4. **画像に直接アクセス**
   ブラウザの新しいタブで以下を開く:
   ```
   http://localhost:3000/slide/S001.png
   ```
   - 画像が表示される → ✅ publicフォルダは正しく提供されている
   - 404エラー → ❌ publicフォルダの設定に問題あり

5. **Slideshowを選択**
   - 左側のリストから "Slideshow" を選択
   - コンソールログで以下を確認:
     - `SlideshowVideo config:` で9枚のスライド情報が表示される
     - `SlideItem` でフレーム情報が表示される
     - `isVisible: true` のスライドが存在する

---

## 💡 解決策の候補

### 解決策A: package.jsonのスクリプトを確認

Remotionのプレビューサーバーがpublicフォルダを正しく認識していない可能性があります。

**確認**:
```json
"start": "remotion preview"
```

**修正案**:
```json
"start": "remotion preview --public-dir=public"
```

### 解決策B: インポート方式に変更

`staticFile()`を使わず、直接インポートする方式に変更します。

**現在**:
```typescript
<Img src={staticFile('slide/S001.png')} />
```

**変更後**:
```typescript
import slideImage from '../slide/S001.png';
<Img src={slideImage} />
```

ただし、この方法は動的にパスを指定できないため、全画像を個別にインポートする必要があります。

### 解決策C: 画像をsrcフォルダに配置してrequire()を使用

**変更後**:
```typescript
const imagePath = require(`../../public/slide/${slide.id}.png`);
<Img src={imagePath} />
```

### 解決策D: Remotionのバージョンをアップグレード

古いバージョンのRem otionを使用している場合、`staticFile()`の動作に問題がある可能性があります。

```bash
npm run upgrade
```

---

## 🎯 推奨アクション

1. **ブラウザで画像に直接アクセス** (http://localhost:3000/slide/S001.png)
   - 成功 → 次のステップへ
   - 失敗 → publicフォルダの設定を確認

2. **TestSlideを確認**
   - 画像が表示される → Slideshowのロジックに問題あり
   - 画像が表示されない → staticFile()またはRemotion設定に問題あり

3. **コンソールログを確認**
   - エラーメッセージがあれば報告
   - デバッグログの内容を確認

4. **Remotionのバージョンを確認**
   ```bash
   npm list remotion
   ```

---

## 📊 評価（暫定）

### 完成度: 80% ⚠️

#### ✅ 達成できたこと
- 音声ファイルの生成と配置
- 画像ファイルの配置
- コンポーネントの実装
- 設定ファイルの生成
- タイミング調整

#### ❌ 未解決の問題
- 画像が表示されない（原因調査中）

#### 🔍 調査状況
- ファイルの存在: ✅ 確認済み
- パス設定: ✅ 確認済み
- コンポーネント実装: ✅ 確認済み
- **Remotionとの統合**: ⚠️ 調査中

---

## 次回報告内容

以下の情報を提供してください：

1. ブラウザで http://localhost:3000/slide/S001.png を開いた結果（画像が表示されるか、404エラーか）
2. TestSlideで画像が表示されるか
3. ブラウザのコンソールに表示されているログ（特にエラーメッセージ）
4. Remotionのバージョン（`npm list remotion`の結果）

この情報を元に、最終的な解決策を提案します。
