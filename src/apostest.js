const db = require('./db');

db.query("insert into test1(value) values(?);", ["Edward's js test"], (err, result, fields) => {
	if(err) {
		console.log(err);
	}
	console.log("done");
	db.end();
});

