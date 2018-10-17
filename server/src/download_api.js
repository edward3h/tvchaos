/* eslint-disable no-console */
import express from 'express';
const router = express.Router();
import start_download from '../../src/start_download';

router.post('/:feed_id(\\d+)', (req, res) => {
  const feed_id = req.params.feed_id;
  start_download(feed_id, (err, status) => {
    if (err) {
      if (err === 'NOT FOUND') {
        res.sendStatus(404);
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    } else {
      res.json({id: feed_id, status: status});
    }
		
  });
});

router.post('/test-:feed_id', (req, res) => {
  res.json({id:req.params.feed_id, status: 'TESTING'});
});

export default router;
