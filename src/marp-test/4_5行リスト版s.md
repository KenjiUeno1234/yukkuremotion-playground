---
marp: true
paginate: true
backgroundImage: url('makimono.png')
theme: default
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&display=swap');

/* 全体：左上寄せ＋文字大きめ */
section {
  font-family: "Shippori Mincho", "Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif;
  color: #d0bc89;
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000,
     0px  2px 3px #000;
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
  text-shadow:
    -2px -2px 0 #000,
     2px -2px 0 #000,
    -2px  2px 0 #000,
     2px  2px 0 #000,
     0px  3px 6px #000;
  letter-spacing: 0.08em;
}

h2, h3 {
  color: #d0bc89;
  font-weight: 700;
  text-shadow:
    -2px -2px 0 #000,
     2px -2px 0 #000,
    -2px  2px 0 #000,
     2px  2px 0 #000,
     0px  3px 6px #000;
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
  box-shadow:
    0 0 0 2px #3b2d1b,
    0 2px 4px rgba(0, 0, 0, 0.8);
  text-shadow:
    0 1px 1px rgba(255, 255, 255, 0.2),
    0 -1px 1px rgba(0, 0, 0, 0.7);
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
