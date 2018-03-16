require('dotenv').config();
const mysql = require('mysql');

/*
const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PW,
	database: process.env.MYSQL_DB
});

connection.connect(err => {
	if(err) {
		console.log(err);
	}
});

module.exports = connection;
*/

const pool = mysql.createPool({

	        host: process.env.MYSQL_HOST,
	        user: process.env.MYSQL_USER,
	        password: process.env.MYSQL_PW,
	        database: process.env.MYSQL_DB,
	connectionLimit: 20
});

module.exports = pool;
