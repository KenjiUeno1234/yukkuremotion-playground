<style>
/* 全体：左上寄せ＋淡いブルー背景＋濃いブルー文字 */
section {
  background: radial-gradient(circle at top left,
    #ffffff 0%,
    #f4f8ff 40%,
    #e0efff 100%);
  color: #003a8c;
  text-shadow: 0 0 6px rgba(255,255,255,0.8);
  font-size: 40px;
  padding: 24px 72px 40px 72px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}

/* タイトル */
h1 {
  align-self: center;
  color: #003a8c;
  font-weight: 700;
  font-size: 55px;
  margin-top: 8px;
  margin-bottom: 24px;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}

/* 2枚目以降の見出し用（必要なら） */
h2, h3 {
  color: #003a8c;
  font-weight: 700;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
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
  background: #ffeb99;   /* 明るいイエロー */
  color: #003a8c;        /* 濃いブルー文字 */
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
}

/* リスト1行のブロック */
.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
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
