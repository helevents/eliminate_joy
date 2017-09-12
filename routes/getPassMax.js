var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');

router.get('/', function(req, res, next) {
    connect.query("select stuid,pScore from funfest order by pScore desc", function (err, data) {
        if (err) {
            console.log(err);
        } else if (data && data.length != 0) {
            console.log(data);
            var rank = 0;
            var pScore;
            data.forEach(function (ele, index) {
                if (req.cookies.usernmae == ele.stuid) {
                    rank = index;
                    pScore = ele.pScore;
                }
            });
            res.json({
                status: 200,
                data: {
                    pScore: pScore,
                    rank: rank+1
                }
            })
        }
    });
});

module.exports = router;
