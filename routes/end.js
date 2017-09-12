var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');

router.post('/', function(req, res, next) {
    var parmams = req.body;
    var stuid = parmams.stuid;

    if (parmams.nowStatus == 'pass') {
        var cookiedScore = 0;
        connect.query("select pScore from funfest where stuid=?", stuid, function (err, data) {
            if (err) {
                console.log(err);
            } else if (data) {
                cookiedScore = data;
            }
        });
        if (cookiedScore == 0) {
            var postData = {
                stuid: stuid,
                pScore: parmams.score,
                tScore: 0
            }
            connect.query("insert into funfest set ?", postData, function (err, data) {
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
                    console.log('test');
                }
            });
        }
    } else if (parmams.nowStatus == 'time') {
        var cookiedScore = 0;
        connect.query("select tScore from funfest where stuid=?", stuid, function (err, data) {
            if (err) {
                console.log(err);
            } else if (data) {
                cookiedScore = data;
            }
        });
        if (cookiedScore == 0) {
            var postData = {
                stuid: stuid,
                pScore: 0,
                tScore: parmams.score
            }
            connect.query("insert into funfest set ?", postData, function (err, data) {
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
                    res.json({
                        status: 200,
                        data: data
                    })
                }
            });
        }
    }
});

module.exports = router;
