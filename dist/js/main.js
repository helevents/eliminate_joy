const canvas = $("#canvas");
const ctx = canvas.getContext("2d");
let imgUrls = ['../images/1.jpg', '../images/2.jpg'];
let touchFlag = false;
let moveFlag = false;
//游戏主体部分
drawStage();

let currentPlace = [];
// currentPlace[0] = newImg(160, 40, imgUrls[1]);
// currentPlace[1] = newImg(120, 80, imgUrls[1]);
currentPlace[2] = newImg(160, 80, imgUrls[0]);
currentPlace[3] = newImg(200, 80, imgUrls[1]);
// currentPlace[4] = newImg(160, 120, imgUrls[1]);

canvas.addEventListener('touchstart', function(e0) {
    moveFlag = true;
    touchmove = true;

    var e0 = e0 || window.event;

    let start = {
        x: e0.touches[0].clientX,
        y: e0.touches[0].clientY
    };

    //将点击屏幕上的图片时, 将当前图片的位置设为40的倍数
    let startInt = {
        x: parseInt((start.x - this.offsetLeft) / 40) * 40,
        y: parseInt((start.y - this.offsetTop) / 40) * 40
    };
    let imgPlace = { x: startInt.x, y: startInt.y };

    canvas.addEventListener('touchmove', function(e) {
        touchFlag = false;
        var e = e || window.event;

        if (moveFlag) {
            let mouse = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
                
            //比较当前鼠标和图片开始时的位置
            if (Math.abs(mouse.y - start.y) < 20) {
                //鼠标往 右/下 移动时
                if (mouse.x - start.x >= 20) {
                    imgPlace = {
                        x: startInt.x + 40,
                        y: startInt.y
                    };        
                    //鼠标往 左/上移动时 
                } else if (start.x - mouse.x > 20) {
                    imgPlace = {
                        x: startInt.x - 40,
                        y: startInt.y
                    };
                    //移动距离不满足要求的情况
                } else {
                    imgPlace = { x: startInt.x, y: startInt.y };
                }
            } 
            
            if (Math.abs(mouse.x - start.x) < 20) {
                if (mouse.y - start.y >= 20) {
                    imgPlace = {
                        x: startInt.x,
                        y: startInt.y + 40
                    }                    
                } else if (start.y - mouse.y > 20) {
                    imgPlace = {
                        x: startInt.x,
                        y: startInt.y - 40
                    }                    
                } else {
                    imgPlace = {x: startInt.x, y: startInt.y};
                }
            }

            newImg(imgPlace.x, imgPlace.y, imgUrls[0]);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawStage();  
            // newImg(160, 40, imgUrls[1]);
            // newImg(120, 80, imgUrls[1]);
            // newImg(200, 80, imgUrls[1]);
            // newImg(160, 120, imgUrls[1]);
        
            canvas.addEventListener('touchend', function (e) {
                moveFlag = false;
                startInt.x = imgPlace.x;
                startInt.y = imgPlace.y;
            });
        }
    });
});

function newImg(a, b, src) {
    var img = new Image();
    img.src = src;
    img.onload = function() {
        ctx.drawImage(img, a, b, 40, 40);
    };
    return img;
}

function drawStage() {
    ctx.strokeStyle = "#797979";
    ctx.strokeRect(0, 0, 280, 280);
    for (var i = 1; i <= 6; i++) {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "#797979";
        ctx.moveTo(0, 0 + 40 * i);
        ctx.lineTo(280, 0 + 40 * i);
        ctx.stroke();
    }

    for (var i = 1; i <= 6; i++) {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "#797979";
        ctx.moveTo(40 * i, 0);
        ctx.lineTo(40 * i, 280);
        ctx.stroke();
    }
}

function $(selector) {
    if (document.querySelectorAll(selector).length === 1) {
        return document.querySelector(selector);
    } else {
        return document.querySelectorAll(selector);
    }
}
