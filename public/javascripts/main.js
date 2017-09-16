'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(window).on('scroll.elasticity', function (e) {
    e.preventDefault();
}).on('touchmove.elasticity', function (e) {
    e.preventDefault();
});

//游戏页面
if ($$('#canvas-container') && $$('.time-score cite')) {
    var gameOverScore;

    (function () {
        var container = $$('#canvas-container'),
            timeScore = $$('.time-score cite'),
            btnStop = $$('.time-to-stop'),
            //如果没有可以消去的小建筑
            noDissloved = $$('.no-dissloved'),
            currentUrl = window.location.href,
            //游戏进行时的页面上的 记录 
            record = $$('.time-record cite'),
            historyScore = record.innerText,
            storagedScore = historyScore;

        if (historyScore) {
            localStorage.setItem('historyScore', historyScore);
        }

        if (currentUrl.indexOf('two') > -1) {
            console.log(localStorage.getItem('passOneScore'));
            timeScore.innerHTML = Number(localStorage.getItem('passOneScore'));
        } else if (currentUrl.indexOf('three') > -1) {
            timeScore.innerHTML = Number(localStorage.getItem('passOneScore'))+Number(localStorage.getItem('passTwoScore'));
        }

        if ($$('.higest-score p')) {
            gameOverScore = $$('.higest-score p');
        }

        if (screen.height < 570) {
            $$('.canvas-container').style.height = '9.8rem';
        }

        $(document).ready(function () {

            //根据不同的dataDpr，图片的宽度不同
            var dataDpr = Number($$('html').getAttribute('data-dpr')),
                containerWidth = Number(window.getComputedStyle(container, null).getPropertyValue('width').slice(0, -2)),
                containerHeight = Number(window.getComputedStyle(container, null).getPropertyValue('height').slice(0, -2));

            var conNum = {
                width: containerWidth - dataDpr * 13,
                height: containerHeight - dataDpr * 11
            };

            var pub = {
                canvas: $$('#canvas'),
                ctx: $$('#canvas').getContext('2d'),
                //第一行图片的数量
                xNum: 6,
                //第一列图片的数量
                yNum: 8,
                imgWidth: conNum.width / 6,
                imgHeight: conNum.height / 8,
                //每个模式需要的时间
                timeCount: 60,
                //闯关模式各关 通关 需要达到的分数
                passOneNeedScore: 1000,
                passTwoNeedScore: 2000,
                passThreeNeedScore: 3000,
                //达到目标分数后，如果还有剩余时间，每s加成的分数
                extraScore: 10,
                //当图片的移动位移超过 halfwidth 时, 会进行上下左右的移动
                halfWidth: 20,
                allImgs: $$('.allimg').children,
                clickedImg: $$('.img-clicked').children,
                disslovedImg: $$('.img-dissloved').children,
                clickedImgIndex: 0,
                //动态设置宽度和高度
                setWH: function setWH(ele) {
                    ele.style.width = screen.width + 'px';
                    ele.style.height = screen.height + 'px';
                }
            };

            pub.canvas.width = conNum.width;
            pub.canvas.height = conNum.height;

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
            var start = {},
                //将 触发touchstart事件的位置 设置为imgWidth的整数倍
                startInt = {},
                //点击的图片 下一刻要去的地方
                imgPlace = {},
                //存放页面上所有的图片信息
                matrix = [],
                //记录分数
                ct = 0,
                //记录当前时间
                currentTime = 0,
                //设置一个标志量，防止将同一张图片连续移动
                continueMove = void 0;

            var Stage = function () {
                function Stage() {
                    _classCallCheck(this, Stage);

                    this.ctx = pub.ctx;
                }

                //每次消除小动物之后 刷新页面

                _createClass(Stage, [{
                    key: 'refresh',
                    value: function refresh() {
                        this.ctx.clearRect(0, 0, this.width, this.height);
                    }

                    //游戏开始时 填充图片

                }, {
                    key: 'drawBeginStage',
                    value: function drawBeginStage() {
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

                    //闯关模式第一关

                }, {
                    key: 'drawPassTwo',
                    value: function drawPassTwo() {
                        var m = pub.xNum - 1;
                        var n = pub.yNum - 1;

                        matrix[0][0].toClick = false;
                        matrix[m][0].toClick = false;
                        matrix[0][n].toClick = false;
                        matrix[m][n].toClick = false;

                        matrix.forEach(function (element, index) {
                            element.forEach(function (ele, ind) {
                                if (!ele.toClick) {
                                    ele.refresh();
                                }
                            });
                        });
                    }

                    //为所有模式添加事件

                }, {
                    key: 'drawAllStage',
                    value: function drawAllStage() {
                        //根据不同的模式填充不同的图片
                        if (currentUrl.indexOf('time') > -1 || currentUrl.indexOf('one') > -1) {
                            stage.drawTimeStage();
                        } else if (currentUrl.indexOf('two') > -1) {
                            stage.drawPassTwo();
                        }
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
                                    return count;
                                }
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
                                        return count;
                                    }
                                }
                            }
                        }
                    }

                    //检测当前矩阵中是否还有可以消去的小动物

                }, {
                    key: 'isDissloved',
                    value: function isDissloved() {
                        //如果重新生成的图片中有可以消去的图片, 改变它们的toRemove值
                        for (var i = 0; i < pub.xNum; i++) {
                            for (var j = 0; j < pub.yNum; j++) {
                                if (matrix[i][j].toClick) {
                                    for (var k = 2; k <= 4; k++) {
                                        stage.findXSameImg(k, i, j);
                                        stage.findYSameImg(k, i, j);
                                    }
                                }
                            }
                        }

                        for (var _i2 = 0; _i2 < pub.xNum; _i2++) {
                            for (var _j = 0; _j < pub.yNum; _j++) {
                                if (matrix[_i2][_j].toClick) {
                                    if (matrix[_i2][_j].toRemove) {
                                        return true;
                                    }
                                }
                            }
                        }

                        return false;
                    }

                    //遍历所有图片, 为toRemove值为true的图片进行操作

                }, {
                    key: 'Dissloved',
                    value: function Dissloved() {
                        //移动一次应该增加的分数
                        var countOnceScore = 0;

                        matrix.forEach(function (element, index) {
                            element.forEach(function (e, i) {
                                if (e.toClick) {
                                    for (var k = 4; k >= 2; k--) {
                                        stage.findXSameImg(k, index, i);
                                        stage.findYSameImg(k, index, i);
                                    }
                                }
                            });
                        });
                        //查看当前一共有多少个可以消去的元素
                        var a = 0;

                        //可以消去的图片 消去之前会发生的变化 (边界出现亮圆点)
                        for (var i = 0; i < pub.xNum; i++) {
                            for (var j = 0; j < pub.yNum; j++) {
                                if (matrix[i][j].toClick) {
                                    if (matrix[i][j].toRemove) {
                                        matrix[i][j].dissloved();
                                        a++;
                                    }
                                }
                            }
                        }

                        //如果大于3, 将分数 *2
                        if (a > 3) {
                            countOnceScore += a * 2 * 10;
                        } else {
                            countOnceScore += a * 10;
                        }

                        var _loop = function _loop(_i3) {
                            var _loop2 = function _loop2(_j2) {
                                if (matrix[_i3][_j2].toClick) {
                                    if (matrix[_i3][_j2].toRemove) {
                                        //要等亮圆点出现之后, 再清除当前图片区域
                                        setTimeout(function () {
                                            matrix[_i3][_j2].refresh();
                                        }, 30);

                                        //模仿图片下落的操作
                                        if (_j2 !== 0) {
                                            //如果不是第一行的元素
                                            for (var k = _j2 - 1; k >= 0; k--) {
                                                matrix[_i3][k + 1].img = matrix[_i3][k].img;
                                            }
                                            stage.drawNewImg(matrix, _i3, 0);
                                        } else {
                                            stage.drawNewImg(matrix, _i3, 0);
                                        }

                                        matrix[_i3][_j2].toRemove = false;
                                    }
                                }
                            };

                            for (var _j2 = 0; _j2 < pub.yNum; _j2++) {
                                _loop2(_j2);
                            }
                        };

                        for (var _i3 = 0; _i3 < pub.xNum; _i3++) {
                            _loop(_i3);
                        }

                        setTimeout(function () {
                            stage.drawStage();
                        }, 200);

                        if (stage.isDissloved()) {
                            return {
                                bool: true,
                                score: countOnceScore
                            };
                        } else {
                            return {
                                bool: false,
                                score: countOnceScore
                            };
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

                    //连续消去函数

                }, {
                    key: 'continueToDissloved',
                    value: function continueToDissloved() {
                        //当连续消去的时候

                        var time = 600;

                        //如果 新生成 的图片有可以消去的, 继续调用消去函数
                        var timer = setInterval(function () {
                            if (pubdata.score < 99999) {
                                var scoreCount = 0;
                                var result = stage.Dissloved();

                                if (time >= 1200) {
                                    scoreCount += result.score * 2;
                                } else {
                                    scoreCount += result.score;
                                }

                                if (!result.bool) {
                                    clearInterval(timer);
                                }

                                pubdata.score += scoreCount;
                                console.log(historyScore, pubdata.score);
                                if (historyScore < pubdata.score) {
                                    historyScore = pubdata.score;
                                }
                                
                                record.innerHTML = historyScore;
                                timeScore.innerHTML = pubdata.score;

                                time += 600;
                            }
                        }, time);
                    }

                    //判断下一步是否有可以消去的元素 

                }, {
                    key: 'nextTouchToDisslove',
                    value: function nextTouchToDisslove() {
                        var touchToDisslove = false;

                        //将每一项都往四个方向移动一次,
                        for (var i = 0; i < pub.xNum - 1; i++) {
                            for (var j = 0; j < pub.yNum; j++) {
                                if (matrix[i][j].toClick && matrix[i + 1][j].toClick) {
                                    stage.exchangeImg(matrix[i + 1][j], matrix[i][j]);

                                    //交换图片后, 查看当前是否有可消去的小动物
                                    matrix.forEach(function (element, index) {
                                        element.forEach(function (e, i) {
                                            if (e.toClick) {
                                                for (var k = 4; k >= 2; k--) {
                                                    stage.findXSameImg(k, index, i);
                                                    stage.findYSameImg(k, index, i);
                                                }
                                            }
                                        });
                                    });

                                    //为了不影响后续的操作, 需要将图片再次交换回来
                                    stage.exchangeImg(matrix[i + 1][j], matrix[i][j]);

                                    //findXSameImg 函数会将可以消去的图片的 toRemove 值设置为 true
                                    //这里只需要检测 toRemove 的值即可
                                    for (var _i4 = 0; _i4 < pub.xNum; _i4++) {
                                        for (var _j3 = 0; _j3 < pub.yNum; _j3++) {
                                            if (matrix[_i4][_j3].toClick) {
                                                if (matrix[_i4][_j3].toRemove) {
                                                    touchToDisslove = true;
                                                    matrix[_i4][_j3].toRemove = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                        };

                        if (touchToDisslove) {
                            return touchToDisslove;
                        }

                        for (var _i5 = 1; _i5 < pub.xNum; _i5++) {
                            for (var _j4 = 0; _j4 < pub.yNum; _j4++) {
                                if (matrix[_i5][_j4].toClick && matrix[_i5 - 1][_j4].toClick) {
                                    stage.exchangeImg(matrix[_i5 - 1][_j4], matrix[_i5][_j4]);

                                    //交换图片后, 查看当前是否有可消去的小动物
                                    matrix.forEach(function (element, index) {
                                        element.forEach(function (e, i) {
                                            if (e.toClick) {
                                                for (var k = 4; k >= 2; k--) {
                                                    stage.findXSameImg(k, index, i);
                                                    stage.findYSameImg(k, index, i);
                                                }
                                            }
                                        });
                                    });

                                    //为了不影响后续的操作, 需要将图片再次交换回来
                                    stage.exchangeImg(matrix[_i5 - 1][_j4], matrix[_i5][_j4]);

                                    //findXSameImg 函数会将可以消去的图片的 toRemove 值设置为 true
                                    //这里只需要检测 toRemove 的值即可
                                    for (var _i6 = 0; _i6 < pub.xNum; _i6++) {
                                        for (var _j5 = 0; _j5 < pub.yNum; _j5++) {
                                            if (matrix[_i6][_j5].toClick) {
                                                if (matrix[_i6][_j5].toRemove) {
                                                    touchToDisslove = true;
                                                    matrix[_i6][_j5].toRemove = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                        };

                        if (touchToDisslove) {
                            return touchToDisslove;
                        }

                        for (var _i7 = 0; _i7 < pub.xNum; _i7++) {
                            for (var _j6 = 0; _j6 < pub.yNum - 1; _j6++) {
                                if (matrix[_i7][_j6].toClick && matrix[_i7][_j6 + 1].toClick) {
                                    stage.exchangeImg(matrix[_i7][_j6 + 1], matrix[_i7][_j6]);

                                    //交换图片后, 查看当前是否有可消去的小动物
                                    matrix.forEach(function (element, index) {
                                        element.forEach(function (e, i) {
                                            if (e.toClick) {
                                                for (var k = 4; k >= 2; k--) {
                                                    stage.findXSameImg(k, index, i);
                                                    stage.findYSameImg(k, index, i);
                                                }
                                            }
                                        });
                                    });

                                    //为了不影响后续的操作, 需要将图片再次交换回来
                                    stage.exchangeImg(matrix[_i7][_j6 + 1], matrix[_i7][_j6]);

                                    //findXSameImg 函数会将可以消去的图片的 toRemove 值设置为 true
                                    //这里只需要检测 toRemove 的值即可
                                    for (var _i8 = 0; _i8 < pub.xNum; _i8++) {
                                        for (var _j7 = 0; _j7 < pub.yNum; _j7++) {
                                            if (matrix[_i8][_j7].toClick) {
                                                if (matrix[_i8][_j7].toRemove) {
                                                    touchToDisslove = true;
                                                    matrix[_i8][_j7].toRemove = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                        };

                        if (touchToDisslove) {
                            return touchToDisslove;
                        }

                        for (var _i9 = 0; _i9 < pub.xNum; _i9++) {
                            for (var _j8 = 1; _j8 < pub.yNum; _j8++) {
                                if (matrix[_i9][_j8].toClick && matrix[_i9][_j8 - 1].toClick) {
                                    stage.exchangeImg(matrix[_i9][_j8 - 1], matrix[_i9][_j8]);

                                    //交换图片后, 查看当前是否有可消去的小动物
                                    matrix.forEach(function (element, index) {
                                        element.forEach(function (e, i) {
                                            if (e.toClick) {
                                                for (var k = 4; k >= 2; k--) {
                                                    stage.findXSameImg(k, index, i);
                                                    stage.findYSameImg(k, index, i);
                                                }
                                            }
                                        });
                                    });

                                    //为了不影响后续的操作, 需要将图片再次交换回来
                                    stage.exchangeImg(matrix[_i9][_j8 - 1], matrix[_i9][_j8]);

                                    //findXSameImg 函数会将可以消去的图片的 toRemove 值设置为 true
                                    //这里只需要检测 toRemove 的值即可
                                    for (var _i10 = 0; _i10 < pub.xNum; _i10++) {
                                        for (var _j9 = 0; _j9 < pub.yNum; _j9++) {
                                            if (matrix[_i10][_j9].toClick) {
                                                if (matrix[_i10][_j9].toRemove) {
                                                    touchToDisslove = true;
                                                    matrix[_i10][_j9].toRemove = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                        };

                        if (touchToDisslove) {
                            console.log(touchToDisslove);
                            return touchToDisslove;
                        } else {
                            console.log(false);
                            return false;
                        }
                    }

                    //交换两个 obj 的 img属性值

                }, {
                    key: 'exchangeImg',
                    value: function exchangeImg(a, b) {
                        if (a && b) {
                            if (a.toClick && b.toClick) {
                                var temp = a.img;
                                a.img = b.img;
                                b.img = temp;
                            }
                        }
                    }
                }, {
                    key: 'gameBegin',
                    value: function gameBegin() {
                        if ($$('.time-over')) {
                            var scoreToEnd;
                            var nextCheckpoint;

                            (function () {

                                //游戏结束时的分数设置
                                var gameToEnd = function gameToEnd(timer1) {
                                    currentTime += 1;
                                    $$('#process-current').style.marginLeft = currentSmallWidth - processWidth + 'px';
                                    currentSmallWidth += smallWidth;

                                    //如果闯关模式已经达到目标分数，将剩余的时间加成分数
                                    if (currentUrl.indexOf('pass') > -1) {
                                        if (currentUrl.indexOf('one') > -1) {
                                            if (pubdata.score >= pub.passOneNeedScore) {
                                                nextCheckpoint.style.display = 'block';

                                                clearInterval(timer1);

                                                //设置分数
                                                pubdata.score += pub.extraScore * (pub.timeCount - currentTime);
                                                //将分数存入缓存
                                                localStorage.setItem('passOneScore', pubdata.score);

                                                //设置计时条直接滚动到 时间截止位置
                                                processCurrent.style.marginLeft = 0;

                                                //设置分数的增加
                                                if (historyScore < pubdata.score) {
                                                    record.innerHTML = pubdata.score;
                                                    localStorage.setItem('historyScore', pubdata.score);
                                                }
                                                timeScore.innerHTML = pubdata.score;

                                                //恭喜通关
                                                setTimeout(function () {
                                                    nextCheckpoint.style.display = 'block';
                                                }, 1000);

                                                setTimeout(function () {
                                                    nextCheckpoint.style.display = 'none';
                                                }, 3000);

                                                //直接进入下一关
                                                setTimeout(function () {
                                                    window.location.href = currentUrl.replace('one', 'two');
                                                }, 3000);
                                            }
                                        } else if (currentUrl.indexOf('two') > -1) {
                                            if (pubdata.score >= pub.passTwoNeedScore) {
                                                nextCheckpoint.style.display = 'block';

                                                clearInterval(timer1);

                                                pubdata.score += pub.extraScore * (pub.timeCount - currentTime);
                                                localStorage.setItem('passTwoScore', pubdata.score);

                                                processCurrent.style.marginLeft = 0;

                                                //设置分数的增加
                                                if (historyScore < pubdata.score) {
                                                    record.innerHTML = pubdata.score;
                                                    localStorage.setItem('historyScore', pubdata.score);
                                                }
                                                timeScore.innerHTML = pubdata.score;

                                                setTimeout(function () {
                                                    nextCheckpoint.style.display = 'block';
                                                }, 1000);

                                                setTimeout(function () {
                                                    nextCheckpoint.style.display = 'none';
                                                }, 3000);

                                                setTimeout(function () {
                                                    window.location.href = currentUrl.replace('two', 'three');
                                                }, 3000);
                                            }
                                        } else if (currentUrl.indexOf('three') > -1) {
                                            if (pubdata.score >= pub.passThreeNeedScore) {
                                                nextCheckpoint.style.display = 'block';

                                                clearInterval(timer1);

                                                pubdata.score += pub.extraScore * (pub.timeCount - currentTime);

                                                localStorage.setItem('passThreeScore', pubdata.score);

                                                processCurrent.style.marginLeft = 0;

                                                //设置分数的增加
                                                if (historyScore < pubdata.score) {
                                                    record.innerHTML = pubdata.score;
                                                    localStorage.setItem('historyScore', pubdata.score);
                                                }
                                                timeScore.innerHTML = pubdata.score;

                                                setTimeout(function () {
                                                    nextCheckpoint.style.display = 'block';
                                                }, 1000);

                                                setTimeout(function () {
                                                    nextCheckpoint.style.display = 'none';
                                                }, 3000);

                                                setTimeout(function () {
                                                    timeOver.style.display = 'block';
                                                    Ajax({
                                                        method: "POST",
                                                        url: `/end`,
                                                        sendContent: `style=cg&score=${pubdata.score}`,
                                                        success: function success(res) {
                                                            console.log(res);
                                                            $$('.time-rank').innerHTML = res.data.rank;
                                                            $$('.time-higest-score').innerHTML = res.data.score;                                                        
                                                            $$('.higest-score').setAttribute('data-class', '新纪录');
                                                            gameOverScore.innerHTML = pubdata.score;
                                                            if (pubdata.score < storagedScore) {
                                                                $$('.higest-score').setAttribute('data-class', '');
                                                            }
                                                        }
                                                    });
                                                }, 3000);
                                            }
                                        }
                                    }

                                    //timeout
                                    if (Number(window.getComputedStyle(processCurrent, null).getPropertyValue('margin-left').slice(0, -2)) >= -smallWidth) {
                                        clearInterval(timer1);

                                        timeOver.style.display = 'block';

                                        //如果为闯关模式
                                        if (window.location.href.indexOf('pass') > -1) {
                                            //第一关
                                            if (currentUrl.indexOf('one') > -1) {
                                                localStorage.setItem('passOneScore', pubdata.score);
                                                //闯关失败 
                                                if (pubdata.score < pub.passOneNeedScore) {
                                                    timeOver.style.display = 'block';
                                                    Ajax({
                                                        method: "POST",
                                                        url: `/end`,
                                                        sendContent: `style=cg&score=${pubdata.score}`,
                                                        success: function success(res) {
                                                            $$('.time-rank').innerHTML = res.data.rank;
                                                            $$('.time-higest-score').innerHTML = res.data.score;                                                            
                                                            $$('.higest-score').setAttribute('data-class', '新纪录');
                                                            gameOverScore.innerHTML = pubdata.score;
                                                            if (pubdata.score < storagedScore) {
                                                                $$('.higest-score').setAttribute('data-class', '');
                                                            }
                                                        }
                                                    });
                                                }
                                                //第二关
                                            } else if (currentUrl.indexOf('two') > -1) {
                                                localStorage.setItem('passTwoScore', pubdata.score);
                                                if (pubdata.score < pub.passTwoNeedScore) {
                                                    timeOver.style.display = 'block';
                                                    Ajax({
                                                        method: "POST",
                                                        url: `/end`,
                                                        sendContent: `style=cg&score=${pubdata.score}`,
                                                        success: function success(res) {
                                                            $$('.time-rank').innerHTML = res.data.rank;
                                                            $$('.time-higest-score').innerHTML = res.data.score;                                                            
                                                            $$('.higest-score').setAttribute('data-class', '新纪录');
                                                            gameOverScore.innerHTML = pubdata.score;
                                                            if (pubdata.score < storagedScore) {
                                                                $$('.higest-score').setAttribute('data-class', '');
                                                            }
                                                        }
                                                    });
                                                }
                                                //第三关
                                            } else if (currentUrl.indexOf('three') > -1) {
                                                localStorage.setItem('passThreeScore', pubdata.score);
                                                if (pubdata.score < pub.passThreeNeedScore) {
                                                    timeOver.style.display = 'block';
                                                    Ajax({
                                                        method: "POST",
                                                        url: `/end`,
                                                        sendContent: `style=cg&score=${pubdata.score}`,
                                                        success: function success(res) {
                                                            $$('.time-rank').innerHTML = res.data.rank;
                                                            $$('.time-higest-score').innerHTML = res.data.score;                                                            
                                                            $$('.higest-score').setAttribute('data-class', '新纪录');
                                                            gameOverScore.innerHTML = pubdata.score;
                                                            if (pubdata.score < storagedScore) {
                                                                $$('.higest-score').setAttribute('data-class', '');
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        //计时模式
                                        } else {
                                            localStorage.setItem('timeScore', pubdata.score);
                                            timeOver.style.display = 'block';
                                            Ajax({
                                                method: "POST",
                                                url: `/end`,
                                                sendContent: `style=js&score=${pubdata.score}`,
                                                success: function success(res) {
                                                    console.log(res);
                                                    $$('.time-rank').innerHTML = res.data.rank;
                                                    $$('.time-higest-score').innerHTML = res.data.score;
                                                    $$('.higest-score').setAttribute('data-class', '新纪录');
                                                    gameOverScore.innerHTML = pubdata.score;
                                                    if (pubdata.score < storagedScore) {
                                                        $$('.higest-score').setAttribute('data-class', '');
                                                    }
                                                }
                                            });
                                        }
                                    }
                                };

                                var gameOver = $$('.time-over'),
                                    gameStop = $$('.game-stop'),
                                    btnStop = $$('.time-to-stop'),
                                    btnContinue = $$('.btn-to-continue'),
                                    processCurrent = $$('#process-current'),
                                    rankDetail = $$('.rank-detail'),
                                    //获取 processBar 需要移动的距离, 并转化为数值
                                    processWidth = Number(getComputedStyle(processCurrent).width.slice(0, -3)),
                                    //每过 1s 后的增量
                                    smallWidth = processWidth / pub.timeCount,
                                    currentSmallWidth = smallWidth * 2,
                                    timeOver = $$('.time-over'),
                                    btnAgain = $$('.time-again'),
                                    //是否继续游戏
                                    toContinue = true;

                                if ($$('.score-to-end')) {
                                    scoreToEnd = $$('.score-to-end');
                                }

                                //动态设置宽度和高度游戏结束时 页面的 宽度和高度
                                pub.setWH(gameOver);
                                pub.setWH(gameStop);
                                pub.setWH(noDissloved);

                                if ($$('.next-checkpoint')) {
                                    nextCheckpoint = $$('.next-checkpoint');
                                    pub.setWH(nextCheckpoint);
                                }

                                //设置 闯关模式 开始时 的分数
                                if (currentUrl.indexOf('two') > -1) {
                                    pubdata.score = Number(localStorage.getItem('passOneScore'));
                                } else if (currentUrl.indexOf('three') > -1) {
                                    pubdata.score = Number(localStorage.getItem('passTwoScore'));
                                }
                                
                                gameOverScore.innerHTML = pubdata.score;

                                //游戏暂停
                                btnStop.addEventListener('click', function () {
                                    var timeStopScore = 0;

                                    toContinue = false;

                                    gameStop.style.display = 'block';
                                    btnStop.classList.add('time-to-continue');

                                    //设置距离目标还有多少分
                                    if (currentUrl.indexOf('one') > -1) {
                                        timeStopScore = pub.passOneNeedScore - pubdata.score;
                                    } else if (currentUrl.indexOf('two') > -1) {
                                        timeStopScore = pub.passTwoNeedScore - pubdata.score;
                                    } else if (currentUrl.indexOf('three') > -1) {
                                        timeStopScore = pub.passThreeNeedScore - pubdata.score;
                                    }

                                    if (timeStopScore < 0) {
                                        timeStopScore = 0;
                                    }

                                    if (scoreToEnd) {
                                        scoreToEnd.innerHTML = timeStopScore;
                                    }
                                }, false);

                                //游戏继续
                                btnContinue.addEventListener('click', function () {
                                    $$('.time-to-continue').classList.remove('time-to-continue');
                                    gameStop.style.display = 'none';

                                    var timer0 = setInterval(function () {
                                        //如果点击了停止游戏按钮 
                                        if (!toContinue) {
                                            clearInterval(timer0);
                                        } else {
                                            gameToEnd(timer0);
                                        }
                                    }, 1000);

                                    toContinue = true;
                                }, false);

                                //重新游戏
                                btnAgain.addEventListener('click', function (e) {
                                    timeOver.style.display = 'none';
                                }, false);

                                //设置计时滚动条的滑动 和 重新游戏
                                var timer1 = setInterval(function () {

                                    //如果点击了停止游戏按钮 
                                    if (!toContinue) {
                                        clearInterval(timer1);
                                    } else {
                                        gameToEnd(timer1);
                                    }
                                }, 1000);
                            })();
                        }
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

            stage.gameBegin();

            //游戏刚开始时填充图片
            stage.drawBeginStage();
            //填充不同的模式
            stage.drawAllStage();

            //如果没有可以消去的图片, 重绘当前页面
            if (!stage.nextTouchToDisslove()) {
                noDissloved.style.display = 'block';

                setTimeout(function () {
                    noDissloved.style.display = 'none';
                    stage.drawBeginStage();
                    stage.drawAllStage();
                    stage.continueToDissloved();
                }, 1000);
            }

            // if (currentUrl.indexOf('time') > -1 || currentUrl.indexOf('one') > -1) {
            //     Ajax({
            //         method: "GET",
            //         url: `/getmax`,
            //         success: function success(res) {
            //             if (currentUrl.indexOf('time') > -1) {
            //                 if (res.data.js.myScore > 0) {
            //                     historyScore = res.data.js.myScore;
            //                 }
            //             } else if (currentUrl.indexOf('pass') > -1) {
            //                 if (res.data.js.myScore > 0) {
            //                     historyScore = res.data.cg.myScore;
            //                 }
            //             }
            //         }
            //     });
            // }

            record.innerHTML = historyScore;

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

                //点击图片时 图片背景 会发生的变化 
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
                        stage.exchangeImg(matrix[s.x][s.y], matrix[i.x][i.y]);
                    }

                    //将 matrix 里面的图片重绘
                    stage.drawStage();

                    startInt = {
                        x: imgPlace.x,
                        y: imgPlace.y
                    };

                    if (stage.isDissloved()) {
                        //调用消去函数
                        stage.continueToDissloved();
                    } else {
                        //如果交换图片后没有可以消去的小动物，再把图片换回去
                        stage.exchangeImg(matrix[s.x][s.y], matrix[i.x][i.y]);

                        //防止连续拖动图片
                        for (var _i11 = 0; _i11 < pub.xNum; _i11++) {
                            for (var j = 0; j < pub.yNum; j++) {
                                matrix[_i11][j].toClick = false;
                            }
                        }
                        setTimeout(function () {
                            for (var _i12 = 0; _i12 < pub.xNum; _i12++) {
                                for (var _j10 = 0; _j10 < pub.yNum; _j10++) {
                                    matrix[_i12][_j10].toClick = true;
                                }
                            }
                            stage.drawAllStage();

                            stage.drawStage();
                        }, 300);
                    }

                    //如果没有可以消去的图片, 重绘当前页面
                    setTimeout(function () {
                        for (var _i13 = 0; _i13 < pub.xNum; _i13++) {
                            for (var _j11 = 0; _j11 < pub.yNum; _j11++) {
                                if (matrix[_i13][_j11].toClick) {
                                    if (matrix[_i13][_j11].toRemove) {
                                        matrix[_i13][_j11].toRemove = false;
                                    }
                                }
                            }
                        }

                        if (!stage.nextTouchToDisslove()) {
                            noDissloved.style.display = 'block';

                            setTimeout(function () {
                                noDissloved.style.display = 'none';
                                //重新生成所有图片
                                stage.drawBeginStage();
                                stage.drawAllStage();
                                stage.continueToDissloved();
                            }, 1000);
                        }
                    }, 2000);
                }

                pubdata.moveFlag = false;
            });
        });
    })();
}
//排行榜页面的渲染
if (window.location.href.indexOf('rank') > -1) {
    if (screen.height < 500) {
        $$('.rank-time-list').style.height = '4.8rem';
        $$('.rank-pass-list').style.height = '4.8rem';
        $$('.rank-cup').style.display = 'none';
    }

    Ajax({
        method: "GET",
        url: `/getRank`,
        success: function success(res) {
            res = res.data;
            //time
            var timeParent = $$('.rank-time-list'),
                timeLast = $$('.rank-time-list .clearfix'),
                passParent = $$('.rank-pass-list'),
                passLast = $$('.rank-pass-list .clearfix'),
                meTime = $$('.me-time'),
                mePass = $$('.me-pass');

            //我的分数
            meTime.firstElementChild.innerHTML = res.js.rank;
            meTime.lastElementChild.innerHTML = res.js.myScore;
            mePass.firstElementChild.innerHTML = res.cg.rank;
            mePass.lastElementChild.innerHTML = res.cg.myScore;

            if (res.js.data) {
                var jslistsCount = res.js.data.length;
                for (var i = 0; i < jslistsCount; i++) {
                    var newLiChild = document.createElement('li');

                    if (i < 3) {
                        newLiChild.setAttribute('class', 'single-detail rank-list-top');
                    } else {
                        newLiChild.setAttribute('class', 'single-detail');
                    }

                    timeParent.insertBefore(newLiChild, timeLast);
                    var rank = i + 1;

                    newLiChild.innerHTML = `<span class="rank-num">  ${rank}  
                                            </span><span class="rank-name">  ${res.js.data[i].stuid}  
                                            </span><span class="rank-score">  ${res.js.data[i].tScore}  </span>`;
                }
            }

            if (res.cg.data) {
                //返回的数据条数
                var cglistsCount = res.cg.data.length;

                for (var _i = 0; _i < cglistsCount; _i++) {
                    var _newLiChild = document.createElement('li');

                    if (_i < 3) {
                        _newLiChild.setAttribute('class', 'single-detail rank-list-top');
                    } else {
                        _newLiChild.setAttribute('class', 'single-detail');
                    }

                    passParent.insertBefore(_newLiChild, passLast);

                    var _rank = _i + 1;

                    _newLiChild.innerHTML = `<span class="rank-num"> ${_rank} 
                                            </span><span class="rank-name"> ${res.cg.data[_i].stuid} 
                                            </span><span class="rank-score"> ${res.cg.data[_i].pScore} </span>`;
                }
            }
        }
    });
}
//排行榜 点击进入下一页
if ($$('.rank-btn-time')) {
    (function () {
        var btnTime = $$('.rank-btn-time'),
            btnPass = $$('.rank-btn-pass'),
            timeLists = $$('.rank-time-list'),
            passLists = $$('.rank-pass-list'),
            toNextPage = $$('.to-nextpage'),
            //判断当前显示的是 哪个模式 
            nowLists = 'time',
            //判断 下一次被点击次数
            clickCount = 0,
            //下一页总共能 被点击 的次数
            toClickNext = 0,
            len = 0;

        btnTime.addEventListener('click', function () {
            timeLists.style.display = 'block';
            passLists.style.display = 'none';

            var clicked = $$('.rank-clicked');
            clicked.classList.remove('rank-clicked');
            btnTime.classList.add('rank-clicked');

            var lists = timeLists.children;
            lists = Array.prototype.slice.call(lists);

            lists.forEach(function (element, index) {
                element.style.display = 'block';
            });

            nowLists = 'time';
            clickCount = 0;
        }, false);

        btnPass.addEventListener('click', function () {
            timeLists.style.display = 'none';
            passLists.style.display = 'block';

            var clicked = $$('.rank-clicked');
            clicked.classList.remove('rank-clicked');
            btnPass.classList.add('rank-clicked');

            var lists = passLists.children;
            lists = Array.prototype.slice.call(lists);

            lists.forEach(function (element, index) {
                element.style.display = 'block';
            });

            nowLists = 'pass';
            clickCount = 0;
        }, false);

        toNextPage.addEventListener('click', function () {
            var lists = void 0;

            clickCount++;

            if (nowLists == 'pass') {
                lists = passLists.children;
                len = lists.length;
            } else if (nowLists == 'time') {
                lists = timeLists.children;
                len = lists.length;
            }

            toClickNext = parseInt((len - 1) / 5);

            if ((len - 1) % 5 > 0) {
                toClickNext += 1;
            }

            //消去 6 ＊ clickCount 个list，实现分页效果
            if (toClickNext > clickCount) {
                for (var i = 1; i < len; i++) {
                    if (i <= 5 * clickCount) {
                        lists[i].style.display = 'none';
                    }
                }
            }
        }, false);
    })();
}

function Ajax(obj) {
    var request = new XMLHttpRequest(),
        defaults = {
        method: "GET",
        url: "",
        async: true,
        success: function success() {},
        errer: function errer() {},
        sendContent: null
    };

    for (var key in obj) {
        defaults[key] = obj[key];
    }

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var responseText = JSON.parse(request.responseText);
            defaults.success.call(request, responseText);
        } else {
            defaults.errer();
        }
    };

    request.open(defaults.method, defaults.url, defaults.async);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    request.send(defaults.sendContent);
}
function $$(ele) {
    return document.querySelector(ele);
}