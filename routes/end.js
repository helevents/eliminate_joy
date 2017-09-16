var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');

router.post('/', function(req, res, next) {
    var parmams = req.body;
    var stuid = req.session.stuid;
    //闯关模式
    if (parmams.style == 'cg') {
        var cookiedScore = 0;
        connect.query("select pScore from funfest where stuid=?", [stuid], function (err, data) {
            if (err) {
                console.log(err);
            } else {
                if (data[0]) {
                    cookiedScore = data[0].pScore;
                }
                if (cookiedScore < parmams.score) {
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
                                        if (stuid == ele.stuid) {
                                            rank = index;
                                            score = ele.pScore;
                                        }
                                    });
                                    res.json({
                                        status: 200,
                                        data: {
                                            rank: rank+1,
                                            score: score
                                        }
                                    });
                                }
                            });
                            
                        }
                    });
                } else {
                    connect.query("select * from funfest order by pScore desc", function (e, timedata) {
                        console.log('not update and return');
                        if (e) {
                            console.log(e);
                        } else if (timedata) {
                            var rank, score;
                            timedata.forEach(function (ele, index) {
                                if (stuid == ele.stuid) {
                                    rank = index;
                                    score = ele.pScore;
                                }
                            });
                            console.log(rank, score);
                            res.json({
                                status: 200,
                                data: {
                                    rank: rank+1,
                                    score: score
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
        connect.query("select stuid,tScore from funfest where stuid=?", [stuid], function (err, data) {
            if (err) {
                console.log(err);
            } else {
                if (data[0]) {
                    cookiedScore = data[0].tScore;
                }
                console.log(cookiedScore);
                //如果数据库里用户的分数小于要更新的分数
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
                                        if (stuid == ele.stuid) {
                                            rank = index;
                                            score = ele.tScore;
                                        }
                                    });
                                    res.json({
                                        status: 200,
                                        data: {
                                            rank: rank+1,
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
                                if (stuid == ele.stuid) {
                                    rank = index;
                                    score = ele.tScore;
                                }
                            });
                            res.json({
                                status: 200,
                                data: {
                                    rank: rank+1,
                                    score: score
                                }
                            });
                        }
                    });
                }
            }
        });
    }
});

module.exports = router;
