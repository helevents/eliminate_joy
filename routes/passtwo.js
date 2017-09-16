var express = require('express');
var router = express.Router();
var connect = require('../config/mysql_connect.js');

router.get('/', function(req, res, next) {
    res.render('passtwo', { score: 0 });
});

module.exports = router;
