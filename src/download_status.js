import db from './db';
import downloads from './downloads';

db.query("select f.id as feed_id, f.title, d.transmission_id from rawfeed f join downloads d on f.id = d.feed_id order by 1 desc", (err, results, fields) => {
  if (err) {
    console.error("Error:", err);
  } else {
    const transmission_ids = results.map(r => r.transmission_id).filter(t => t);
    const maxwidth = results.map(r => r.title.length).reduce((a, v) => Math.max(a, v));
    downloads.status(transmission_ids, (transmissionResult) => {
      results.forEach(r => {
        if(r.transmission_id) {
          r.status = transmissionResult[r.transmission_id];
        }
        console.log(r.title.padEnd(maxwidth), " ===> ", r.status);
      });
    });
  }
  db.end();
});