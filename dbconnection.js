var mysql = require('mysql');
var connection =  mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "virtualroom"
});

//var connection =  mysql.createConnection({
//    host: "10.1.1.158",
//    user: "rkclcoin",
//    password: "naresh@123",
//    database: "virtualroom"
//});
module.exports = connection;