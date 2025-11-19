---
marp: true
paginate: true
backgroundImage: url('chalkboard.png')
theme: default
---

<style>
/* 全体：左上寄せ＋文字大きめ */
section {
  color: #f8f8f8;
  text-shadow: 0 0 6px rgba(0,0,0,0.6);
  font-size: 40px;                  /* ★ 基本フォントサイズをドンとUP */
  padding: 24px 72px 40px 72px;     /* 少しだけ余白を広げてバランス調整 */

  display: flex;
  flex-direction: column;
  justify-content: flex-start;      /* 上詰め */
  align-items: flex-start;          /* 左寄せ */
  gap: 10px;                        /* ブロック間の余白 */
}

/* タイトル */
h1 {
  align-self: center;               /* 横方向だけ中央 */
  color: #ffffff;
  font-weight: 700;
  font-size: 55px;
  margin-top: 8px;
  margin-bottom: 24px;
}

/* 2枚目以降の見出し用（必要なら） */
h2, h3 {
  color: #ffffff;
  font-weight: 700;
}

/* 丸番号アイコン（①②③…） */
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
  background: rgba(80, 180, 80, 0.9);
  color: #ffffff;
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
