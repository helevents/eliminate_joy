const gameOver = document.querySelector('.time_gameover');

gameOver.style.width = screen.width + 'px';
gameOver.style.height = screen.height + 'px';

console.log(gameOver.style.height);

// const processCurrent = document.querySelector('#process_current');
// //获取 processBar 需要移动的距离, 并转化为数值
// let processWidth = Number((getComputedStyle(processCurrent).width).slice(0, -3));

// //每过 1s 后的增量
// let smallWidth = processWidth / 10;
// let currentSmallWidth = smallWidth;

// let timer1 = setInterval(function () {
//     currentSmallWidth += smallWidth;

//     document.querySelector('#process_current').style.marginLeft = (currentSmallWidth - processWidth) + 'px';

//     if (Number(processCurrent.style.marginLeft.slice(0, -3)) >= 0) {
//         clearInterval(timer1);
//     }
// }, 1000);