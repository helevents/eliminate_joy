'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).on('scroll.elasticity', function (e) {
    e.preventDefault();
}).on('touchmove.elasticity', function (e) {
    e.preventDefault();
});

$(document).ready(function () {

    var container = document.querySelector('.canvas_container');

    var pub = {
        canvas: document.getElementById('canvas'),
        ctx: document.getElementById('canvas').getContext('2d'),
        //第一行图片的数量
        xNum: 6,
        //第一列图片的数量
        yNum: 8,
        imgWidth: parseInt(window.getComputedStyle(container, null).getPropertyValue('width').slice(0, -3)) / 6,
        imgHeight: parseInt(window.getComputedStyle(container, null).getPropertyValue('height').slice(0, -3)) / 8,
        halfWidth: 20,
        allImgs: document.querySelector('.allimg').children,
        clickedImg: document.querySelector('.img-clicked').children,
        disslovedImg: document.querySelector('.img-dissloved').children,
        clickedImgIndex: 0,
        gameOver: function gameOver() {
            alert('gameover');
        }
    };

    pub.canvas.width = screen.width;
    pub.canvas.height = screen.height;

    var pubdata = {
        moveFlag: false,
        //移动位置不合理时 
        imgPlaceStay: function imgPlaceStay() {
            imgPlace = {
                x: startInt.x,
                y: startInt.y
            };
        }
    };

    //记录触发touchstart事件的位置
    var start = {};
    //将 触发touchstart事件的位置 设置为imgWidth的整数倍
    var startInt = {};
    //点击的图片 下一刻要去的地方
    var imgPlace = {};
    //存放页面上所有的图片信息
    var matrix = [];

    var Stage = function () {
        function Stage() {
            _classCallCheck(this, Stage);

            this.ctx = pub.ctx, this.width = 280, this.height = 280;
        }

        //每次消除小动物之后 刷新页面


        _createClass(Stage, [{
            key: 'refresh',
            value: function refresh() {
                this.ctx.clearRect(0, 0, this.width, this.height);
            }
            //游戏开始时 填充图片

        }, {
            key: 'drawNewStage',
            value: function drawNewStage() {
                for (var i = 0; i <= pub.xNum - 1; i++) {
                    matrix[i] = new Array();
                    for (var j = 0; j <= pub.yNum - 1; j++) {
                        var len = pub.allImgs.length;
                        var index = Math.round(Math.random() * (len - 1) + 0);
                        var animal = new Animal(pub.ctx, i * pub.imgWidth, j * pub.imgHeight, pub.allImgs[index], false);

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

        }, {
            key: 'drawStage',
            value: function drawStage() {
                for (var i = 0; i <= pub.xNum - 1; i++) {
                    for (var j = 0; j <= pub.yNum - 1; j++) {
                        matrix[i][j].paint();
                    }
                }
            }

            //随机重绘 某一张 图片

        }, {
            key: 'drawNewImg',
            value: function drawNewImg(matrix, i, k) {
                var len = pub.allImgs.length;
                var index = Math.round(Math.random() * (len - 1) + 0);
                matrix[i][k].img = pub.allImgs[index];

                return index;
            }

            //如果 y方向 有可以消除的小动物, 返回 count
            //目前count还没什么用

        }, {
            key: 'findYSameImg',
            value: function findYSameImg(count, i, j) {
                if (matrix[i][j + count]) {
                    for (var z = 0; z < count; z++) {
                        //如果下一张图片不为空
                        if (matrix[i][j + z + 1]) {
                            if (matrix[i][j + z].img !== matrix[i][j + z + 1].img) {
                                break;
                            }
                        }
                    }
                    if (z === count) {
                        //为可以消去的图片把toRemove改成true
                        for (var k = 0; k <= count; k++) {
                            matrix[i][j + k].toRemove = true;
                        }
                        return z;
                    }
                }
            }

            //如果 x方向 可以消除的小动物, 返回 count

        }, {
            key: 'findXSameImg',
            value: function findXSameImg(count, i, j) {
                if (i < pub.xNum - count) {
                    for (var z = 0; z < count; z++) {
                        if (matrix[i + z + 1][j]) {
                            if (matrix[i + z][j].img !== matrix[i + z + 1][j].img) break;
                        }
                    }
                    if (z === count) {
                        //为可以消去的图片把toRemove改成true
                        for (var k = 0; k <= count; k++) {
                            matrix[i + k][j].toRemove = true;
                        }
                        return z;
                    }
                }
            }

            //遍历所有图片, 为toRemove值为true的图片进行操作

        }, {
            key: 'isDissloved',
            value: function isDissloved() {
                matrix.forEach(function (element, index) {
                    element.forEach(function (e, i) {
                        for (var k = 2; k <= 4; k++) {
                            stage.findXSameImg(k, index, i);
                            stage.findYSameImg(k, index, i);
                        }
                    });
                });

                for (var i = 0; i < pub.xNum; i++) {
                    for (var j = 0; j < pub.yNum; j++) {
                        if (matrix[i][j].toRemove) {
                            // setTimeout(function () {
                            // }, 1000);
                            matrix[i][j].refresh();

                            // matrix[i][j].dissloved(); 
                            //如果不是第一行的元素
                            if (j !== 0) {
                                for (var k = j - 1; k >= 0; k--) {
                                    matrix[i][k + 1].img = matrix[i][k].img;
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
                for (var _i = 0; _i < pub.xNum; _i++) {
                    for (var _j = 0; _j < pub.yNum; _j++) {
                        for (var _k = 2; _k <= 4; _k++) {
                            stage.findXSameImg(_k, _i, _j);
                            stage.findYSameImg(_k, _i, _j);
                        }
                    }
                }

                for (var _i2 = 0; _i2 < pub.xNum; _i2++) {
                    for (var _j2 = 0; _j2 < pub.yNum; _j2++) {
                        if (matrix[_i2][_j2].toRemove) {
                            return true;
                        }
                    }
                }
            }

            //交换两个位置的图片

        }, {
            key: 'changeImg',
            value: function changeImg(a, b) {
                var temp = a;
                a = b;
                b = temp;
            }
        }]);

        return Stage;
    }();

    var Animal = function () {
        function Animal(ctx, x, y, img, toRemove) {
            _classCallCheck(this, Animal);

            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.img = img;
            this.toRemove = toRemove;
        }

        _createClass(Animal, [{
            key: 'paint',
            value: function paint() {
                this.ctx.drawImage(this.img, this.x, this.y, pub.imgWidth, pub.imgHeight);
            }
        }, {
            key: 'fall',
            value: function fall() {
                this.y += .5;
                stage.refresh();
                this.paint();
            }

            //满足消去条件后 图片的变化

        }, {
            key: 'eliminated',
            value: function eliminated() {
                //不重绘即可
                //此处还应该有一些动画
            }
        }, {
            key: 'refresh',
            value: function refresh() {
                this.ctx.clearRect(this.x, this.y, pub.imgWidth, pub.imgHeight);
            }

            //消去的时候图片会发生的变化

        }, {
            key: 'dissloved',
            value: function dissloved() {
                var allImgs = Array.prototype.slice.call(pub.allImgs);
                var imgIndex = 0;
                var that = this;
                console.log(element);

                allImgs.forEach(function (element, index) {
                    console.log(element);
                    console.log(that.img);
                    if (that.img === element) {
                        imgIndex = index;
                        console.log(imgIndex);
                    }
                });

                this.img = pub.disslovedImg[imgIndex];
                setTimeout(function () {
                    stage.drawStage();
                }, 500);
            }

            //点击的时候图片发生的变化

        }, {
            key: 'clicked',
            value: function clicked() {
                var allImgs = Array.prototype.slice.call(pub.allImgs);
                var imgIndex = 0;
                var that = this;

                allImgs.forEach(function (element, index) {
                    if (that.img === element) {
                        imgIndex = index;
                    }
                });

                this.img = pub.clickedImg[imgIndex];
                stage.drawStage();

                return imgIndex;
            }
        }]);

        return Animal;
    }();

    var stage = new Stage();

    stage.drawNewStage();

    // setTimeout(function () {
    // stage.isDissloved();
    // }, 2500);

    //如果 新生成 的图片有可以消去的, 继续调用消去函数
    var timer = setInterval(function () {
        var boolis = stage.isDissloved();

        if (!boolis) {
            clearInterval(timer);
        }
    }, 1000);

    pub.canvas.addEventListener('touchstart', function (e) {
        var e = e || window.event;

        //保存点击图片时的位置
        start = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        //转化为 图片宽度和高度 的整数倍
        startInt = {
            x: parseInt((start.x - this.offsetLeft) / pub.imgWidth) * pub.imgWidth,
            y: parseInt((start.y - this.offsetTop) / pub.imgHeight) * pub.imgHeight
        };

        //每次点击之前 将所有图片重置为没有clickedImg的图片
        // let clickedImg = Array.prototype.slice.call(pub.clickedImg);
        // matrix.forEach( function(element, index) {
        //     element.forEach( function(ele, ind) {
        //         clickedImg.forEach( function(e, i) {
        //                 console.log(element[ind].img);
        //             if (element[ind].img === e.img) {
        //                 element[ind].img = pub.allImgs[i];
        //             }
        //         });
        //     });
        // });

        pub.clickedImgIndex = matrix[startInt.x / pub.imgWidth][startInt.y / pub.imgHeight].clicked();
    });

    pub.canvas.addEventListener('touchmove', function (e) {
        pubdata.moveFlag = true;
        var e = e || window.event;

        var mouse = {
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
                        y: startInt.y + pub.imgHeight
                    };
                } else {
                    pubdata.imgPlaceStay();
                }
            } else {
                if (start.y - mouse.y >= pub.halfWidth) {
                    imgPlace = {
                        x: startInt.x,
                        y: startInt.y - pub.imgHeight
                    };
                } else {
                    pubdata.imgPlaceStay();
                }
            }
        }
    });

    pub.canvas.addEventListener('touchend', function (e) {
        if (pubdata.moveFlag) {
            (function () {
                //交换两个位置的图片
                var s = {
                    x: startInt.x / pub.imgWidth,
                    y: startInt.y / pub.imgHeight
                };
                var i = {
                    x: imgPlace.x / pub.imgWidth,
                    y: imgPlace.y / pub.imgHeight
                };

                //点击完成后 需要将 ckickedImg 换回原图片
                matrix[s.x][s.y].img = pub.allImgs[pub.clickedImgIndex];

                // let temp1 = matrix[i.x][i.y].img;
                if (matrix[s.x][s.y].img !== matrix[i.x][i.y].img) {
                    var temp = matrix[s.x][s.y].img;
                    matrix[s.x][s.y].img = matrix[i.x][i.y].img;
                    matrix[i.x][i.y].img = temp;
                }

                // stage.changeImg(temp, temp1);

                //将 matrix 里面的图片重绘
                stage.drawStage();

                startInt = {
                    x: imgPlace.x,
                    y: imgPlace.y
                };

                // setTimeout(function () {
                //     stage.isDissloved();
                // }, 2500);

                var timer0 = setInterval(function () {
                    var boolis = stage.isDissloved();

                    if (!boolis) {
                        clearInterval(timer0);
                    }
                }, 1000);
            })();
        }

        pubdata.moveFlag = false;
    });
});