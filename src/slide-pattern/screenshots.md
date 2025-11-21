---
marp: true
---

# タイトル

<!-- アップロードされた画像のローカルパスをそのまま利用 -->
<img src="/mnt/data/13978daf-3d42-4e66-b2b5-6bf7ba6fb7e1.png" width="700">

<style>
/* 全体：上詰め＆左寄せ＋淡いブルー背景＋濃いブルー文字 */
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

/* タイトル：上部＋中央寄せ、濃いブルーで統一 */
h1 {
  align-self: center;
  color: #003a8c;
  text-align: center;
  font-size: 54px;
  font-weight: 700;
  margin-top: 4px;
  margin-bottom: 24px;
}

/* 画像（スクショ）は中央配置＋少し影をつけて柔らかさUP */
img {
  display: block;
  margin: 20px auto 0 auto;
  border-radius: 10px;
  box-shadow: 0 0 14px rgba(0,0,0,0.12);
}
</style>
