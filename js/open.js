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

// ゲームセクション全体のクリックイベント（どこをクリックしてもモーダルを開く）
document.querySelectorAll('.game-section').forEach(section => {
    section.addEventListener('click', (e) => {
        // ボタンやリンクのクリックは無視（イベントバブリングを防ぐ）
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
        
        const game = section.getAttribute('data-game');
        if (game) {
            const detailId = `${game}-detail`;
            const detailContent = document.getElementById(detailId).innerHTML;
            
            // モーダルに詳細を挿入
            document.getElementById('modal-body').innerHTML = detailContent;
            
            // モーダルを表示
            document.getElementById('game-modal').style.display = 'block';
        }
    });
});

// 既存のモーダルトリガー（説明文、タイトル、ボタン）のイベント
document.querySelectorAll('.modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        const game = e.target.getAttribute('data-game') || e.target.closest('[data-game]').getAttribute('data-game');
        if (game) {
            const detailId = `${game}-detail`;
            const detailContent = document.getElementById(detailId).innerHTML;
            
            // モーダルに詳細を挿入
            document.getElementById('modal-body').innerHTML = detailContent;
            
            // モーダルを表示
            document.getElementById('game-modal').style.display = 'block';
        }
    });
});

// モーダルを閉じるイベント
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('game-modal').style.display = 'none';
});

// モーダル外クリックで閉じる
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('game-modal')) {
        document.getElementById('game-modal').style.display = 'none';
    }
});