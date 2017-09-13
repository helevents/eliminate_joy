var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');

router.get('/', function(req, res, next) {
    var stuid = req.cookies.stuid;
    connect.query("select stuid,tScore from funfest order by tScore desc", function (err, jsdata) {
        if (err) {
            console.log(err);
        } else if (jsdata) {
            var jsRank = 0, myjsScore;
            jsdata.forEach(function (ele, index) {
                if (ele.stuid == stuid) {
                    jsRank = index;
                    myjsScore = ele.tScore;
                }
            });
            connect.query("select stuid,pScore from funfest order by pScore desc", function (err, cgdata) {
                if (err) {
                    console.log(err);
                } else if (cgdata) {
                    var cgRank = 0, mycgScore = 0;
                    cgdata.forEach(function (ele, index) {
                        if (ele.stuid == stuid) {
                            cgRank = index;
                            mycgScore = ele.pScore;
                        }
                    });
                    res.json({
                        status: 200,
                        data: {
                            js: {
                                rank: jsRank+1,
                                myScore: myjsScore,
                                data: jsdata
                            },
                            cg: {
                                rank: cgRank+1,
                                myScore: mycgScore,
                                data: cgdata
                            }
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
