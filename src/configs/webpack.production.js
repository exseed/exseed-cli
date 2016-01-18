import webpack from 'webpack';
import defaultBabelConfig from './babel.default';

export default {
  devtool: 'source-map',
  entry: {},
  output: {
    filename: '[name]/public/js/bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        // This is a loader-specific option, do not put it on .babelrc
        // see https://github.com/babel/babel-loader#options
        cacheDirectory: true,
        ...defaultBabelConfig,
      },
    },],
  },
};