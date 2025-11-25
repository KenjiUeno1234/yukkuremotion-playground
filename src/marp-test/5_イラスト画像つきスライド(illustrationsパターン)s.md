---
marp: true
backgroundImage: url('makimono.png')
---

# タイトル

<img src="your-image.png" width="600">

<style>
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&display=swap');

/* 全体を上詰め＆左寄せにする */
section {
  font-family: "Shippori Mincho", "Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 16px 60px 40px 60px;
  color: #d0bc89;
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000,
     0px  2px 3px #000;
}

/* タイトル：上部＋中央寄せしたいので横だけセンター */
h1 {
  align-self: center;
  color: #d0bc89;
  text-align: center;
  font-size: 54px;
  font-weight: 700;
  margin-top: 4px;
  margin-bottom: 24px;
  text-shadow:
    -2px -2px 0 #000,
     2px -2px 0 #000,
    -2px  2px 0 #000,
     2px  2px 0 #000,
     0px  3px 6px #000;
  letter-spacing: 0.08em;
}

/* 画像は中央にドンと置く */
img {
  display: block;
  margin: 20px auto 0 auto;
  border-radius: 12px;
}
</style>
