import db from './db';
import parseTitle from './parsetitles2';

db.query("select f.id, f.title from rawfeed f where not exists (select p.rawfeed_id from parsedfeed p where p.rawfeed_id = f.id)", handleRaw);

function handleRaw(err, results, fields) {
	if(err) {
		console.error("Error:", err);
	} else {
		results.forEach(handleRow);
	}
	db.end();
}

function handleRow(row) {
	const parsed = parseTitle(row.title);
	if(parsed) {
		console.log(parsed);
	} else {
		console.error("Could not parse title ", row.title);
	}
}
