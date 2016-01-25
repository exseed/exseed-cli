import webpack from 'webpack';
import livereloadBabelConfig from './babel.livereload';

export default {
  devtool: 'eval',
  entry: {},
  output: {
    // this config is not for output scripts into file system
    // and the `filename` here is actually the routing path
    filename: '[name]/js/bundle.js',
    publicPath: '/',
  },
  resolve: {
    alias: {},
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
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
        ...livereloadBabelConfig,
      },
    },],
  },
};