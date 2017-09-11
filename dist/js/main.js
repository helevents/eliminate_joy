$(window).on('scroll.elasticity', function (e){
    e.preventDefault();
}).on('touchmove.elasticity', function(e){
    e.preventDefault();
});

if (document.querySelector('#canvas-container') && document.querySelector('.time-score cite')) {
    const container = document.querySelector('#canvas-container');
    const timeScore = document.querySelector('.time-score cite');
    const btnStop = document.querySelector('.time-to-stop');
    //如果没有可以消去的小建筑
    const noDissloved = document.querySelector('.no-dissloved');
    let currentUrl = window.location.href;

    if (document.querySelector('.higest-score p')) {
        var gameOverScore = document.querySelector('.higest-score p');
    }

    $(document).ready(() => {
        
        //根据不同的dataDpr，图片的宽度不同
        const dataDpr = Number(document.querySelector('html').getAttribute('data-dpr'));

        const conNum = {
            width: parseInt((window.getComputedStyle(container, null).getPropertyValue('width')).slice(0, -2)) - dataDpr * 13, 
            height: parseInt((window.getComputedStyle(container, null).getPropertyValue('height')).slice(0, -2)) - dataDpr * 13
        };

        const pub = {
            canvas: document.getElementById('canvas'),
            ctx: document.getElementById('canvas').getContext('2d'),
            //第一行图片的数量
            xNum: 6,
            //第一列图片的数量
            yNum: 8,
            imgWidth: (conNum.width) / 6,
            imgHeight: (conNum.height) / 8,
            //每个模式需要的时间
            timeCount: 60,
            //闯关模式各关 通关 需要达到的分数
            passOneNeddScore: 300,
            passTwoNeedScore: 300,
            passThreeNeedScore: 300,
            //当图片的移动位移超过 halfwidth 时, 会进行上下左右的移动
            halfWidth: 20,
            allImgs: document.querySelector('.allimg').children,
            clickedImg: document.querySelector('.img-clicked').children,
            disslovedImg: document.querySelector('.img-dissloved').children,
            clickedImgIndex: 0, 
            //动态设置宽度和高度
            setWH (ele) {
                ele.style.width = screen.width + 'px';
                ele.style.height = screen.height + 'px';
            }
        }

        pub.canvas.width = conNum.width;
        pub.canvas.height = conNum.height;

        let pubdata = {
            moveFlag: false,
            clickedFlag: false,
            score: 0,
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
        //记录分数
        let ct = 0;
        //记录当前时间
        let currentTime = 0;

        class Stage {
            constructor () {
                this.ctx = pub.ctx
            }

            //每次消除小动物之后 刷新页面
            refresh () {
                this.ctx.clearRect(0, 0, this.width, this.height);
            }

            //游戏开始时 填充图片
            drawBeginStage () {
                for (let i = 0; i <= pub.xNum-1; i++) {
                    matrix[i] = new Array();
                    for (let j = 0; j <= pub.yNum-1; j++) {
                        let len = pub.allImgs.length;
                        let index = Math.round(Math.random()*(len-1) + 0);
                        let animal = new Animal(pub.ctx, i*pub.imgWidth, j*pub.imgHeight, pub.allImgs[index], false, true);

                        matrix[i][j] = animal;
                        animal.paint();
                    }
                }
            }

            //计时模式图案填充
            drawTimeStage () {
                //left-top
                let k = 0; 
                matrix[k][k].toClick = false;
                matrix[k+1][k].toClick = false;
                matrix[k][k+1].toClick = false;

                //right-top
                let m = pub.xNum - 1;
                matrix[m][k].toClick = false;
                matrix[m-1][k].toClick = false;
                matrix[m][k+1].toClick = false;

                //left-bottom
                let n = pub.yNum - 1;
                matrix[k][n].toClick = false;
                matrix[k][n-1].toClick = false;
                matrix[k+1][n].toClick = false;

                //right-bottom
                matrix[m][n].toClick = false;
                matrix[m-1][n].toClick = false;
                matrix[m][n-1].toClick = false;

                matrix.forEach( function(element, index) {
                    element.forEach( function(ele, ind) {
                        if (!ele.toClick) {
                            ele.refresh();
                        }
                    });
                });
            }

            //闯关模式第一关
            drawPassTwo () {
                let m = pub.xNum - 1;
                let n = pub.yNum - 1;

                matrix[0][0].toClick = false;
                matrix[m][0].toClick = false;
                matrix[0][n].toClick = false;
                matrix[m][n].toClick = false;

                matrix.forEach( function(element, index) {
                    element.forEach( function(ele, ind) {
                        if (!ele.toClick) {
                            ele.refresh();
                        }
                    });
                });
            }

            //为所有模式添加事件
            drawAllStage () {
                stage.drawBeginStage();

                //根据不同的模式填充不同的图片
                if (currentUrl.indexOf('time') > -1 || currentUrl.indexOf('one') > -1) {
                    stage.drawTimeStage();
                } else if (currentUrl.indexOf('two') > -1) {
                    stage.drawPassTwo();
                } 
            }

            //对 存入matrix 的图片进行重绘
            drawStage () {
                for (let i = 0; i <= pub.xNum-1; i++) {
                    for (let j = 0; j <= pub.yNum-1; j++) {
                        if (matrix[i][j].toClick) {
                            matrix[i][j].paint();
                        }
                    }
                }
            }
            
            //随机重绘 matrix[i][k]区域 图片
            drawNewImg (matrix, i, k) {
                let len = pub.allImgs.length;
                let index = Math.round(Math.random()*(len-1) + 0);
                matrix[i][k].img = pub.allImgs[index];

                return index;
            }

            //判断 y方向 是否有 count+1 个可消去的小动物
            findYSameImg(count, i, j) {
                if (matrix[i][j+count]) {
                    if (matrix[i][j+count].toClick) {
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
                            return count;
                        }
                    } 
                }
            }

            //判断 x方向 是否有 count+1 个可消去的小动物
            findXSameImg(count, i, j) {
                if (i < pub.xNum - count) {
                    if (matrix[i+count][j]) {
                        if (matrix[i+count][j].toClick) {
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
                                return count;
                            }
                        }
                    }
                }
            }

            //检测当前矩阵中是否还有可以消去的小动物
            isDissloved () {
                //如果重新生成的图片中有可以消去的图片, 改变它们的toRemove值
                for (let i = 0; i < pub.xNum; i++) {
                    for (let j = 0; j < pub.yNum; j++) {
                        if (matrix[i][j].toClick) {
                            for (let k = 2; k <= 4; k++) {
                                stage.findXSameImg(k, i, j);
                                stage.findYSameImg(k, i, j);
                            }
                        }
                    }
                }   

                for (let i = 0; i < pub.xNum; i++) {
                    for (let j = 0; j < pub.yNum; j++) {
                        if (matrix[i][j].toClick) {
                            if (matrix[i][j].toRemove) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            }

            //遍历所有图片, 为toRemove值为true的图片进行操作
            Dissloved () {
                //移动一次应该增加的分数
                let countOnceScore = 0;

                matrix.forEach( function(element, index) {
                    element.forEach( function(e, i) {
                        if (e.toClick) {
                            for (let k = 4; k >= 2; k--) {
                                stage.findXSameImg(k, index, i);
                                stage.findYSameImg(k, index, i);
                            }
                        }
                    });
                });
                //查看当前一共有多少个可以消去的元素
                let a = 0;
                
                //可以消去的图片 消去之前会发生的变化 (边界出现亮圆点)
                for (let i = 0; i < pub.xNum; i++) {
                    for (let j = 0; j < pub.yNum; j++) {
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

                for (let i = 0; i < pub.xNum; i++) {
                    for (let j = 0; j < pub.yNum; j++) {
                        if (matrix[i][j].toClick) {
                            if (matrix[i][j].toRemove) {
                                //要等亮圆点出现之后, 再清除当前图片区域
                                setTimeout(function () {
                                    matrix[i][j].refresh();
                                }, 30);

                                //模仿图片下落的操作
                                if (j !== 0) {
                                    //如果不是第一行的元素
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
            rewriteClickedImg () {
                let clickedImg = Array.prototype.slice.call(pub.clickedImg);
                matrix.forEach( function(element, index) {
                    element.forEach( function(ele, ind) {
                        if (ele.toClick) {
                            clickedImg.forEach( function(e, i) {
                                if (element[ind].img === e) {
                                    element[ind].img = pub.allImgs[i];
                                }
                            });
                        }
                    });
                });
            }

            //获取当前图片在 allImg 中的index
            currentAllImgsIndex (ele) {
                let allImgs = Array.prototype.slice.call(pub.allImgs);
                let imgIndex = 0;
                let that = ele;

                allImgs.forEach(function(element, index) {
                    if (that.img === element) {
                        imgIndex = index;
                    }
                });

                return imgIndex;
            }

            //连续消去函数
            continueToDissloved () {
                //当连续消去的时候
                
                let time = 600;

                //如果 新生成 的图片有可以消去的, 继续调用消去函数
                let timer = setInterval(function () {
                    let scoreCount = 0;
                    let result = stage.Dissloved();

                    if (time >= 1200) {
                        scoreCount += result.score * 2;
                    } else {
                        scoreCount += result.score;
                    }

                    if (!result.bool) {
                        clearInterval(timer);
                    }

                    pubdata.score += scoreCount;

                    timeScore.innerHTML = pubdata.score;

                    time += 600;
                }, time);
            }

            //判断下一步是否有可以消去的元素 
            nextTouchToDisslove () {
                let touchToDisslove = false;

                //将每一项都往四个方向移动一次,
                for (let i = 0; i < pub.xNum-1; i++) {
                    for (let j = 0; j < pub.yNum; j++) {
                        if (matrix[i][j].toClick && matrix[i+1][j].toClick) {
                            stage.exchangeImg(matrix[i+1][j], matrix[i][j]);  
                            
                            //交换图片后, 查看当前是否有可消去的小动物
                            matrix.forEach( function(element, index) {
                                element.forEach( function(e, i) {
                                    if (e.toClick) {
                                        for (let k = 4; k >= 2; k--) {
                                            stage.findXSameImg(k, index, i);
                                            stage.findYSameImg(k, index, i);
                                        }
                                    }
                                });
                            });

                            //为了不影响后续的操作, 需要将图片再次交换回来
                            stage.exchangeImg(matrix[i+1][j], matrix[i][j]);    
                            
                            //findXSameImg 函数会将可以消去的图片的 toRemove 值设置为 true
                            //这里只需要检测 toRemove 的值即可
                            for (let i = 0; i < pub.xNum; i++) {
                                for (let j = 0; j < pub.yNum; j++) {
                                    if (matrix[i][j].toClick) {
                                        if (matrix[i][j].toRemove) {
                                            touchToDisslove =  true;
                                            matrix[i][j].toRemove = false;
                                        }
                                    }
                                }
                            }
                        }
                    };
                };

                for (let i = 1; i < pub.xNum; i++) {
                    for (let j = 0; j < pub.yNum; j++) {
                        if (matrix[i][j].toClick && matrix[i-1][j].toClick) {
                            stage.exchangeImg(matrix[i-1][j], matrix[i][j]);  
                            
                            //交换图片后, 查看当前是否有可消去的小动物
                            matrix.forEach( function(element, index) {
                                element.forEach( function(e, i) {
                                    if (e.toClick) {
                                        for (let k = 4; k >= 2; k--) {
                                            stage.findXSameImg(k, index, i);
                                            stage.findYSameImg(k, index, i);
                                        }
                                    }
                                });
                            });

                            //为了不影响后续的操作, 需要将图片再次交换回来
                            stage.exchangeImg(matrix[i-1][j], matrix[i][j]);    
                            
                            //findXSameImg 函数会将可以消去的图片的 toRemove 值设置为 true
                            //这里只需要检测 toRemove 的值即可
                            for (let i = 0; i < pub.xNum; i++) {
                                for (let j = 0; j < pub.yNum; j++) {
                                    if (matrix[i][j].toClick) {
                                        if (matrix[i][j].toRemove) {
                                            touchToDisslove =  true;
                                            matrix[i][j].toRemove = false;
                                        }
                                    }
                                }
                            }
                        }
                    };
                };

                for (let i = 0; i < pub.xNum; i++) {
                    for (let j = 0; j < pub.yNum-1; j++) {
                        if (matrix[i][j].toClick && matrix[i][j+1].toClick) {
                            stage.exchangeImg(matrix[i][j+1], matrix[i][j]);  
                            
                            //交换图片后, 查看当前是否有可消去的小动物
                            matrix.forEach( function(element, index) {
                                element.forEach( function(e, i) {
                                    if (e.toClick) {
                                        for (let k = 4; k >= 2; k--) {
                                            stage.findXSameImg(k, index, i);
                                            stage.findYSameImg(k, index, i);
                                        }
                                    }
                                });
                            });

                            //为了不影响后续的操作, 需要将图片再次交换回来
                            stage.exchangeImg(matrix[i][j+1], matrix[i][j]);    
                            
                            //findXSameImg 函数会将可以消去的图片的 toRemove 值设置为 true
                            //这里只需要检测 toRemove 的值即可
                            for (let i = 0; i < pub.xNum; i++) {
                                for (let j = 0; j < pub.yNum; j++) {
                                    if (matrix[i][j].toClick) {
                                        if (matrix[i][j].toRemove) {
                                            touchToDisslove =  true;
                                            matrix[i][j].toRemove = false;
                                        }
                                    }
                                }
                            }
                        }
                    };
                };

                for (let i = 0; i < pub.xNum; i++) {
                    for (let j = 1; j < pub.yNum; j++) {
                        if (matrix[i][j].toClick && matrix[i][j-1].toClick) {
                            stage.exchangeImg(matrix[i][j-1], matrix[i][j]);  
                            
                            //交换图片后, 查看当前是否有可消去的小动物
                            matrix.forEach( function(element, index) {
                                element.forEach( function(e, i) {
                                    if (e.toClick) {
                                        for (let k = 4; k >= 2; k--) {
                                            stage.findXSameImg(k, index, i);
                                            stage.findYSameImg(k, index, i);
                                        }
                                    }
                                });
                            });

                            //为了不影响后续的操作, 需要将图片再次交换回来
                            stage.exchangeImg(matrix[i][j-1], matrix[i][j]);    
                            
                            //findXSameImg 函数会将可以消去的图片的 toRemove 值设置为 true
                            //这里只需要检测 toRemove 的值即可
                            for (let i = 0; i < pub.xNum; i++) {
                                for (let j = 0; j < pub.yNum; j++) {
                                    if (matrix[i][j].toClick) {
                                        if (matrix[i][j].toRemove) {
                                            touchToDisslove =  true;
                                            matrix[i][j].toRemove = false;
                                        }
                                    }
                                }
                            }
                        }
                    };
                };

                return touchToDisslove;
            }

            //交换两个 obj 的 img属性值
            exchangeImg (a, b) {
                if (a && b) {
                    if (a.toClick && b.toClick) {
                        let temp = a.img;
                        a.img = b.img;
                        b.img = temp;
                    }
                }
            }

            gameBegin () {
                if (document.querySelector('.time-over')) {
                    const gameOver = document.querySelector('.time-over');
                    const gameStop = document.querySelector('.game-stop');
                    const btnStop = document.querySelector('.time-to-stop');
                    const btnContinue = document.querySelector('.btn-to-continue');
                    const processCurrent = document.querySelector('#process-current');
                    //获取 processBar 需要移动的距离, 并转化为数值
                    let processWidth = Number((getComputedStyle(processCurrent).width).slice(0, -3));
                    //每过 1s 后的增量
                    let smallWidth = processWidth / pub.timeCount;
                    let currentSmallWidth = smallWidth;
                    let timeOver = document.querySelector('.time-over');
                    let btnAgain = document.querySelector('.time-again');
                    //是否继续游戏
                    let toContinue = true;
                    const scoreToEnd = document.querySelector('.score-to-end');

                    //动态设置宽度和高度游戏结束时 页面的 宽度和高度
                    pub.setWH(gameOver);
                    pub.setWH(gameStop);
                    pub.setWH(noDissloved);

                    if (document.querySelector('.next-checkpoint')) {
                        var nextCheckpoint = document.querySelector('.next-checkpoint');
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

                        gameStop.style.display = 'block';
                        btnStop.classList.add('time-to-continue');

                        //设置距离目标还有多少分
                        if (currentUrl.indexOf('one') > -1) {
                            timeStopScore = pub.passOneNeddScore - pubdata.score;
                        } else if (currentUrl.indexOf('two') > -1) {
                            timeStopScore = pub.passTwoNeedScore - pubdata.score;
                        } else if (currentUrl.indexOf('three') > -1) {
                            timeStopScore = pub.passThreeNeedScore - pubdata.score;
                        }

                        if (timeStopScore < 0) {
                            timeStopScore = 0;
                        }
                        scoreToEnd.innerHTML = timeStopScore;

                        toContinue = false;
                    },false);

                    //游戏继续
                    btnContinue.addEventListener('click', function () {
                        document.querySelector('.time-to-continue').classList.remove('time-to-continue');
                        gameStop.style.display = 'none';

                        toContinue = true;

                        let timer1 = setInterval(function() {
                            currentTime += 1;

                            document.querySelector('#process-current').style.marginLeft = (currentSmallWidth - processWidth) + 'px';
                            currentSmallWidth += smallWidth;
                            
                            //如果点击了停止游戏按钮 
                            if (!toContinue) {
                                clearInterval(timer1);
                            } else if (Number(processCurrent.style.marginLeft.slice(0, -3)) > -smallWidth+1) {
                                clearInterval(timer1);

                                //如果为闯关模式
                                 if (window.location.href.indexOf('pass') > -1) {
                                     if (nextCheckpoint) {
                                         nextCheckpoint.style.display = 'block';
                                         //第一关
                                         if (currentUrl.indexOf('one') > -1) {
                                             localStorage.setItem('passOneScore', pubdata.score);
                                             //如果闯关成功
                                             if (pubdata.score > pub.passOneNeddScore) {
                                                 setTimeout(function () {
                                                    window.location.href = currentUrl.replace('one', 'two');
                                                 }, 2000);   
                                             //闯关失败 
                                             } else {
                                                 timeOver.style.display = 'block';
                                             }
                                         //第二关
                                         } else if (currentUrl.indexOf('two') > -1) {
                                             localStorage.setItem('passTwoScore', pubdata.score);

                                             if (pubdata.score > pub.passTwoNeedScore) {
                                                 setTimeout(function () {
                                                    window.location.href = currentUrl.replace('two', 'three');
                                                }, 2000);
                                             } else {
                                                 timeOver.style.display = 'block';
                                             }
                                         }

                                         setTimeout(function () {
                                             nextCheckpoint.style.display = 'none';
                                         }, 2000);
                                     //第三关
                                     } else {
                                         localStorage.setItem('passThreeScore', pubdata.score);
                                         timeOver.style.display = 'block';
                                     }
                                 //计时模式
                                 } else {
                                     localStorage.setItem('timeScore', pubdata.score);
                                     timeOver.style.display = 'block';
                                 }
                                 gameOverScore.innerHTML = pubdata.score;
                            }
                        }, 1000);
                    }, false);

                    //重新游戏
                    btnAgain.addEventListener('click', function(e) {
                        timeOver.style.display = 'none';
                    }, false);
                
                    //设置计时滚动条的滑动 和 重新游戏
                    let timer1 = setInterval(function() {
                        //如果点击了停止游戏按钮 
                        if (!toContinue) {
                            clearInterval(timer1);
                        }

                        currentTime += 1;
                        document.querySelector('#process-current').style.marginLeft = (currentSmallWidth - processWidth) + 'px';
                        currentSmallWidth += smallWidth;

                        if (Number(processCurrent.style.marginLeft.slice(0, -3)) > -smallWidth+1) {
                            clearInterval(timer1);

                            //如果为闯关模式
                              if (window.location.href.indexOf('pass') > -1) {
                                  if (nextCheckpoint) {
                                      nextCheckpoint.style.display = 'block';
                                      //第一关
                                      if (currentUrl.indexOf('one') > -1) {
                                          localStorage.setItem('passOneScore', pubdata.score);
                                          //如果闯关成功
                                          if (pubdata.score > pub.passOneNeddScore) {
                                              setTimeout(function () {
                                                 window.location.href = currentUrl.replace('one', 'two');
                                              }, 2000);   
                                          //闯关失败 
                                          } else {
                                              timeOver.style.display = 'block';
                                          }
                                      //第二关
                                      } else if (currentUrl.indexOf('two') > -1) {
                                          localStorage.setItem('passTwoScore', pubdata.score);

                                          if (pubdata.score > pub.passTwoNeedScore) {
                                              setTimeout(function () {
                                                 window.location.href = currentUrl.replace('two', 'three');
                                             }, 2000);
                                          } else {
                                              timeOver.style.display = 'block';
                                          }
                                      }

                                      setTimeout(function () {
                                          nextCheckpoint.style.display = 'none';
                                      }, 2000);
                                  //第三关
                                  } else {
                                      localStorage.setItem('passThreeScore', pubdata.score);
                                      timeOver.style.display = 'block';
                                  }
                              //计时模式
                              } else {
                                  localStorage.setItem('timeScore', pubdata.score);
                                  timeOver.style.display = 'block';
                              }
                              gameOverScore.innerHTML = pubdata.score;
                        }
                    }, 1000);
                }
            }
        }

        class Animal {
            constructor (ctx, x, y, img, toRemove, toClick) {
                this.ctx = ctx;
                this.x = x;
                this.y = y;
                this.img = img;
                this.toRemove = toRemove;
                this.toClick = toClick;
            }

            paint () {
                this.ctx.drawImage(this.img, this.x, this.y, pub.imgWidth, pub.imgHeight);
            }

            fall () {
                this.y += .5;
                stage.refresh();
                this.paint();
            }

            refresh () {
                this.ctx.clearRect(this.x, this.y, pub.imgWidth, pub.imgHeight);
            }

            //消去的时候图片会发生的变化
            dissloved () {
                let imgIndex = stage.currentAllImgsIndex(this);

                this.img = pub.disslovedImg[imgIndex];
                stage.drawStage();
            }

            //点击的时候图片发生的变化
            clicked () {
                let imgIndex = stage.currentAllImgsIndex(this);
                this.img = pub.clickedImg[imgIndex];

                stage.drawStage();
                return imgIndex;
            }
        }

        let stage = new Stage();

        stage.gameBegin();

        // 游戏刚开始时填充图片
        stage.drawAllStage();

        //如果没有可以消去的图片, 重绘当前页面
        if (!stage.nextTouchToDisslove()) {
            noDissloved.style.display = 'block';

            setTimeout(function () {
                noDissloved.style.display = 'none';
                stage.drawAllStage();
                stage.continueToDissloved();
            }, 1000);
        }

        stage.continueToDissloved();

        pub.canvas.addEventListener('touchstart', function(e) {
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
                            y: startInt.y + pub.imgHeight
                        }                    
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

            let s = {
                x: startInt.x / pub.imgWidth, 
                y: startInt.y / pub.imgHeight
            };
            let i = {
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
                }

                if (stage.isDissloved()) {
                    //调用消去函数
                    stage.continueToDissloved();
                } else {
                    //如果交换图片后没有可以消去的小动物，再把图片换回去
                    setTimeout(function () {
                        console.log('test');
                        stage.exchangeImg(matrix[s.x][s.y], matrix[i.x][i.y]);
                        stage.drawStage();
                    }, 300);
                }
            } 
            stage.drawStage();

            //如果没有可以消去的图片, 重绘当前页面
            if (!stage.nextTouchToDisslove()) {
                noDissloved.style.display = 'block';

                setTimeout(function () {
                    noDissloved.style.display = 'none';
                    stage.drawAllStage();
                    stage.continueToDissloved();
                }, 1000);
            }

            pubdata.moveFlag = false;
        });
    });
}

//排行榜 点击进入下一页
if (document.querySelector('.rank-btn-time')) {
    let btnTime = document.querySelector('.rank-btn-time');
    let btnPass = document.querySelector('.rank-btn-pass');
    let timeLists = document.querySelector('.rank-time-list');
    let passLists = document.querySelector('.rank-pass-list');
    let toNextPage = document.querySelector('.to-nextpage');
    //判断当前显示的是 哪个模式 
    let nowLists = 'time';
    //判断 下一次被点击次数
    let clickCount = 0;

    btnTime.addEventListener('click', function () {
        timeLists.style.display = 'block';
        passLists.style.display = 'none';

        let clicked = document.querySelector('.rank-clicked');
        clicked.classList.remove('rank-clicked');
        btnTime.classList.add('rank-clicked');

        nowLists = 'time';
    }, false);

    btnPass.addEventListener('click', function () {
        timeLists.style.display = 'none';
        passLists.style.display = 'block';

        let clicked = document.querySelector('.rank-clicked');
        clicked.classList.remove('rank-clicked');
        btnPass.classList.add('rank-clicked');

        nowLists = 'pass';
    }, false);

    toNextPage.addEventListener('click', function () {
        let lists, len;

        clickCount++;

        if (nowLists == 'pass') {
            lists = passLists.children;
            len = lists.length;
        } else if (nowLists == 'time') {
            lists = timeLists.children;
            len = lists.length;
        }

        //消去 6 ＊ clickCount 个list，实现分页效果
        if (clickCount <= 5) {
            for (let j = 1; j <= clickCount; j++) {
                for (let i = 0; i < len; i++) {
                    if (i < 6 * clickCount) {
                        lists[i].style.display = 'none';
                    }
                }
            }
        }
        
    }, false);
}