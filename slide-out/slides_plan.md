---
marp: true
paginate: false
theme: default
---

<style>
/* スライド全体の背景と基本文字色 */
section {
  background: #f0f8ff;
  color: #003a8c;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}

/* 中央のメッセージ */
.big-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  font-size: 64px;
  font-weight: 700;
  color: #003a8c;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}
</style>

<!-- S001 -->

<div class="big-center">
なんでもかんでもRAGじゃない
</div>

---

<style>
section {
  background: #f0f8ff;
  color: #003a8c;
  font-size: 40px;
  padding: 24px 72px 40px 72px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}

h1 {
  align-self: center;
  color: #003a8c;
  font-weight: 700;
  font-size: 55px;
  margin-top: 8px;
  margin-bottom: 24px;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}

h2, h3 {
  color: #003a8c;
  font-weight: 700;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}

.list-index {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  margin-right: 16px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 32px;
  background: #ffeb99;
  color: #003a8c;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}
</style>

<!-- S002 -->

# よくある相談パターン

<div class="list-item">
  <div class="list-index">1</div>
  <div>「RAGを入れないといけない」という声が多い</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>プロンプトだけで十分に回るケースが多い</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>パターン化できるならRAGより精度が上がることも</div>
</div>

---

<!-- S003 -->

# 問い①：全部見てほしいか？

<div class="list-item">
  <div class="list-index">1</div>
  <div>AIにデータを全部見てほしいのかどうか</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>全部読んで判断してほしいなら部分検索のRAGは向かない</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>全文を読ませるほうが自然で確実</div>
</div>

---

<!-- S004 -->

# 問い②：入力上限に収まる？

<div class="list-item">
  <div class="list-index">1</div>
  <div>GPT/Claudeは10〜20万字、Geminiは100万字以上という上限</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>意外と全部入る。コストはほんのわずか</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>複雑なRAGを組むより安く・速く・安定して動く</div>
</div>

---

<!-- S005 -->

# 問い③：パターン数は？

<div class="list-item">
  <div class="list-index">1</div>
  <div>問い合わせや業務が10〜20パターンほどならテンプレート化が最適</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>業界別に作ったプロンプトは使い回しが簡単</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>精度も運用性も申し分ない</div>
</div>

---

<!-- S006 -->

# RAGが必要ない条件

<div class="list-item">
  <div class="list-index">1</div>
  <div>全部見たいならプロンプトに入れる</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>上限に収まるなら全文を入れる</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>パターンが少ないならテンプレ化する</div>
</div>

<div class="list-item">
  <div class="list-index">4</div>
  <div>この条件がそろえばRAGは必要ない</div>
</div>

<div class="list-item">
  <div class="list-index">5</div>
  <div>もっとシンプルで強い選択肢がある</div>
</div>

---

<!-- S007 -->

# RAGは万能ではない

<div class="list-item">
  <div class="list-index">1</div>
  <div>RAGは万能の正義ではない</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>適材適所でこそ輝く技術</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>どんな状況でもRAGに頼る必要はない</div>
</div>

---

<!-- S008 -->

# 今日覚えておきたいこと

<div class="list-item">
  <div class="list-index">1</div>
  <div>RAGは部分を取り出す仕組み</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>全部読ませたいなら向かない。収まるなら全文投入が合理的</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>パターンが少ないならテンプレ化で十分</div>
</div>

<div class="list-item">
  <div class="list-index">4</div>
  <div>状況に合わせて柔軟に選ぶことが鍵</div>
</div>

---

<!-- S009 -->

# RAGを使わない勇気

<div class="list-item">
  <div class="list-index">1</div>
  <div>勢いでRAGを導入して失敗する事例は多い</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>「本当に必要か」を落ち着いて見極める</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>RAGを使わない勇気が成功を近づける</div>
</div>