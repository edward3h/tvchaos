import webpack from 'webpack';
import path from 'path';

export default {
    devtool: 'inline-source-map',
    entry: './client/src/app.jsx',
    output: {
        filename: 'client.js',
        path: path.resolve(__dirname, 'public'),
        publicPath: 'auto'
    },
    module: {
	      rules: [
	            {
		            test: /\.(js|jsx)$/,
		            exclude: /node_modules/,
		            use: [
		              'babel-loader',
		            ],
	          },
        ],
    },
    // Enable importing JS files without specifying their's extenstion -> ADDED IN THIS STEP
    //
    // So we can write:
    // import MyComponent from './my-component';
    //
    // Instead of:
    // import MyComponent from './my-component.jsx';
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
