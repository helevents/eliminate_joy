var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');
var crypto = require('crypto');

router.get('/', function (req, res) {
    res.render('login', {});
});

router.post('/', function(req, res, next) {
    var stuid = req.body.stuid;
    var password = req.body.password;
    var secret = md5(password);
    try {
        connect.query("select * from funfest", function (e, alldata) {
            if (e) {
                console.log(e);
            } else {
                req.session.stuid = stuid;
                alldata.forEach(function (ele, index) {
                    if (ele.password == secret) {
                        res.redirect('/');
                        console.log('has already registered');
                    } 
                });

            }
        });
        
    } catch (e) {
        console.log(e);
    }
});
function md5 (data) {
    return crypto.createHash('md5').update(data).digest("hex");
}
module.exports = router;
