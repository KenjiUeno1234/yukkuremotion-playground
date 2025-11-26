---
marp: true
paginate: false
backgroundImage: url('../src/slide-pattern/makimono.png')
theme: default
class: strong-message-slide
---

<style>
section.strong-message-slide {
  font-family: "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", "Noto Serif JP", serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

section.strong-message-slide .big-center {
  font-size: 64px;
  font-weight: 700;
  color: #d0bc89;
  letter-spacing: 0.1em;
}
</style>

<!-- S001 -->
<div class="big-center">
なんでもかんでもRAGじゃない
</div>

---

<!-- _class: list-slide -->

<style>
section.list-slide {
  font-family: "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", "Noto Serif JP", serif;
  color: #d0bc89;
  font-size: 40px;
  padding: 24px 72px 40px 72px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}

section.list-slide h1 {
  align-self: center;
  color: #d0bc89;
  font-weight: 700;
  font-size: 55px;
  margin-top: 8px;
  margin-bottom: 24px;
  letter-spacing: 0.08em;
}

section.list-slide h2,
section.list-slide h3 {
  color: #d0bc89;
  font-weight: 700;
}

section.list-slide .list-index {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  margin-right: 16px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 32px;
  background: #d0bc89;
  color: #0d0701;
}

section.list-slide .list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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

<!-- _class: list-slide -->

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

<!-- _class: list-slide -->

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

<!-- _class: list-slide -->

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

<!-- _class: list-slide -->

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

<!-- _class: list-slide -->

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

<!-- _class: list-slide -->

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

<!-- _class: list-slide -->

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
