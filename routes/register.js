var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');
var crypto = require('crypto');

router.get('/', function (req, res) {
    res.render('register', {});
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
                alldata.forEach(function (ele, index) {
                    if (ele.stuid == stuid) {
                        res.redirect('/');
                        console.log('has already registered');
                    } 
                });
                connect.query("insert into funfest set ?", { id: null, stuid: stuid, password: secret }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        req.session.stuid = stuid;
                        res.redirect('/login');
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
