var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');
var crypto = require('crypto');

router.get('/', function(req, res, next) {
    res.render('forget', {});
});
router.post('/', function(req, res, next) {
    var stuid = req.body.stuid;
    var password = req.body.password;
    var repeat = req.body.repeat;
    if (password != repeat) {
        res.json({
            status: 304,
            data: '两次输入密码不一致'
        })
    }
    var secret = md5(password);
    try {
        connect.query("update funfest set password=? where stuid=?", [secret,stuid], function (err, data) {
            if (err) {
                console.log(err);
            } else {
                req.session.stuid = stuid;
                res.json({
                    status: 200,
                    data: '修改成功~~~'
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
