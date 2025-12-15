//ページ読み込み完了後に実行
$(document).ready(function(){

    //slick を適用するスライダー要素を取得
    const $slider = $('.slider');

    //要素が存在しない場合は何もしない（エラー防止）
    if ($slider.length === 0) return;

    //すでに slick が初期化されているか確認
    //（二重初期化・unslickエラー防止）
    if ($slider.hasClass('slick-initialized')) {
        $slider.slick('unslick'); //一度解除してから再初期化
    }

    //slick 初期化
    $slider.slick({
        infinite: false,          //無限ループオフ（写真複製防止）
        slidesToShow: 3,          //PCで3枚表示
        slidesToScroll: 1,        //1枚ずつスクロール
        autoplay: false,          //自動再生オフ
        dots: true,               //ドットナビゲーション表示
        arrows: true,             //矢印ナビゲーション表示
        accessibility: false,     //ADA関連のエラーを防ぐ

        //画面サイズごとの表示調整
        responsive: [
            {
                breakpoint: 768, //モバイル（768px以下）
                settings: {
                    slidesToShow: 1, //1枚表示
                    slidesToScroll: 1,
                    arrows: false,   //矢印オフ
                    dots: true
                }
            },
            {
                breakpoint: 1024, //タブレット（1024px以下）
                settings: {
                    slidesToShow: 2, //2枚表示
                    slidesToScroll: 1,
                    arrows: true,
                    dots: true
                }
            }
        ]
    });

    //Slick初期化後にクローンを除外（data-lightbox属性を削除）
    //slickは内部でスライドを複製するため、そのままだと
    //Lightboxが同じ画像を2回開いてしまう
    $('.slider .slick-cloned a[data-lightbox]').removeAttr('data-lightbox');

    //Lightboxオプション設定（クローン除外後に行う）
    lightbox.option({
        'resizeDuration': 400, //表示切り替えのアニメーション時間
        'wrapAround': true     //最後の画像から最初へループ
    });
});
