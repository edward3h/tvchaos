/* eslint-disable no-console */
require('dotenv').config();
import express from 'express';
import webpack from 'webpack';
import morgan from 'morgan';
import wpconfig from '../../webpack.config.dev';
import api from './api';

const port = process.env.SERVER_PORT || 5555;
const app = express();

app.use(wpconfig.output.publicPath, express.static('public'));

const compiler = webpack(wpconfig);
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: wpconfig.output.publicPath
}));

app.use(morgan('combined'));

app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('Hello');
  }
});

app.use('/api', api);
