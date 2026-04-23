$(function() {
    //モーダルを開く処理
    $('.modal-trigger').on('click', function() {
        var gameId = $(this).data('game');
        var $detailContent = $('#' + gameId + '-detail');
        
        //ソースが存在するか確認
        if ($detailContent.length === 0) {
            console.error('Detail content not found for:', gameId);
            return;
        }

        var content = $detailContent.html();
        $('#modal-body').html(content);
        
        //モーダルを表示
        $('#game-modal').fadeIn(300, function() {
            //モーダル表示完了後にスライダーを初期化
            var $modalSlider = $('#modal-body .slider');
            if ($modalSlider.length) {
                //初期化前に念のため unslick（既存の破棄）は不要（中身がemptyなので）
                $modalSlider.slick({
                    dots: true,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 1,
                    adaptiveHeight: true,
                    prevArrow: '<button type="button" class="slick-prev">前へ</button>',
                    nextArrow: '<button type="button" class="slick-next">次へ</button>'
                });

                //初期化直後に位置計算を強制アップデート
                $modalSlider.slick('setPosition');
            }
        });
    });

    //モーダルを閉じる処理
    $('.close').on('click', function() {
        $('#game-modal').fadeOut(200, function() {
            //Slickのイベントをクリーンアップしてから中身を空にする
            var $modalSlider = $('#modal-body .slider');
            if ($modalSlider.hasClass('slick-initialized')) {
                $modalSlider.slick('unslick');
            }
            $('#modal-body').empty();
        });
    });
});