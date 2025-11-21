---
marp: true
theme: default
paginate: true
---

<style>
/* 全体：左上寄せ＋淡いブルー背景＋濃いブルー文字 */
section {
  background: radial-gradient(circle at top left,
    #ffffff 0%,
    #f4f8ff 40%,
    #e0efff 100%);
  color: #003a8c;
  text-shadow: 0 0 6px rgba(255,255,255,0.8);
  font-size: 36px;
  padding: 40px 60px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
}

/* タイトル */
h1 {
  align-self: center;
  color: #003a8c;
  font-weight: 700;
  font-size: 52px;
  margin-top: 0px;
  margin-bottom: 20px;
}

h2, h3 {
  color: #003a8c;
  font-weight: 700;
}

/* 丸番号アイコン */
.list-index {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  margin-right: 14px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 28px;
  background: #ffeb99;   /* 明るいイエロー */
  color: #003a8c;        /* 濃いブルー文字 */
  flex-shrink: 0;
}

/* リスト1行のブロック */
.list-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  line-height: 1.4;
}

/* 中央のメッセージ（strong-message用） */
.big-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-size: 60px;
  font-weight: 700;
  color: #003a8c;
  text-shadow: 0 0 8px rgba(255,255,255,0.9);
  text-align: center;
  padding: 40px;
}
</style>


<!-- S001 -->

<div class="big-center">
なんでもかんでもRAGじゃない
</div>

---

<!-- S002 -->

# よくある相談パターン

<div class="list-item">
  <div class="list-index">1</div>
  <div>「RAGを入れないとダメですよね？」という声をよく耳にする</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>実際は、プロンプトだけで綺麗に回せるケースがたくさんある</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>内容がパターン化できるなら、むしろRAGより精度が上がることも</div>
</div>

---

<!-- S003 -->

# 問い①：全部参照する？

<div class="list-item">
  <div class="list-index">1</div>
  <div>「AIに全部の情報を見てほしいのかどうか」を考える</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>全部読んだうえで判断してほしいなら、部分検索のRAGは不向き</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>全文を読ませるアプローチのほうが自然</div>
</div>

---

<!-- S004 -->

# 問い②：入力上限に収まる？

<div class="list-item">
  <div class="list-index">1</div>
  <div>GPTやClaudeは10〜20万字、Geminiなら100万字以上入る</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>全文を入れてもコストはごくわずか</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>RAGを作り込むより、速くて安定していることが多い</div>
</div>

---

<!-- S005 -->

# 問い③：パターンは何個？

<div class="list-item">
  <div class="list-index">1</div>
  <div>パターンが10〜20種類くらいならテンプレート化が最適</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>業界別に作っておけば使い回しも簡単</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>精度も運用も申し分ない</div>
</div>

---

<!-- S006 -->

# 3つの問いまとめ

<div class="list-item">
  <div class="list-index">1</div>
  <div>「全部見たい」ならそのままプロンプトへ</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>「上限に収まる」なら全文を入れる</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>「パターンが少ない」ならテンプレ化</div>
</div>

<div class="list-item">
  <div class="list-index">4</div>
  <div>この条件がそろえば、RAGは必要ありません</div>
</div>

<div class="list-item">
  <div class="list-index">5</div>
  <div>もっとシンプルで強い方法があるから</div>
</div>

---

<!-- S007 -->

# RAG＝正義ではない

<div class="list-item">
  <div class="list-index">1</div>
  <div>RAGは万能ではない</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>適材適所でこそ輝く技術</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>「どの状況でもRAGが正解」というわけではない</div>
</div>

---

<!-- S008 -->

# 今日のポイント

<div class="list-item">
  <div class="list-index">1</div>
  <div>RAGは「部分を取り出す技術」</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>全部読む用途には向かない</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>入力が収まるなら全文投入でOK</div>
</div>

<div class="list-item">
  <div class="list-index">4</div>
  <div>パターンが少ないならテンプレ化が最善</div>
</div>

<div class="list-item">
  <div class="list-index">5</div>
  <div>状況に合わせて賢く選ぶことが大切</div>
</div>

---

<!-- S009 -->

# RAGを使わない勇気を

<div class="list-item">
  <div class="list-index">1</div>
  <div>勢いでRAGを作って失敗する例は少なくない</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>まずは「本当に必要か」を落ち着いて見極める</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>RAGを使わない判断こそ、成功を近づける大事な一歩</div>
</div>