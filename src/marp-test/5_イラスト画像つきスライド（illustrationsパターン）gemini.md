---
marp: true
---

# タイトル

<img src="your-image.png" width="600">

<style>
/* 全体を上詰め＆左寄せ＋淡いブルー背景＋濃いブルー文字 */
section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 16px 60px 40px 60px;

  background: radial-gradient(circle at top left,
    #ffffff 0%,
    #f4f8ff 40%,
    #e0efff 100%);
  color: #003a8c;
  text-shadow: 0 0 6px rgba(255,255,255,0.8);
  font-size: 40px;
}

/* タイトル：上部＋中央寄せ（色は濃いブルー） */
h1 {
  align-self: center;
  color: #003a8c;
  text-align: center;
  font-size: 54px;
  font-weight: 700;
  margin-top: 4px;
  margin-bottom: 24px;
}

/* 画像は中央にドンと置く */
img {
  display: block;
  margin: 20px auto 0 auto;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0,0,0,0.08);
}
</style>
