import express from 'express';
import webpack from 'webpack';
import morgan from 'morgan';

const port = 5555;
const app = express();

app.use(express.static('public'));

import wpconfig from '../../webpack.config.dev';
const compiler = webpack(wpconfig);
app.use(require('webpack-dev-middleware')(compiler, {
	    noInfo: true,
	    publicPath: wpconfig.output.publicPath
}));

app.use(morgan('dev'));

app.listen(port, err => {
	if(err) {
		console.log(err);
	} else {
		console.log("Hello");
	}
});

import api from './api';
app.use('/api', api);
