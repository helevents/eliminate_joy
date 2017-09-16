var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var time = require('./routes/time');
var passone = require('./routes/passone');
var passtwo = require('./routes/passtwo');
var passthree = require('./routes/passthree');
var rank = require('./routes/rank');
var getRank = require('./routes/getRank');
var end = require('./routes/end');
var login = require('./routes/login');
var register = require('./routes/register');
var limit = require('./routes/limit');
var forget = require('./routes/forget');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'express session', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 60 * 10000 }
}));

app.use('/', index);
app.use('/index', index);
app.use('/users', users);
app.use('/time', time);
app.use('/passone', passone);
app.use('/passtwo', passtwo);
app.use('/passthree', passthree);
app.use('/rank', rank);
app.use('/getRank', getRank);
app.use('/end', end);
app.use('/login', login);
app.use('/register', register);
app.use('/limit', limit);
app.use('/forget', forget);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('err', {e: err})
  // next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
function md5 (data) {
    return crypto.createHash('md5').update(data).digest("hex");
}
module.exports = app;
