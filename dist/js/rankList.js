// import Stage from './main.js';

// console.log(Stage);

// //排行榜页面的渲染
// // if (window.location.href.indexOf('rank') > -1) {
// //     if (screen.height < 500) {
// //         document.querySelector('.rank-time-list').style.height = '4.8rem';
// //         document.querySelector('.rank-pass-list').style.height = '4.8rem';
// //         document.querySelector('.rank-cup').style.display = 'none';
// //     }

// //     Ajax({
// //         method: "GET",
// //         url: document.querySelector('meta').getAttribute('show-url'),
// //         success: function (res) {
// //             res = res.data;
// //             //time
// //             let timeParent = document.querySelector('.rank-time-list');
// //             let timeLast = document.querySelector('.rank-time-list .clearfix');
// //             let passParent = document.querySelector('.rank-pass-list');
// //             let passLast = document.querySelector('.rank-pass-list .clearfix');
// //             let meTime = document.querySelector('.me-time');
// //             let mePass = document.querySelector('.me-pass');

// //             // //我的分数
// //             meTime.firstElementChild.innerHTML = res.js.rank;
// //             meTime.lastElementChild.innerHTML = res.js.myScore;
// //             mePass.firstElementChild.innerHTML = res.cg.rank;
// //             mePass.lastElementChild.innerHTML = res.cg.myScore;

// //             if (res.js.data) {
// //                 let jslistsCount = res.js.data.length;
// //                 for (let i = 0; i < jslistsCount; i++) {
// //                     let newLiChild = document.createElement('li');

// //                     if (i < 3) {
// //                         newLiChild.setAttribute('class', 'single-detail rank-list-top');
// //                     } else {
// //                         newLiChild.setAttribute('class', 'single-detail');
// //                     }

// //                     timeParent.insertBefore(newLiChild, timeLast);  
// //                     let rank = i+1;

// //                     newLiChild.innerHTML = '<span class="rank-num">' + rank
// //                                             + '</span><span class="rank-name">' + res.js.data[i].nickname
// //                                             + '</span><span class="rank-score">' + res.js.data[i].score + '</span>';
// //                 }
// //             }

// //             if (res.cg.data) {
// //                 //返回的数据条数
// //                 let cglistsCount = res.cg.data.length;

// //                 for (let i = 0; i < cglistsCount; i++) {
// //                     let newLiChild = document.createElement('li');

// //                     if (i < 3) {
// //                         newLiChild.setAttribute('class', 'single-detail rank-list-top');
// //                     } else {
// //                         newLiChild.setAttribute('class', 'single-detail');
// //                     }

// //                     passParent.insertBefore(newLiChild, passLast); 

// //                     let rank = i+1;

// //                     newLiChild.innerHTML = '<span class="rank-num">' + rank
// //                                             + '</span><span class="rank-name">' + res.cg.data[i].nickname
// //                                             + '</span><span class="rank-score">' + res.cg.data[i].score + '</span>';

// //                 }
// //             }
// //         }
// //     });
// // }
"use strict";