const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let imgUrls = ['../images/1.jpg', '../images/2.jpg', '../images/3.jpg'];
let moveFlag = false;

$(window).on('scroll.elasticity', function (e){
    e.preventDefault();
}).on('touchmove.elasticity', function(e){
    e.preventDefault();
});

$(document).ready(() => {
    if (window.innerHeight > 568) {
        $('body').height = window.innerHeight;
    } 
    if (window.innerWidth > 320) {
        $('body').width = window.innerHeight;
    }
    const pub = {
        canvas: document.getElementById('canvas'),
        ctx: document.getElementById('canvas').getContext('2d'),
        imgWidth: 40,
        imgHeight: 40,
        halfWidth: 20,
        allImgs: [],
        allImgsUrl: ['../images/1.jpg', '../images/2.jpg', '../images/3.jpg', '../images/4.jpg', '../images/5.jpg', '../images/6.jpg'],
        gameOver () {
            alert('gameover');
        }
    }

    class Stage {
        constructor () {
            this.ctx = pub.ctx,
            this.width = 280,
            this.height = 280
        }

        //每次消除小动物之后 刷新页面
        refresh () {
            this.ctx.clearRect(0, 0, this.width, this.height);


        }
        //游戏开始时 填充图片
        drawStage () {
            this.ctx.strokeStyle = "#797979";
            this.ctx.strokeRect(0, 0, 280, 280);
            for (var i = 1; i <= 6; i++) {
                this.ctx.beginPath();
                this.ctx.lineWidth = "2";
                this.ctx.strokeStyle = "#797979";
                this.ctx.moveTo(0, 0 + 40 * i);
                this.ctx.lineTo(280, 0 + 40 * i);
                this.ctx.stroke();
            }

            for (var i = 1; i <= 6; i++) {
                this.ctx.beginPath();
                this.ctx.lineWidth = "2";
                this.ctx.strokeStyle = "#797979";
                this.ctx.moveTo(40 * i, 0);
                this.ctx.lineTo(40 * i, 280);
                this.ctx.stroke();
            }
        }

        run () {

        }

    }

    class Animal {
        constructor (ctx, x, y, img) {
            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.img = img;
        }

        getx () {
            return this.x;
        }

        gety () {
            return this.y;
        }

        // paint () {
        //     this.ctx.drawImage(this.img, this.x, this.y, pub.imgWidth, pub.imgHeight);
        // }

        fall () {
            this.y += .5;

            stage.refresh();
            stage.drawStage();
        }

        //满足消去条件后 图片的变化
        eliminated () {

        } 
    }


    let pubdata = {
        //记录触发touchstart事件的位置
        start: {},
        //将 触发touchstart事件的位置 设置为imgWidth的整数倍
        startInt: {},
        //点击的图片 下一刻要去的地方
        imgPlace: {},
        //移动位置不合理时 
        imgPlaceStay () {
            pubdata.imgPlace = {
                x: pubdata.startInt.x,
                y: pubdata.startInt.y
            };
        }
    };

    let stage = new Stage();

    pub.allImgsUrl.forEach( function(element, index) {
        // let img = new Image();
        // img.src = element;

        // pub.allImgs[index] = img;
        // let animal = new Animal(pub.ctx, 160, 80+index*40, img);
        // img.onload = function () {
        //     animal.paint();
        // }
        newImg(160, 80+index*40, element);
    });

    pub.allImgsUrl.forEach( function(element, index) {
        newImg(index*40, 80, element);
    });

    stage.drawStage();


    pub.canvas.addEventListener('touchstart', function(e) {
        var e = e || window.event;

        pubdata.start = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };

        pubdata.startInt = {
            x: parseInt((pubdata.start.x - this.offsetLeft) / pub.imgWidth) * pub.imgWidth,
            y: parseInt((pubdata.start.y - this.offsetTop) / pub.imgWidth) * pub.imgWidth
        };
    });

    pub.canvas.addEventListener('touchmove', function(e) {
        var e = e || window.event;

        let mouse = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        //手指拖动图片向 水平 方向运动
        if (Math.abs(mouse.y - pubdata.start.y) < 10) {
            //鼠标向右移动
            if (mouse.x - pubdata.start.x >= 0) {
                //如果鼠标 向右 拖动图片移动的距离 超过 图片的halfwidth
                if (mouse.x - pubdata.start.x >= pub.halfWidth) {
                    pubdata.imgPlace = {
                        x: pubdata.startInt.x + pub.imgWidth,
                        y: pubdata.startInt.y
                    };        
                } else {
                    pubdata.imgPlaceStay();
                }
                //鼠标向左移动
            } else {
                if (mouse.x - pubdata.start.x <= -pub.halfWidth) {
                    pubdata.imgPlace = {
                        x: pubdata.startInt.x - pub.imgWidth,
                        y: pubdata.startInt.y
                    };
                } else {
                    pubdata.imgPlaceStay();
                }
            } 
        } 
        //手指拖动图片向 竖直 方向运动
        if (Math.abs(mouse.x - pubdata.start.x) < 10) {
            //鼠标向下移动
            if (mouse.y - pubdata.start.y >= 0) {
                //如果鼠标 向下 拖动图片移动的距离 超过 图片的halfwidth
                if (mouse.y - pubdata.start.y >= pub.halfWidth) {
                    pubdata.imgPlace = {
                        x: pubdata.startInt.x,
                        y: pubdata.startInt.y + pub.imgWidth
                    }                    
                } else {
                    pubdata.imgPlaceStay();
                }
            } else {
                if (pubdata.start.y - mouse.y >= pub.halfWidth) {
                    pubdata.imgPlace = {
                        x: pubdata.startInt.x,
                        y: pubdata.startInt.y - pub.imgWidth
                    };
                } else {
                    pubdata.imgPlaceStay();
                }
            }
        }
        
        newImg(pubdata.startInt.x, pubdata.startInt.y, pub.allImgsUrl[0]);
        newImg(pubdata.imgPlace.x, pubdata.imgPlace.y, pub.allImgsUrl[1])

        stage.refresh();
        stage.drawStage();
    });

    pub.canvas.addEventListener('touchend', function (e) {
        pubdata.startInt = {
            x: pubdata.imgPlace.x,
            y: pubdata.imgPlace.y
        }
    });

    function newImg(a, b, src) {
    var img = new Image();
    img.src = src;
    img.onload = function() {
        pub.ctx.drawImage(img, a, b, 40, 40);
    };
    return {
        x: a, 
        y: b
    };

}

});



// function $(selector) {
//     if (document.querySelectorAll(selector).length === 1) {
//         return document.querySelector(selector);
//     } else {
//         return document.querySelectorAll(selector);
//     }
// }
