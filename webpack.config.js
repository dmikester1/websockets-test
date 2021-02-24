/* eslint-env node */

const webpack = require('webpack');
const dotenv = require('dotenv');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = () => {
	// call dotenv and it will return an Object with a parsed key
	const env = dotenv.config().parsed;

	// reduce it to a nice object, the same as before
	const envKeys = Object.keys(env).reduce((prev, next) => {
		prev[`process.env.${next}`] = JSON.stringify(env[next]);
		return prev;
	}, {});

	return {
		entry: './src/index.js',
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: [/node_modules/],
					loader: ['babel-loader', 'eslint-loader']
				},
				{
					test: /\.(png|woff|woff2|eot|ttf|svg)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'url-loader?limit=100000',
							options: {
								name: '[name].[ext]',
								limit: 1024,
								publicPath: 'dist/assets/',
								outputPath: 'dist/assets/'
							}
						}
					]
				},
				{
					test: /\.(s[ac]ss)|(css)$/i,
					use: [
						// Creates `style` nodes from JS strings
						'style-loader',
						// Translates CSS into CommonJS
						'css-loader',
						// Compiles Sass to CSS
						'sass-loader'
					]
				},
				{
					test: /\.(png|svg|jpg|gif)$/,
					use: ['file-loader']
				}
			]
		},
		resolve: {
			extensions: ['*', '.js', '.jsx']
		},
		output: {
			// path: __dirname + '/dist',
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/',
			filename: 'bundle.js'
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin(envKeys)
		],
		devServer: {
			contentBase: './dist',
			hot: true
		},
		devtool: 'source-map'
	};
};
