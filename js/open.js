//すべての .trigger にクリックイベントを付与
const items = document.querySelectorAll('.item');

items.forEach(item => {
  const btn = item.querySelector('.trigger');
  btn.addEventListener('click', (e) => {
    //他のメニューを閉じる
    items.forEach(i => { if (i !== item) i.classList.remove('open'); });
    //今クリックした要素をトグル
    item.classList.toggle('open');
    e.stopPropagation(); //外側クリックイベントと干渉しないように
  });
});

//画面のどこかをクリックしたら閉じる
document.addEventListener('click', () => {
  items.forEach(i => i.classList.remove('open'));
});