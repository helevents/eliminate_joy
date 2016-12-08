'use strict';

if (document.querySelector('.time-over')) {
    //动态设置宽度和高度
    var gameOver = document.querySelector('.time-over');

    gameOver.style.width = screen.width + 'px';
    gameOver.style.height = screen.height + 'px';
}

//设置计时滚动条的滑动 和 重新游戏
if (document.querySelector('#process-current')) {
    (function () {
        var processCurrent = document.querySelector('#process-current');
        //获取 processBar 需要移动的距离, 并转化为数值
        var processWidth = Number(getComputedStyle(processCurrent).width.slice(0, -3));
        //每过 1s 后的增量
        var smallWidth = processWidth / 50;
        var currentSmallWidth = smallWidth;
        var btnTimeOver = document.querySelector('.time-over');
        var btnAgain = document.querySelector('.time-again');

        var timer1 = setInterval(function () {
            currentSmallWidth += smallWidth;

            document.querySelector('#process-current').style.marginLeft = currentSmallWidth - processWidth + 'px';

            if (Number(processCurrent.style.marginLeft.slice(0, -3)) >= 0) {
                clearInterval(timer1);
                console.log('game is over');

                btnTimeOver.style.display = 'block';
            }
        }, 1000);
    })();
}