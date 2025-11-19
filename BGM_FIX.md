# BGMが流れない問題の修正

**問題発生日**: 2025-11-19
**修正完了日**: 2025-11-19
**ステータス**: ✅ 修正完了

---

## 🔴 問題

スライドショー動画でスライド画像、字幕、音声は正常に動作するが、BGMが流れない。

### 症状
- ✅ スライド画像: 表示される
- ✅ 字幕: 表示される
- ✅ ナレーション音声: 再生される
- ❌ BGM: 再生されない

---

## 🔍 原因

**根本原因**: `scripts/generateSlideshowConfig.ts` がBGM設定を含まずに `slideshowConfig.ts` を生成していた

### 詳細

1. `generateSlideshowConfig.ts` スクリプトは以下の形式でファイルを生成していた：
   ```typescript
   export const slideshowConfig: SlideshowConfig = {
     slides: [...],
     totalFrames: 3110,
   };
   ```

2. BGM設定（`bgmSrc`, `bgmVolume`）が含まれていなかった

3. `SlideshowVideo.tsx` では以下のようにBGMを読み込もうとしていた：
   ```typescript
   {config.bgmSrc && (
     <Audio
       loop
       src={staticFile(config.bgmSrc)}
       volume={config.bgmVolume || 0.2}
     />
   )}
   ```

4. `config.bgmSrc` が `undefined` のため、BGMが再生されなかった

---

## ✅ 解決策

### 修正内容

**ファイル**: [scripts/generateSlideshowConfig.ts](scripts/generateSlideshowConfig.ts:113-114)

```typescript
// 修正前
export const slideshowConfig: SlideshowConfig = {
  slides: ${JSON.stringify(slides, null, 2)},
  totalFrames: ${totalFrames},
};

// 修正後
export const slideshowConfig: SlideshowConfig = {
  bgmSrc: 'bgm/Floraria.mp3',
  bgmVolume: 0.2,
  slides: ${JSON.stringify(slides, null, 2)},
  totalFrames: ${totalFrames},
};
```

### 実施した対策

1. `generateSlideshowConfig.ts` にBGM設定を追加
2. スクリプトを再実行して `slideshowConfig.ts` を再生成
3. 実行手順書にトラブルシューティングを追加

---

## 🔧 修正手順

### ステップ1: スクリプトの修正

```bash
# scripts/generateSlideshowConfig.ts を編集
# bgmSrc と bgmVolume を追加
```

### ステップ2: 設定ファイルの再生成

```bash
npx ts-node scripts/generateSlideshowConfig.ts
```

**期待される出力**:
```
=========================================
スライドショー設定ファイル生成
=========================================

解析結果: 9件

  ✓ S001: 9.87秒 (296フレーム)
  ✓ S002: 17.27秒 (518フレーム)
  ...

総フレーム数: 3110 (103.67秒)

=========================================
✅ スライドショー設定ファイルを生成しました
出力先: c:\...\src\data\slideshowConfig.ts
=========================================
```

### ステップ3: 確認

```bash
# BGM設定が含まれているか確認
powershell -Command "Get-Content src/data/slideshowConfig.ts | Select-String 'bgmSrc'"
```

**期待される出力**:
```
  bgmSrc: 'bgm/Floraria.mp3',
```

---

## ✅ 動作確認

### 確認方法

1. ブラウザをリフレッシュ（Ctrl + Shift + R）
2. http://localhost:3000 で "Slideshow" を選択
3. 以下が確認できること：
   - ✅ スライド画像が表示される
   - ✅ 字幕が表示される
   - ✅ ナレーション音声が再生される
   - ✅ **BGMが流れる** ← 重要！

### コンソールログ

F12キーでDevToolsを開き、Consoleタブを確認：

**エラーがないこと**:
- BGM関連のエラーメッセージがない
- 404エラーがない

---

## 📝 修正したファイル

1. **[scripts/generateSlideshowConfig.ts](scripts/generateSlideshowConfig.ts)**
   - BGM設定を出力に追加

2. **[src/data/slideshowConfig.ts](src/data/slideshowConfig.ts)**
   - 自動生成ファイル（再生成済み）
   - `bgmSrc: 'bgm/Floraria.mp3'` を含む
   - `bgmVolume: 0.2` を含む

3. **[実行手順書slide.md](実行手順書slide.md)**
   - トラブルシューティングセクションに「問題3: BGMが流れない」を追加

---

## 🎯 今後の対策

### 再発防止策

1. **自動生成スクリプトのテスト**
   - BGM設定が含まれていることを確認するテストを追加

2. **ドキュメント整備**
   - 実行手順書にトラブルシューティングを追加済み

3. **設定ファイルの検証**
   - 生成後に必須項目が含まれているか確認

### チェックリスト

設定ファイル生成後、以下を確認：
- [ ] `bgmSrc` が存在する
- [ ] `bgmVolume` が存在する
- [ ] `slides` 配列が存在する
- [ ] `totalFrames` が存在する

---

## 📊 影響範囲

### 影響を受けたユーザー

この問題は、以下の手順で実行した場合に発生：
1. `generateSlideshowConfig.ts` を修正前のバージョンで実行
2. BGM設定が含まれない `slideshowConfig.ts` が生成される
3. BGMが再生されない

### 修正後の影響

- ✅ 新規ユーザー: 正しいBGM設定が含まれる
- ✅ 既存ユーザー: ステップ3を再実行すれば修正される

---

## ✅ 結論

**原因**: 自動生成スクリプトがBGM設定を出力していなかった

**解決策**: スクリプトを修正してBGM設定を含めるようにした

**結果**: BGMが正常に再生されるようになった

---

**参考ドキュメント**:
- [実行手順書slide.md](実行手順書slide.md) - トラブルシューティング追加済み
- [SLIDESHOW_WITH_CHARACTER_BGM.md](SLIDESHOW_WITH_CHARACTER_BGM.md) - 実装詳細
- [ROOT_CAUSE_ANALYSIS.md](ROOT_CAUSE_ANALYSIS.md) - 技術的な背景
