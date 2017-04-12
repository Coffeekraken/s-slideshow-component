module.exports = {
	entry: {
	},
	output: {
		path: '.',
		filename: '[name]',
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(bower_components|node_modules)/,
			loader: 'babel-loader'
		}]
	}
}
