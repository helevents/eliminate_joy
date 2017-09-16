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
                var userExisted = false;
                alldata.forEach(function (ele, index) {
                    if (ele.stuid == stuid) {
                        userExisted = true;
                    }
                });
                if (userExisted) {
                    res.json({
                        status: 300,
                        data: '用户已存在'
                    });
                } else {
                    connect.query("insert into funfest set ?", { id: null, stuid: stuid, password: secret }, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.session.stuid = stuid;
                            console.log('register success');
                            console.log(req.session.stuid);
                            res.json({
                                status: 200,
                                data: '注册成功~~~'
                            })
                        }
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
