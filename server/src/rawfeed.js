import express from 'express';
const router = express.Router();
import db from '../../src/db'; // TODO make this nicer?
import downloads from '../../src/downloads';

router.get('/',  (req, res) => {
	const offset = parseInt(req.query.offset, 10) || 0;
	db.query("select id, title, description, transmission_id from rawfeed left outer join downloads on rawfeed.id = downloads.feed_id where not hidden order by created_at desc, id desc limit 20 offset ?", [offset], 
		(err, results, fields) => { 
		if(err) {
			console.log(err);
			res.sendStatus(500);
		} else {
			const transmission_ids = results.map(r => r.transmission_id).filter(t => t);
			downloads.status(transmission_ids, (transmissionResult) => {
				results.forEach(r => {
					if(r.transmission_id) {
						r.status = transmissionResult[r.transmission_id];
					}
				});
				res.json(results);
			});
		}
	});
});

router.post('/hide/:feed_id', (req, res) => {
	db.query("update rawfeed set hidden = TRUE where id = ?", [req.params.feed_id], (err, results, fields) => {
		res.sendStatus(200);
	});
});

export default router;
