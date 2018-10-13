import express from 'express';
const router = express.Router();
import db from '../../src/db'; // TODO make this nicer?

router.get('/',  (req, res) => {
	const offset = parseInt(req.query.offset, 10) || 0;
	db.query("select id, name, pattern, action from rules order by created_at desc, id desc limit 20 offset ?", [offset], 
		(err, results, fields) => { 
		if(err) {
			console.log(err);
			res.sendStatus(500);
		} else {
			res.json(results);
		}
	});
});

export default router;
