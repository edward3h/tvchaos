import db from './db';
import parseTitle from './parsetitles2';

db.query("select f.id, f.title from rawfeed f where not exists (select p.rawfeed_id from parsedfeed p where p.rawfeed_id = f.id)", handleRaw);

function handleRaw(err, results, fields) {
	if(err) {
		console.error("Error:", err);
	} else {
		results.forEach(handleRow);
    done = true;
    _checkDone();
	}
}

function handleRow(row) {
	const parsed = parseTitle(row.title);
	if(parsed) {
		_doInsert(row, parsed);
	} else {
		console.error(`Could not parse title "${row.title}"`);
	}
}

let inserts = 0;
let done = false;

function _doInsert(row, parsed) {
  inserts += 1;
  db.query("insert into parsedfeed(rawfeed_id, title, series, episode, parseddate, flags) values (?, ?, ?, ?, ?, ?)",
    [row.id, parsed.title, parsed.series, parsed.episode, parsed.date, parsed.flags],
    (err, result, fields) => {
      inserts -= 1;
      if(err) {
				console.error(err);
			} else {
				console.log(`Inserted ${parsed.title}`);
			}
      _checkDone();
    });
}

function _checkDone() {
  if(inserts < 1 && done) {
    db.end();
  }
}