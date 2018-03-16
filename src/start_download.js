import db from './db'; 
import downloads from './downloads';

// callback(err, status)
export default function start_download(feed_id, callback) {
  db.query("select f.id, f.linkurl, d.transmission_id from rawfeed f left outer join downloads d on f.id = d.feed_id where f.id = ?", [feed_id], (err, selectResult) => {
		if (err || selectResult.length > 1) {
      callback(err, "ERROR");
		} else if (selectResult.length < 1) {
			callback("NOT FOUND","NOT FOUND");
		} else {
			const { id, linkurl, transmission_id } = selectResult[0];
			if (transmission_id) {
				// already exists in transmission - just return status
				downloads.status(transmission_id, (mapping) => {
					if (mapping[transmission_id]) {
            callback(null,mapping[transmission_id]);
					} else {
            callback("transmission error","ERROR");
					}
				});
			} else {
				// not in transmission - add and then update DB
				downloads.add(linkurl, (newTransmissionId) => {
					if (newTransmissionId < 0) {
            callback("transmission error","ERROR");
					} else {
						db.query("insert into downloads(feed_id, transmission_id) values (?, ?)", [id, newTransmissionId], (err, insertResult) => {
							if (err) {
                callback(err,"ERROR");
							} else {
                callback(null,"ADDED");
							}
						});
					}
				});
			}
		}
	});
}