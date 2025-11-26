---
marp: true
paginate: true
backgroundImage: url('makimono.png')
theme: default
---

<style>
/* 全体：左上寄せ＋文字大きめ */
section {
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

/* タイトル */
h1 {
  align-self: center;
  color: #d0bc89;
  font-weight: 700;
  font-size: 55px;
  margin-top: 8px;
  margin-bottom: 24px;
  letter-spacing: 0.08em;
}

h2, h3 {
  color: #d0bc89;
  font-weight: 700;
}

/* 丸番号アイコン */
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
  background: #d0bc89;
  color: #0d0701;
}

/* リスト1行のブロック */
.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>

# タイトル

<div class="list-item">
  <div class="list-index">1</div>
  <div>テキスト1</div>
</div>

<div class="list-item">
  <div class="list-index">2</div>
  <div>テキスト2</div>
</div>

<div class="list-item">
  <div class="list-index">3</div>
  <div>テキスト3</div>
</div>

<div class="list-item">
  <div class="list-index">4</div>
  <div>テキスト4</div>
</div>

<div class="list-item">
  <div class="list-index">5</div>
  <div>テキスト5</div>
</div>
