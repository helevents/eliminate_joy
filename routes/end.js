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
                                    var rank;
                                    timedata.forEach(function (ele, index) {
                                        if (req.cookies.usernmae == ele.stuid) {
                                            rank = index;
                                        }
                                    });
                                    res.json({
                                        status: 200,
                                        data: {
                                            rank: rank
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
        connect.query("select tScore from funfest where stuid=?", [stuid], function (err, data) {
            if (err) {
                console.log(err);
            } else if (data) {
                cookiedScore = data.tScore;
                if (cookiedScore == 0) {
                    var postData = {
                        stuid: stuid,
                        pScore: 0,
                        tScore: parmams.score
                    }
                    connect.query("insert into funfest set ?", [postData], function (err, data) {
                        if (err) {
                            console.log(err);
                        } else if (data) {
                            console.log('test');
                        }
                    });
                } else {
                    connect.query("update funfest set tScore=? where stuid=?", [parmams.score, stuid], function (err, data) {
                        if (err) {
                            console.log(err);
                        } else if (data) {
                            console.log(data);
                            connect.query("select * from funfest order by tScore desc", function (e, timedata) {
                                if (e) {
                                    console.log(e);
                                } else if (timedata) {
                                    var rank;
                                    timedata.forEach(function (ele, index) {
                                        if (req.cookies.usernmae == ele.stuid) {
                                            rank = index;
                                        }
                                    });
                                    res.json({
                                        status: 200,
                                        data: {
                                            rank: rank
                                        }
                                    });
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
