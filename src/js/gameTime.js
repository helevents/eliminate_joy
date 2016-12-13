if (document.querySelector('.time-over')) {
    //动态设置宽度和高度游戏结束时 页面的 宽度和高度
    const gameOver = document.querySelector('.time-over');

    gameOver.style.width = screen.width + 'px';
    gameOver.style.height = screen.height + 'px';
}

