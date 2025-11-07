$(function(){
    $("#codeImage").slick({
        dots: true,          //スライダー切り替えのドット
        Infinity: true,      //無限にスクロールするか
        autoplay: true,      //自動再生するか
        accessibility: true, //左右のボタンでスライダーを切り替えるか 
        fade: true,          //フェードアニメーションが付く
    })
})

$(document).ready(function(){
    // 要素が存在するかチェックしてから初期化
    if ($('.slider').length > 0) {
        $('.slider').slick({
            infinite: false, // 無限ループオフ（写真複製防止）
            slidesToShow: 3, // PCで3枚表示
            slidesToScroll: 1,
            autoplay: false, // 自動再生オフ
            dots: true, // ドットナビゲーション
            arrows: true, // 矢印ナビゲーション
            accessibility: false, // ADA関連のエラーを防ぐ
            responsive: [
                {
                    breakpoint: 768, // モバイル（768px以下）
                    settings: {
                        slidesToShow: 1, // 1枚表示
                        slidesToScroll: 1,
                        arrows: false, // 矢印オフ
                        dots: true
                    }
                },
                {
                    breakpoint: 1024, // タブレット（1024px以下）
                    settings: {
                        slidesToShow: 2, // 2枚表示
                        slidesToScroll: 1,
                        arrows: true,
                        dots: true
                    }
                }
            ]
        });

        // Slick初期化後にクローンを除外（data-lightbox属性を削除）
        $('.slider .slick-cloned a[data-lightbox]').removeAttr('data-lightbox');

        // Lightboxオプション設定（クローン除外後）
        lightbox.option({
            'resizeDuration': 400,
            'wrapAround': true
        });
    }
});

