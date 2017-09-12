var mysql = require('mysql');

// var config = require('config');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'redrock'
});

connection.connect(function (err) {
    if (err) {
        console.log('err connecting: ' + err);
        return;
    }
    console.log('connected mysql ');
})

module.exports = connection;