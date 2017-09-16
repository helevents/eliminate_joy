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
                var isuser = false, userExisted = false;
                alldata.forEach(function (ele, index) {
                    if (ele.stuid == stuid) {
                        userExisted = true;
                        if (ele.password == secret) {
                            isuser = true;
                        } 
                    }
                });
                if (isuser) {
                    req.session.stuid = stuid;
                    console.log('has already registered');
                    res.json({
                        status: 200,
                        data: '登录成功'
                    })
                    // res.redirect('/');
                } else if (userExisted) {
                    res.json({
                        status: 300,
                        data: "密码不正确"
                    });
                } else {
                    res.json({
                        status: 404,
                        data: '用户不存在'
                    });
                }
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
