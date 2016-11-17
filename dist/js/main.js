$(window).on('scroll.elasticity', function (e){
    e.preventDefault();
}).on('touchmove.elasticity', function(e){
    e.preventDefault();
});

$(document).ready(() => {
    
    const pub = {
        canvas: document.getElementById('canvas'),
        ctx: document.getElementById('canvas').getContext('2d'),
        imgWidth: 40,
        imgHeight: 40,
        halfWidth: 20,
        //第一行图片的数量
        xNum: 7,
        //第一列图片的数量
        yNum: 7,
        allImgs: document.querySelector('.allimg').children,
        gameOver () {
            alert('gameover');
        }
    }

    let pubdata = {
        moveFlag : false,
        //移动位置不合理时 
        imgPlaceStay () {
            imgPlace = {
                x: startInt.x,
                y: startInt.y
            };
        }
    };

    //记录触发touchstart事件的位置
    let start = {};
    //将 触发touchstart事件的位置 设置为imgWidth的整数倍
    let startInt = {};
    //点击的图片 下一刻要去的地方
    let imgPlace = {};
    //存放页面上所有的图片信息
    let matrix = [];

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
        drawNewStage () {
            for (let i = 0; i <= pub.xNum; i++) {
                matrix[i] = new Array();
                for (let j = 0; j <= pub.yNum; j++) {
                    let len = pub.allImgs.length;
                    let index = Math.round(Math.random()*(len-1) + 0);
                    let animal = new Animal(pub.ctx, i*pub.imgWidth, j*pub.imgHeight, pub.allImgs[index]);

                    matrix[i][j] = animal;
                    animal.paint();
                }
            }

            //动画部分
            // for (let i = 0; i <= 0; i++) {
            //     for (let j = 0; j <= 0; j++) {
            //         matrix[i][j].setY(matrix[i][j].getY() - (240 - j*pub.imgHeight));
            //         console.log(matrix[i]);
            //         var timer = setInterval(function () {
            //             matrix[i][j].fall();
            //             if (matrix[i][j].getY() > i*pub.imgHeight) {
            //                 clearInterval(timer);
            //             }
            //         }, 10);
            //     }
            // }
        }

        //对 存入matrix 的图片进行重绘
        drawStage () {
            for (let i = 0; i <= pub.xNum; i++) {
                for (let j = 0; j < pub.yNum; j++) {
                    matrix[i][j].paint();
                }
            }
        }

        //判断是否达到 可消 的条件
        isDissloved () {
            let repeatImg = [];
            for (let i = 0; i < pub.xNum - 2; i++) {
                repeatImg[i] = new Array(); 
                for (let j = 0; j < pub.yNum - 2; j++) {

                    // function count(i) {
                    //     for (let z = 0; z <= i; z++) {
                    //         if (matrix[i][j+z].img == matrix[i][j+z+1].img) 
                    //             continue;
                    //     }
                    //     if (z == i) {
                    //         return true;
                    //     }
                    // }
                    if (matrix[i][j].img == matrix[i][j+1].img && matrix[i][j+1].img == matrix[i][j+2].img) {
                        console.log('yyy');
                        console.log(i, j);
                        
                        console.log(matrix[i][j]);
                        for (let z = 0; z <= 2; z++) {
                            matrix[i][j+z].refresh();    
                        }
                            repeatImg[i][j] = matrix[i][j];
                        
                    }
                    if (matrix[i][j].img == matrix[i+1][j].img && matrix[i+1][j].img == matrix[i+2][j].img) {
                        console.log('xxx');
                        console.log(i, j);
                        
                        console.log(matrix[i][j]);
                        repeatImg[i][j] = matrix[i][j];

                        for (let z = 0; z <= 2; z++) {
                            matrix[i+z][j].refresh();    
                        }
                            repeatImg[i][j] = matrix[i][j];
                    }
                }
            }   
            console.log(repeatImg);
            return repeatImg;
        }
    }

    class Animal {
        constructor (ctx, x, y, img) {
            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.img = img;
        }

        paint () {
            this.ctx.drawImage(this.img, this.x, this.y, pub.imgWidth, pub.imgHeight);
        }

        fall () {
            this.y += .5;
            stage.refresh();
            this.paint();
        }

        //满足消去条件后 图片的变化
        eliminated () {
            //不重绘即可
            //此处还应该有一些动画
        } 

        refresh () {
            this.ctx.clearRect(this.x, this.y, pub.imgWidth, pub.imgHeight);
            this.cxt.beginPath(); 
            this.cxt.fillStyle="#000";/*设置填充颜色*/ 
            this.cxt.fillRect(this.x, this.y, 40, 40);
            // this.ctx.fillstyle = '#000';
            // this.cxt.strokeRect(); 
        }
    }

    let stage = new Stage();

    stage.drawNewStage();
    stage.isDissloved();

    pub.canvas.addEventListener('touchstart', function(e) {
        var e = e || window.event;

        start = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };

        startInt = {
            x: parseInt((start.x - this.offsetLeft) / pub.imgWidth) * pub.imgWidth,
            y: parseInt((start.y - this.offsetTop) / pub.imgWidth) * pub.imgWidth
        };
    });

    pub.canvas.addEventListener('touchmove', function(e) {
        pubdata.moveFlag = true;
        var e = e || window.event;

        let mouse = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        //手指拖动图片向 水平 方向运动
        if (Math.abs(mouse.y - start.y) <= Math.abs(mouse.x - start.x)) {
            //鼠标向右移动
            if (mouse.x - start.x >= 0) {
                //如果鼠标 向右 拖动图片移动的距离 超过 图片的halfwidth
                if (mouse.x - start.x >= pub.halfWidth) {
                    imgPlace = {
                        x: startInt.x + pub.imgWidth,
                        y: startInt.y
                    };        
                } else {
                    pubdata.imgPlaceStay();
                }
                //鼠标向左移动
            } else {
                if (mouse.x - start.x <= -pub.halfWidth) {
                    imgPlace = {
                        x: startInt.x - pub.imgWidth,
                        y: startInt.y
                    };
                } else {
                    pubdata.imgPlaceStay();
                }
            } 
            //拖动图片向竖直方向运动
        } else {
            //鼠标向下移动
            if (mouse.y - start.y >= 0) {
                //如果鼠标 向下 拖动图片移动的距离 超过 图片的halfwidth
                if (mouse.y - start.y >= pub.halfWidth) {
                    imgPlace = {
                        x: startInt.x,
                        y: startInt.y + pub.imgWidth
                    }                    
                } else {
                    pubdata.imgPlaceStay();
                }
            } else {
                if (start.y - mouse.y >= pub.halfWidth) {
                    imgPlace = {
                        x: startInt.x,
                        y: startInt.y - pub.imgWidth
                    };
                } else {
                    pubdata.imgPlaceStay();
                }
            }
        }
    });

    pub.canvas.addEventListener('touchend', function (e) {
        if (pubdata.moveFlag) {
            let temp = matrix[startInt.x / 40][startInt.y / 40].img;
            matrix[startInt.x / 40][startInt.y / 40].img = matrix[imgPlace.x/40][imgPlace.y/40].img;
            matrix[imgPlace.x/40][imgPlace.y/40].img = temp;
            //将 matrix 里面的图片重绘
            stage.drawStage();

            startInt = {
                x: imgPlace.x,
                y: imgPlace.y
            }    
        } 

        pubdata.moveFlag = false;
    });
});