const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
	return {
		entry: './src/index.tsx',
		devtool: argv.mode === 'development' ? 'source-map' : false,
		module: {
			rules: [
				{
					test: /\.(j|t)sx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					options: {
						presets: ['@babel/env'],
					},
				},
				{
					enforce: 'pre',
					test: /\.js$/,
					loader: 'source-map-loader',
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.woff2?$/,
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts/',
					},
				},
			],
		},
		resolve: {
			extensions: ['*', '.json', '.js', '.jsx', '.ts', '.tsx'],
			alias: {
				'react-dom': '@hot-loader/react-dom',
			},
		},
		output: {
			path: path.resolve(__dirname, 'docs/'),
			publicPath: '/docs/',
			filename: 'index.js',
		},
		devServer: {
			contentBase: path.join(__dirname, 'public/'),
			port: 3000,
			publicPath: 'http://localhost:3000/docs/',
			hotOnly: true,
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
		],
	};
};