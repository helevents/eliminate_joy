var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');

router.get('/', function(req, res, next) {
    connect.query("select stuid,tScore from funfest order by tScore desc", function (err, data) {
        if (err) {
            console.log(err);
        } else if (data && data.length != 0) {
            console.log(data);
            var rank = 0;
            var tScore;
            data.forEach(function (ele, index) {
                if (req.cookies.usernmae == ele.stuid) {
                    rank = index;
                    tScore = ele.tScore;
                }
            });
            res.json({
                status: 200,
                data: {
                    tScore: tScore,
                    rank: rank+1
                }
            })
        }
    });
});

module.exports = router;
