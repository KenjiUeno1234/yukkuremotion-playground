---
marp: true
theme: default
paginate: true
---

<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 40px;
}

/* 番号付きリストのレイアウト */
.list-items {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 80%;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.list-index {
  margin: 0;
}

.list-index span {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #16a34a;  /* 緑の丸 */
  color: #fff;
  font-weight: 700;
  font-size: 20px;
}
</style>

## Git便利Tips

<div class="list-items">
  <div class="list-item">
    <p class="list-index"><span>1</span></p>
    <p>Discard Change(変更を取り除く)</p>
  </div>

  <div class="list-item">
    <p class="list-index"><span>2</span></p>
    <p>Revert(コミットを打ち消し)</p>
  </div>

  <div class="list-item">
    <p class="list-index"><span>3</span></p>
    <p>マージコンフリクト解消</p>
  </div>

  <div class="list-item">
    <p class="list-index"><span>4</span></p>
    <p>.gitignore</p>
  </div>
</div>

---

## Discard Change(変更を取り除く)

<div class="list-items">
  <div class="list-item">
    <p class="list-index"><span>1</span></p>
    <p>作業中のファイルの変更を「なかったこと」にする機能</p>
  </div>
</div>
