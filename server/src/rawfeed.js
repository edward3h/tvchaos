/* eslint-disable no-console */
import express from 'express';
const router = express.Router();
import db from '../../src/db'; // TODO make this nicer?
import downloads from '../../src/downloads';

const BASE_QUERY = 'select id, title, description, transmission_id from rawfeed left outer join downloads on rawfeed.id = downloads.feed_id where not hidden';
const SEARCH_QUERY = `${BASE_QUERY} and title like ?`;

const transformSearch = (input) => `%${input}%`.replace(/\W+/gi, '%');

router.get('/',  (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 0;
  const search = req.query.search;
  const args = search ? [transformSearch(search), offset] : [offset];

  db.query(`${search ? SEARCH_QUERY : BASE_QUERY} order by created_at desc, id desc limit 20 offset ?`, args, 
    (err, results) => {
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
  db.query('update rawfeed set hidden = TRUE where id = ?', [req.params.feed_id], () => {
    res.sendStatus(200);
  });
});

export default router;
