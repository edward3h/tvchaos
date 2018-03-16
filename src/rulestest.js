import db from './db';
import rules from './rules';

db.query("select min(rawfeed_id) as feed_id, title, series, episode, parseddate from parsedfeed group by 2,3,4,5", (err, feed_rows, feed_fields) => {
  if (err) {
    console.error("Error:", err);
  } else {
    applyrules(feed_rows);
  }
});

function applyrules(feed_rows) {
  feed_rows.forEach(row => {
    let matches = rules(row.title, 'download');
    if (matches && matches.length > 0) {
      console.log(row.title, matches);
    }
  });
  db.end();
}