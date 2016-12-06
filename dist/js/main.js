'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).on('scroll.elasticity', function (e) {
    e.preventDefault();
}).on('touchmove.elasticity', function (e) {
    e.preventDefault();
});

if (document.querySelector('#canvas-container') && document.querySelector('.time-score cite')) {
    (function () {
        var container = document.querySelector('#canvas-container');
        var timeScore = document.querySelector('.time-score cite');

        $(document).ready(function () {

            var conNum = {
                width: parseInt(window.getComputedStyle(container, null).getPropertyValue('width').slice(0, -2)) - 12,
                height: parseInt(window.getComputedStyle(container, null).getPropertyValue('height').slice(0, -2)) - 12
            };

            var pub = {
                canvas: document.getElementById('canvas'),
                ctx: document.getElementById('canvas').getContext('2d'),
                //第一行图片的数量
                xNum: 6,
                //第一列图片的数量
                yNum: 8,
                imgWidth: conNum.width / 6,
                imgHeight: conNum.height / 8,
                //当图片的移动位移超过 halfwidth 时, 会进行上下左右的移动
                halfWidth: 20,
                allImgs: document.querySelector('.allimg').children,
                clickedImg: document.querySelector('.img-clicked').children,
                disslovedImg: document.querySelector('.img-dissloved').children,
                clickedImgIndex: 0
            };

            pub.canvas.width = conNum.width;
            pub.canvas.height = conNum.height;

            console.log(_typeof(pub.imgWidth));

            // console.log(document.querySelector(''));

            var pubdata = {
                moveFlag: false,
                clickedFlag: false,
                score: 0,
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

            var ct = 0;

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
                                var animal = new Animal(pub.ctx, i * pub.imgWidth, j * pub.imgHeight, pub.allImgs[index], false, true);

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

                    //计时模式图案填充

                }, {
                    key: 'drawTimeStage',
                    value: function drawTimeStage() {
                        //left-top
                        var k = 0;
                        matrix[k][k].toClick = false;
                        matrix[k + 1][k].toClick = false;
                        matrix[k][k + 1].toClick = false;

                        //right-top
                        var m = pub.xNum - 1;
                        matrix[m][k].toClick = false;
                        matrix[m - 1][k].toClick = false;
                        matrix[m][k + 1].toClick = false;

                        //left-bottom
                        var n = pub.yNum - 1;
                        matrix[k][n].toClick = false;
                        matrix[k][n - 1].toClick = false;
                        matrix[k + 1][n].toClick = false;

                        //right-bottom
                        matrix[m][n].toClick = false;
                        matrix[m - 1][n].toClick = false;
                        matrix[m][n - 1].toClick = false;

                        matrix.forEach(function (element, index) {
                            element.forEach(function (ele, ind) {
                                if (!ele.toClick) {
                                    ele.refresh();
                                }
                            });
                        });
                    }

                    //对 存入matrix 的图片进行重绘

                }, {
                    key: 'drawStage',
                    value: function drawStage() {
                        for (var i = 0; i <= pub.xNum - 1; i++) {
                            for (var j = 0; j <= pub.yNum - 1; j++) {
                                if (matrix[i][j].toClick) {
                                    matrix[i][j].paint();
                                }
                            }
                        }
                    }

                    //随机重绘 matrix[i][k]区域 图片

                }, {
                    key: 'drawNewImg',
                    value: function drawNewImg(matrix, i, k) {
                        var len = pub.allImgs.length;
                        var index = Math.round(Math.random() * (len - 1) + 0);
                        matrix[i][k].img = pub.allImgs[index];

                        return index;
                    }

                    //判断 y方向 是否有 count+1 个可消去的小动物

                }, {
                    key: 'findYSameImg',
                    value: function findYSameImg(count, i, j) {
                        if (matrix[i][j + count]) {
                            if (matrix[i][j + count].toClick) {
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

                                return false;
                            }
                        }
                    }

                    //判断 x方向 是否有 count+1 个可消去的小动物

                }, {
                    key: 'findXSameImg',
                    value: function findXSameImg(count, i, j) {
                        if (i < pub.xNum - count) {
                            if (matrix[i + count][j]) {
                                if (matrix[i + count][j].toClick) {
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

                                    return false;
                                }
                            }
                        }
                    }

                    //遍历所有图片, 为toRemove值为true的图片进行操作

                }, {
                    key: 'isDissloved',
                    value: function isDissloved() {
                        matrix.forEach(function (element, index) {
                            element.forEach(function (e, i) {
                                if (e.toClick) {
                                    // console.log('i = ', index, ', j = ', i);
                                    for (var k = 4; k >= 2; k--) {
                                        stage.findXSameImg(k, index, i);
                                        stage.findYSameImg(k, index, i);
                                    }
                                }
                            });
                        });

                        //可以消去的图片 消去之前会发生的变化 (边界出现亮圆点)
                        for (var i = 0; i < pub.xNum; i++) {
                            for (var j = 0; j < pub.yNum; j++) {
                                if (matrix[i][j].toClick) {
                                    if (matrix[i][j].toRemove) {
                                        matrix[i][j].dissloved();
                                        ct++;
                                    }
                                }
                            }
                        }

                        var _loop = function _loop(_i) {
                            var _loop2 = function _loop2(_j3) {
                                if (matrix[_i][_j3].toClick) {
                                    if (matrix[_i][_j3].toRemove) {
                                        //要等亮圆点出现之后, 再清除当前图片区域
                                        setTimeout(function () {
                                            matrix[_i][_j3].refresh();
                                        }, 300);

                                        //模仿图片下落的操作
                                        if (_j3 !== 0) {
                                            //如果不是第一行的元素
                                            for (var _k = _j3 - 1; _k >= 0; _k--) {
                                                matrix[_i][_k + 1].img = matrix[_i][_k].img;
                                            }
                                            stage.drawNewImg(matrix, _i, 0);
                                        } else {
                                            stage.drawNewImg(matrix, _i, 0);
                                        }

                                        matrix[_i][_j3].toRemove = false;
                                    }
                                }
                            };

                            for (var _j3 = 0; _j3 < pub.yNum; _j3++) {
                                _loop2(_j3);
                            }
                        };

                        for (var _i = 0; _i < pub.xNum; _i++) {
                            _loop(_i);
                        }

                        setTimeout(function () {
                            stage.drawStage();
                        }, 500);

                        //如果重新生成的图片中有可以消去的图片, 改变它们的toRemove值
                        for (var _i2 = 0; _i2 < pub.xNum; _i2++) {
                            for (var _j = 0; _j < pub.yNum; _j++) {
                                if (matrix[_i2][_j].toClick) {
                                    for (var k = 2; k <= 4; k++) {
                                        stage.findXSameImg(k, _i2, _j);
                                        stage.findYSameImg(k, _i2, _j);
                                    }
                                }
                            }
                        }

                        for (var _i3 = 0; _i3 < pub.xNum; _i3++) {
                            for (var _j2 = 0; _j2 < pub.yNum; _j2++) {
                                if (matrix[_i3][_j2].toClick) {
                                    if (matrix[_i3][_j2].toRemove) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }

                    //每次点击之前, 将所有图片重置为没有 clickedImg 的图片

                }, {
                    key: 'rewriteClickedImg',
                    value: function rewriteClickedImg() {
                        var clickedImg = Array.prototype.slice.call(pub.clickedImg);
                        matrix.forEach(function (element, index) {
                            element.forEach(function (ele, ind) {
                                if (ele.toClick) {
                                    clickedImg.forEach(function (e, i) {
                                        if (element[ind].img === e) {
                                            element[ind].img = pub.allImgs[i];
                                        }
                                    });
                                }
                            });
                        });
                    }

                    //获取当前图片在 allImg 中的index

                }, {
                    key: 'currentAllImgsIndex',
                    value: function currentAllImgsIndex(ele) {
                        var allImgs = Array.prototype.slice.call(pub.allImgs);
                        var imgIndex = 0;
                        var that = ele;

                        allImgs.forEach(function (element, index) {
                            if (that.img === element) {
                                imgIndex = index;
                            }
                        });

                        return imgIndex;
                    }

                    //

                }, {
                    key: 'getScore',
                    value: function getScore() {
                        pubdata.score = ct * 10;
                        timeScore.innerHTML = pubdata.score;
                    }

                    //连续消去函数

                }, {
                    key: 'continueToDissloved',
                    value: function continueToDissloved() {
                        //如果 新生成 的图片有可以消去的, 继续调用消去函数
                        var timer = setInterval(function () {
                            var boolis = stage.isDissloved();

                            stage.getScore();

                            if (!boolis) {
                                clearInterval(timer);
                            }
                        }, 1000);
                    }

                    //

                }, {
                    key: 'gameOver',
                    value: function gameOver() {
                        matrix.forEach(function (element, index) {
                            element.forEach(function (ele, ind) {
                                ele.toClick = false;
                            });
                        });
                    }
                }]);

                return Stage;
            }();

            var Animal = function () {
                function Animal(ctx, x, y, img, toRemove, toClick) {
                    _classCallCheck(this, Animal);

                    this.ctx = ctx;
                    this.x = x;
                    this.y = y;
                    this.img = img;
                    this.toRemove = toRemove;
                    this.toClick = toClick;
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
                }, {
                    key: 'refresh',
                    value: function refresh() {
                        this.ctx.clearRect(this.x, this.y, pub.imgWidth, pub.imgHeight);
                    }

                    //消去的时候图片会发生的变化

                }, {
                    key: 'dissloved',
                    value: function dissloved() {
                        var imgIndex = stage.currentAllImgsIndex(this);

                        this.img = pub.disslovedImg[imgIndex];
                        stage.drawStage();
                    }

                    //点击的时候图片发生的变化

                }, {
                    key: 'clicked',
                    value: function clicked() {
                        var imgIndex = stage.currentAllImgsIndex(this);
                        this.img = pub.clickedImg[imgIndex];

                        stage.drawStage();
                        return imgIndex;
                    }
                }]);

                return Animal;
            }();

            var stage = new Stage();

            stage.drawNewStage();
            stage.drawTimeStage();

            //调用消去函数
            stage.continueToDissloved();

            pub.canvas.addEventListener('touchstart', function (e) {
                pubdata.clickedFlag = false;
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

                pub.clickedImgIndex = matrix[startInt.x / pub.imgWidth][startInt.y / pub.imgHeight].clicked();
                //点击图片时会发生的
                stage.rewriteClickedImg();

                pubdata.clickedFlag = false;
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
                pubdata.clickedFlag = false;

                var s = {
                    x: startInt.x / pub.imgWidth,
                    y: startInt.y / pub.imgHeight
                };
                var i = {
                    x: imgPlace.x / pub.imgWidth,
                    y: imgPlace.y / pub.imgHeight
                };

                //点击完成后 需要将 clickedImg 换回原图片
                matrix[s.x][s.y].img = pub.allImgs[pub.clickedImgIndex];

                if (pubdata.moveFlag) {
                    //如果两张图片不相同
                    if (matrix[s.x][s.y].img !== matrix[i.x][i.y].img) {
                        var temp = matrix[s.x][s.y].img;
                        matrix[s.x][s.y].img = matrix[i.x][i.y].img;
                        matrix[i.x][i.y].img = temp;
                    }

                    //将 matrix 里面的图片重绘
                    stage.drawStage();

                    startInt = {
                        x: imgPlace.x,
                        y: imgPlace.y
                    };

                    //调用消去函数
                    stage.continueToDissloved();
                }
                stage.drawStage();

                pubdata.moveFlag = false;
            });
        });
    })();
}