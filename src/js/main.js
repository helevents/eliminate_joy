$(window).on('scroll.elasticity', function (e){
    e.preventDefault();
}).on('touchmove.elasticity', function(e){
    e.preventDefault();
});

$(document).ready(() => {

    const container = document.querySelector('.canvas_container');

    console.log();
    const pub = {
        canvas: document.getElementById('canvas'),
        ctx: document.getElementById('canvas').getContext('2d'),
        //第一行图片的数量
        xNum: 6,
        //第一列图片的数量
        yNum: 8,
        imgWidth: parseInt((window.getComputedStyle(container, null).getPropertyValue('width')).slice(0, -3)) / 6,
        imgHeight: parseInt ((window.getComputedStyle(container, null).getPropertyValue('width')).slice(0, -3)) / 6,
        halfWidth: 20,
        allImgs: document.querySelector('.allimg').children,
        clickedImg: document.querySelector('.img-clicked').children,
        gameOver () {
            alert('gameover');
        }
    }

    pub.canvas.width = screen.width;
    pub.canvas.height = screen.height;

    let pubdata = {
        moveFlag : false,
        //移动位置不合理时 
        imgPlaceStay () {
            imgPlace = {
                x: startInt.x,
                y: startInt.y
            };
        },
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
            for (let i = 0; i <= pub.xNum-1; i++) {
                matrix[i] = new Array();
                for (let j = 0; j <= pub.yNum-1; j++) {
                    let len = pub.allImgs.length;
                    let index = Math.round(Math.random()*(len-1) + 0);
                    let animal = new Animal(pub.ctx, i*pub.imgWidth, j*pub.imgHeight, pub.allImgs[index], false);

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
            for (let i = 0; i <= pub.xNum-1; i++) {
                for (let j = 0; j <= pub.yNum-1; j++) {
                    matrix[i][j].paint();
                }
            }
        }
        
        //随机重绘 某一张 图片
        drawNewImg (matrix, i, k) {
            let len = pub.allImgs.length;
            let index = Math.round(Math.random()*(len-1) + 0);
            matrix[i][k].img = pub.allImgs[index];

            return index;
        }

        //如果 y方向 有可以消除的小动物, 返回 count
        //目前count还没什么用
        findYSameImg(count, i, j) {
            if (matrix[i][j+count]) {
                for (var z = 0; z < count; z++) {
                    //如果下一张图片不为空
                    if (matrix[i][j+z+1]) {
                        if (matrix[i][j+z].img !== matrix[i][j+z+1].img) {
                            break;
                        }
                    } 
                }
                if (z === count) {
                    //为可以消去的图片把toRemove改成true
                    for (let k = 0; k <= count; k++) {
                        matrix[i][j+k].toRemove = true;
                    }
                    return z;
                }
            } 
        }

        //如果 x方向 可以消除的小动物, 返回 count
        findXSameImg(count, i, j) {
            if (i < pub.xNum - count) {
                for (var z = 0; z < count; z++) {
                    if (matrix[i+z+1][j]) {
                        if (matrix[i+z][j].img !== matrix[i+z+1][j].img) 
                            break;
                    } 
                }
                if (z === count) {
                    //为可以消去的图片把toRemove改成true
                    for (let k = 0; k <= count; k++) {
                        matrix[i+k][j].toRemove = true;
                    }
                    return z;
                }
            }
        }

        //遍历所有图片, 为toRemove值为true的图片进行操作
        isDissloved () {
            for (let i = 0; i < pub.xNum; i++) {
                for (let j = 0; j < pub.yNum; j++) {
                    for (let k = 2; k <= 4; k++) {
                        stage.findXSameImg(k, i, j);
                        stage.findYSameImg(k, i, j);
                    }
                }
            }   

            for (let i = 0; i < pub.xNum; i++) {
                for (let j = 0; j < pub.yNum; j++) {
                    if (matrix[i][j].toRemove) {
                        matrix[i][j].refresh();
                        
                        //如果不是第一行的元素
                        if (j !== 0) {
                            for (let k = j-1; k >= 0; k--) {
                                matrix[i][k+1].img = matrix[i][k].img;
                            }
                            stage.drawNewImg(matrix, i, 0);
                        } else {
                            stage.drawNewImg(matrix, i, 0);
                        }
                        matrix[i][j].toRemove = false;
                    }
                }
            }

            setTimeout(function () {
                stage.drawStage();
            }, 500);

            //如果重新生成的图片中有可以消去的图片, 改变它们的toRemove值
            for (let i = 0; i < pub.xNum; i++) {
                for (let j = 0; j < pub.yNum; j++) {
                    for (let k = 2; k <= 4; k++) {
                        stage.findXSameImg(k, i, j);
                        stage.findYSameImg(k, i, j);
                    }
                }
            }   

            for (let i = 0; i < pub.xNum; i++) {
                for (let j = 0; j < pub.yNum; j++) {
                    if (matrix[i][j].toRemove) {
                        return true;
                    }
                }
            }
        }

        //交换两个位置的图片
        changeImg (a, b) {
            let temp = a;
            a = b;
            b = temp;
        }
    }

    class Animal {
        constructor (ctx, x, y, img, toRemove) {
            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.img = img;
            this.toRemove = toRemove;
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
        }

    }

    let stage = new Stage();


    stage.drawNewStage();
    
    //如果 新生成 的图片有可以消去的, 继续调用消去函数
    let timer = setInterval(function () {
        let boolis = stage.isDissloved();

        if (!boolis) {
            clearInterval(timer);
        }
    }, 1000);

    pub.canvas.addEventListener('touchstart', function(e) {
        var e = e || window.event;

        //保存点击图片时的位置
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
            //交换两个位置的图片
            let temp = matrix[startInt.x / pub.imgWidth][startInt.y / pub.imgWidth].img;
            let temp1 = matrix[imgPlace.x/pub.imgWidth][imgPlace.y/pub.imgWidth].img;
            matrix[startInt.x / pub.imgWidth][startInt.y / pub.imgWidth].img = matrix[imgPlace.x/pub.imgWidth][imgPlace.y/pub.imgWidth].img;
            matrix[imgPlace.x/pub.imgWidth][imgPlace.y/pub.imgWidth].img = temp;
            // stage.changeImg(temp, temp1);

            //将 matrix 里面的图片重绘
            stage.drawStage();

            startInt = {
                x: imgPlace.x,
                y: imgPlace.y
            }

            let timer0 = setInterval(function () {
                let boolis = stage.isDissloved();

                if (!boolis) {
                    clearInterval(timer0);
                }
            }, 1000); 
        } 

        pubdata.moveFlag = false;
    });
});