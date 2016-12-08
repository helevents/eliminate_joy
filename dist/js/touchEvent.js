// touch 事件的绑定

function attachEvet (stage, pub, pubdata) {
    stage.drawNewStage();
    stage.drawTimeStage();
    
    //调用消去函数
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
                let temp = matrix[s.x][s.y].img;
                matrix[s.x][s.y].img = matrix[i.x][i.y].img;
                matrix[i.x][i.y].img = temp;
            }

            //将 matrix 里面的图片重绘
            stage.drawStage();

            startInt = {
                x: imgPlace.x,
                y: imgPlace.y
            }

            //调用消去函数
            stage.continueToDissloved();
        } 
        stage.drawStage();

        

        pubdata.moveFlag = false;
    });
}