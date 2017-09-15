var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'love520...',
    database : 'funfest',
    port: ''
});

connection.connect(function (err) {
    if (err) {
        console.log('err connecting: ' + err);
        return;
    }
    console.log('connected mysql ');
})

module.exports = connection;