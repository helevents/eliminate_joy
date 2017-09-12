var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');

router.get('/', function(req, res, next) {
    connect.query("select stuid,pScore from funfest order by pScore desc", function (err, data) {
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
});

module.exports = router;
