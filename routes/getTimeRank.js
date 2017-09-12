var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');

router.get('/', function(req, res, next) {
    var timeData = {}, passData = {};
    connect.query("select stuid,tScore from funfest order by tScore desc", function (err, data) {
        if (err) {
            console.log(err);
        } else if (data) {
            console.log(data);
            timeData = data;
        }
    });
    connect.query("select stuid,pScore from funfest order by pScore desc", function (err, data) {
        if (err) {
            console.log(err);
        } else if (data) {
            console.log(data);
            passData = data;
        }
    });
    console.log('test');
    console.log(timeData);
    res.json({
        status: 200,
        data: {
            time: timeData,
            pass: passData
        }
    })
});

module.exports = router;
