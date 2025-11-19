---
marp: true
backgroundImage: url('chalkboard.png')
---

# タイトル

<img src="your-image.png" width="600">

<style>
/* 全体を上詰め＆左寄せにする */
section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;   /* ← 縦方向を上に寄せる */
  align-items: flex-start;       /* ← 左寄せ */
  padding: 16px 60px 40px 60px;
  color: #ffffff;                /* 文字色を白に */
}

/* タイトル：上部＋中央寄せしたいので横だけセンター */
h1 {
  align-self: center;            /* ← 横方向のみ中央に */
  color: #ffffff;
  text-align: center;
  font-size: 54px;
  margin-top: 4px;               /* ほぼ最上部に寄せる */
  margin-bottom: 24px;
}

/* 画像は中央にドンと置く */
img {
  display: block;
  margin: 20px auto 0 auto;
  border-radius: 12px;
}
</style>
