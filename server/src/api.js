import express from 'express';
const router = express.Router();

router.get('/ping',  (req, res) => res.sendStatus(200));

import rawfeed from './rawfeed';
router.use('/rawfeed', rawfeed);
import download_api from './download_api';
router.use('/download', download_api);

export default router;
