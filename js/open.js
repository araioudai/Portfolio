//クリックでメニューを開閉する処理
const items = document.querySelectorAll('.item');

items.forEach(item => {
  const btn = item.querySelector('.trigger');
  btn.addEventListener('click', (e) => {
    //他のメニューを閉じる
    items.forEach(i => { if (i !== item) i.classList.remove('open'); });
    //今クリックした要素をトグル（開く or 閉じる）
    item.classList.toggle('open');
    e.stopPropagation(); //外側クリックイベントと干渉しないようにする
  });
});

//画面のどこかをクリックしたら全て閉じる
document.addEventListener('click', () => {
  items.forEach(i => i.classList.remove('open'));
});

//サブメニューのリンクを押したらメニューを閉じる
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    //すべてのメニューを閉じる
    items.forEach(i => i.classList.remove('open'));
  });
});