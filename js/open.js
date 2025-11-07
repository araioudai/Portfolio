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
            
            // モーダルを表示し、背景を固定
            const modal = document.getElementById('game-modal');
            modal.style.display = 'block';
            document.body.classList.add('modal-open'); // 背景固定

            // Slickを即時初期化（遅延短く）
            setTimeout(() => {
                initializeSlickInModal();
            }, 100); // 100ms遅延
        }
    });
});

// Slick初期化関数（共通化、スワイプ対応追加）
function initializeSlickInModal() {
    const modalSlider = $('#modal-body .slider');
    if (modalSlider.length > 0) {
        // 既存のSlickを破棄（重複初期化防止）
        if (modalSlider.hasClass('slick-initialized')) {
            modalSlider.slick('unslick');
        }
        
        modalSlider.slick({
            infinite: false, // 無限ループオフ
            slidesToShow: 1, // 1枚表示（横幅確保）
            slidesToScroll: 1,
            autoplay: false,
            dots: true,
            arrows: true,
            centerMode: true, // 中央揃えオン
            centerPadding: '20px', // 余白追加
            accessibility: false,
            swipe: true, // スワイプ有効（Slick内）
            touchMove: true, // タッチ移動有効（Slick内）
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: true
                    }
                }
            ]
        });

        // Slickスライド変更時にモーダルのスクロール位置を調整
        modalSlider.on('afterChange', function(event, slick, currentSlide) {
            const modalContent = document.querySelector('.modal-content');
            const slideHeight = modalContent.scrollHeight / slick.slideCount; // 各スライドの高さを推定
            modalContent.scrollTop = currentSlide * slideHeight; // 現在のスライド位置にスクロール
            console.log(`Scrolled to slide ${currentSlide}, scrollTop: ${modalContent.scrollTop}`); // デバッグ用
        });

        // Slick初期化後にクローンを除外（モーダル内限定）
        $('#modal-body .slider .slick-cloned a[data-lightbox]').removeAttr('data-lightbox');

        // Lightboxを再設定
        lightbox.option({
            'resizeDuration': 400,
            'wrapAround': true
        });

        console.log('Slick initialized in modal'); // デバッグ用
    }
}

// モーダル表示後に画像ロードを待つ（Promise使用）
function waitForImages(selector) {
    const images = document.querySelectorAll(selector);
    const promises = Array.from(images).map(img => {
        return new Promise(resolve => {
            if (img.complete) {
                resolve();
            } else {
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve); // エラー時も進む
            }
        });
    });
    return Promise.all(promises);
}

// クリックイベントの設定
document.addEventListener('DOMContentLoaded', function() {
    // モーダルトリガーのクリックイベント
    document.querySelectorAll('.modal-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const game = e.target.getAttribute('data-game') || e.target.closest('[data-game]').getAttribute('data-game');
            if (game) {
                const detailId = `${game}-detail`;
                const detailContent = document.getElementById(detailId).innerHTML;
                
                // モーダルに詳細を挿入
                document.getElementById('modal-body').innerHTML = detailContent;
                
                // モーダルを表示し、背景を固定
                const modal = document.getElementById('game-modal');
                modal.style.display = 'block';
                document.body.classList.add('modal-open'); // 背景固定

                // 画像ロードを待ってSlick初期化
                waitForImages('#modal-body img').then(() => {
                    initializeSlickInModal();
                });
            }
        });
    });

    // モーダルを閉じるイベント（背景固定解除）
    document.querySelector('.close').addEventListener('click', () => {
        closeModal();
    });

    // モーダル外クリックで閉じる（背景固定解除）
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('game-modal');
        if (e.target === modal) {
            closeModal();
        }
    });

    // モーダルのスワイプ操作（上下）
    let startY = 0;
    let currentY = 0;
    const modalContent = document.querySelector('.modal-content');

    modalContent.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY; // タッチ開始位置
    });

    modalContent.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const diffY = currentY - startY;
        if (diffY > 0) { // 下方向スワイプのみ許可
            modalContent.style.transform = `translateY(${diffY}px)`; // モーダルを下に移動
        }
    });

    modalContent.addEventListener('touchend', (e) => {
        const diffY = currentY - startY;
        if (diffY > 100) { // スワイプ距離が100px以上で閉じる
            closeModal();
        } else {
            modalContent.style.transform = 'translateY(0)'; // 元に戻す
        }
    });
});

// モーダルを閉じる関数（共通化）
function closeModal() {
    const modal = document.getElementById('game-modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open'); // 背景固定解除
    document.querySelector('.modal-content').style.transform = 'translateY(0)'; // リセット
}