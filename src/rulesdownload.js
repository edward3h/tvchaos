import db from './db';
import rules from './rules';
import start_download from './start_download';
import sendmail from './email';

db.query("select min(rawfeed_id) as feed_id, title, series, episode, parseddate from parsedfeed group by 2,3,4,5 order by 1 desc", (err, feed_rows, feed_fields) => {
  if (err) {
    console.error("Error:", err);
  } else {
    applyrules(feed_rows);
  }
});

function fulltitle(row) {
  let title = row.title;
  if (row.series) {
    title += ` S${row.series}`;
  }
  if (row.episode) {
    title += ` E${row.episode}`;
  }
  if (row.parseddate) {
    title += ` ${row.parseddate}`;
  }
  return title;
}

function applyrules(feed_rows) {
  let inflight = 0;
  let added = [];
  const maxwidth = feed_rows.map(r => r.title.length).reduce((a, v) => Math.max(a, v));
  feed_rows.forEach(row => {
    let matches = rules(row.title, 'download');
    if (matches && matches.length > 0) {
      inflight += 1;
      start_download(row.feed_id, (err, status) => {
        if (status != 'SEED') {
          console.log(row.title.padEnd(maxwidth), " ===> ", status);
        }
        if (status == 'ADDED') {
          added.push(fulltitle(row));
        }
        inflight -= 1;
        if (inflight <= 0) {
          db.end();
          if (added.length > 0) {
            let title = `TVCHAOS started ${added.length} new downloads`;
            if(added.length == 1) {
              title = `TVCHAOS started download of ${added[0]}`;
            }
            sendmail('edwardandcheryl@ethelred.org', title, `Started download of:\n${added.join("\n")}`);
          }
        }
      });
    }
  });
  if (inflight <= 0) {
    db.end();
  }
}
