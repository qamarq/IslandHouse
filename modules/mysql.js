const mysql = require('mysql2')
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

connection.connect((err) => {
    if (err) {
        return console.log("Błąd MySQL: " + err)
    };
    console.log('Połączono z serwerem MySQL :)');
});

exports.connection = connection;