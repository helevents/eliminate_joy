var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('passone', {});
});

module.exports = router;
