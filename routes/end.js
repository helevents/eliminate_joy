var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');

router.post('/', function(req, res, next) {
    var parmams = req.body;
    var stuid = parmams.stuid;
    console.log(parmams);
    //闯关模式
    if (parmams.style == 'cg') {
        var cookiedScore = 0;
        connect.query("select pScore from funfest where stuid=?", [stuid], function (err, data) {
            if (err) {
                console.log(err);
            } else if (data) {
                cookiedScore = data.pScore;
                if (cookiedScore == 0) {
                    var postData = {
                        stuid: stuid,
                        pScore: 0,
                        pScore: parmams.score
                    }
                    connect.query("insert into funfest set ?", [postData], function (err, data) {
                        if (err) {
                            console.log(err);
                        } else if (data) {
                            console.log('test');
                        }
                    });
                } else {
                    connect.query("update funfest set pScore=? where stuid=?", [parmams.score, stuid], function (err, data) {
                        if (err) {
                            console.log(err);
                        } else if (data) {
                            console.log(data);
                            connect.query("select * from funfest order by pScore desc", function (e, timedata) {
                                if (e) {
                                    console.log(e);
                                } else if (timedata) {
                                    var rank, score;
                                    timedata.forEach(function (ele, index) {
                                        if (req.cookies.usernmae == ele.stuid) {
                                            rank = index;
                                            score = ele.pScore;
                                        }
                                    });
                                    res.json({
                                        status: 200,
                                        data: {
                                            rank: rank,
                                            score: score
                                        }
                                    });
                                }
                            });
                            
                        }
                    });
                }
            }
        });
        
    //计时模式
    } else if (parmams.style == 'js') {
        var cookiedScore = 0;
        //查看该用户是否存在
        connect.query("select tScore from funfest where stuid=?", [stuid], function (err, data) {
            if (err) {
                console.log(err);
            } else if (data) {
                cookiedScore = data.tScore;
                console.log(cookiedScore);
                if (cookiedScore == 0) {
                    var postData = {
                        stuid: stuid,
                        pScore: 0,
                        tScore: parmams.score
                    }
                    //用户不存在直接插入数据
                    connect.query("insert into funfest set ?", [postData], function (err, data) {
                        if (err) {
                            console.log(err);
                        } else if (data) {
                            console.log('insert tscore');
                        }
                    });
                } else {
                    //如果数据库里用户的分数小于要更新的分数
                    console.log(cookiedScore, parmams.score);
                    if (cookiedScore < parmams.score) {
                        connect.query("update funfest set tScore=? where stuid=?", [parmams.score, stuid], function (err, data) {
                            console.log('update tscore');
                            if (err) {
                                console.log(err);
                            } else if (data) {
                                connect.query("select * from funfest order by tScore desc", function (e, timedata) {
                                    if (e) {
                                        console.log(e);
                                    } else if (timedata) {
                                        var rank, score;
                                        timedata.forEach(function (ele, index) {
                                            if (req.cookies.usernmae == ele.stuid) {
                                                rank = index;
                                                score = ele.tScore;
                                            }
                                        });
                                        res.json({
                                            status: 200,
                                            data: {
                                                rank: rank,
                                                score: score
                                            }
                                        });
                                    }
                                });
                                
                            }
                        });
                        //如果数据库里用户的分数大于要更新的分数，不更新，直接返回排名
                    } else {
                        connect.query("select * from funfest order by tScore desc", function (e, timedata) {
                            console.log('not update and return');
                            if (e) {
                                console.log(e);
                            } else if (timedata) {
                                var rank, score;
                                timedata.forEach(function (ele, index) {
                                    if (req.cookies.usernmae == ele.stuid) {
                                        rank = index;
                                        score = ele.tScore;
                                    }
                                });
                                res.json({
                                    status: 200,
                                    data: {
                                        rank: rank,
                                        hello: 'world',
                                        score: score
                                    }
                                });
                            }
                        });
                    }
                    
                }
            }
        });
        
    }
});

module.exports = router;
