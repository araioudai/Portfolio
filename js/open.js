/*
 ナビゲーションメニュー開閉処理
*/

//メニュー全体を取得
const items = document.querySelectorAll('.item');

//トリガークリックで開閉
items.forEach(item => {
    const btn = item.querySelector('.trigger');
    btn.addEventListener('click', (e) => {

        //他のメニューは閉じる
        items.forEach(i => {
            if (i !== item) i.classList.remove('open');
        });

        //クリックしたメニューをトグル
        item.classList.toggle('open');
        e.stopPropagation(); //外側クリックと干渉させない
    });
});

//画面のどこかをクリックしたら全て閉じる
document.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('open'));
});

//サブメニューリンククリックで閉じる
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('open'));
    });
});


//DOM読み込み後の初期処理
document.addEventListener('DOMContentLoaded', function () {

    //詳細が無いゲームのボタンを無効化
    document.querySelectorAll('.detail-btn[data-game]').forEach(btn => {
        const game = btn.getAttribute('data-game');
        const detail = document.getElementById(`${game}-detail`);

        //detailが存在しない or 中身が空なら無効化
        if (!detail || detail.innerHTML.trim() === '') {
            btn.classList.add('disabled');         //見た目をグレーに
            btn.classList.remove('modal-trigger'); //モーダル対象から外す
            btn.setAttribute('aria-disabled', 'true');
        }
    });


    //ゲームセクション全体クリック → モーダル表示
    document.querySelectorAll('.game-section').forEach(section => {
        section.addEventListener('click', (e) => {

            //disabled要素がクリックされたら何もしない
            if (e.target.classList.contains('disabled')) return;

            //ボタンやリンクは無視
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;

            const game = section.getAttribute('data-game');
            if (!game) return;

            const detailElem = document.getElementById(`${game}-detail`);
            if (!detailElem || detailElem.innerHTML.trim() === '') return;

            //モーダルに詳細を挿入
            document.getElementById('modal-body').innerHTML = detailElem.innerHTML;

            //モーダル表示
            openModal();
        });
    });


    //「詳細を見る」ボタンクリック処理
    document.querySelectorAll('.modal-trigger[data-game]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {

            //disabledなら何もしない
            if (e.target.classList.contains('disabled')) return;

            const game =
                e.target.getAttribute('data-game') ||
                e.target.closest('[data-game]')?.getAttribute('data-game');

            if (!game) return;

            const detailElem = document.getElementById(`${game}-detail`);
            if (!detailElem || detailElem.innerHTML.trim() === '') return;

            //モーダルに詳細を挿入
            document.getElementById('modal-body').innerHTML = detailElem.innerHTML;

            //モーダル表示
            openModal();
        });
    });


    //活動タブ切り替え処理
    const tabBtns = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.activity-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            //タブのアクティブ切り替え
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            //コンテンツ切り替え
            contents.forEach(c => c.classList.remove('active'));
            const activity = btn.getAttribute('data-activity');
            const target = document.querySelector(`.activity-content[data-activity="${activity}"]`);
            if (target) target.classList.add('active');

            //スライダー再初期化
            setTimeout(initActivitySliders, 300);
        });
    });



    //モーダル閉じる処理
    document.querySelector('.close').addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('game-modal');
        if (e.target === modal) closeModal();
    });


    //初期表示（スポーツサークル）
    document.querySelector('.activity-content[data-activity="sports"]')
        ?.classList.add('active');

    setTimeout(initActivitySliders, 200);

    // lightboxの初期化後にPDFリンクを除外
    $(document).ready(function () {
        // lightboxのリンクをフィルタリング（PDFを除外）
        $('a[data-lightbox]').each(function () {
            var href = $(this).attr('href');
            if (href && href.endsWith('.pdf')) {
                $(this).removeAttr('data-lightbox'); // PDFリンクからlightboxを削除
            }
        });
    });
});


//モーダルを開く関数（共通）
function openModal() {
    const modal = document.getElementById('game-modal');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    // Slick初期化（画像ロード後）
    waitForImages('#modal-body img').then(() => {
        initializeSlickInModal();
    });
}



//モーダルを閉じる関数（共通）
function closeModal() {
    const modal = document.getElementById('game-modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');

    // Slick破棄
    const slider = $('#modal-body .slider');
    if (slider.length && slider.hasClass('slick-initialized')) {
        slider.slick('unslick');
    }
}


//Slick（モーダル内）初期化
function initializeSlickInModal() {
    const slider = $('#modal-body .slider');
    if (!slider.length || slider.hasClass('slick-initialized')) return;

    slider.slick({
        slidesToShow: 1,
        dots: true,
        arrows: true,
        swipe: true
    });
}


//活動スライダー初期化
function initActivitySliders() {
    const slider = $('.activity-content.active .slider');
    if (!slider.length || slider.hasClass('slick-initialized')) return;

    slider.slick({
        slidesToShow: 1,
        autoplay: true,
        dots: true,
        arrows: true
    });
}


//画像ロード待ち（Promise）
function waitForImages(selector) {
    const images = document.querySelectorAll(selector);
    const promises = [...images].map(img => {
        return new Promise(resolve => {
            if (img.complete) resolve();
            else img.onload = resolve;
        });
    });
    return Promise.all(promises);
}
