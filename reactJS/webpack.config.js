var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/js');
var APP_DIR = path.resolve(__dirname, 'app');

var config = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:3000/',
    APP_DIR + '/main.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: "http://localhost:3000/dist/",
    filename: 'app.js'
  },
  resolve: {
      modulesDirectories: ['node_modules', 'app'],
      extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  },
  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
  ]
};

// for production env - this reduces the size by 3/4 th. In our case from 12mb to 1mb.
/* plugins: [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
] */

/*
1. remove entry array and have just **entry: APP_DIR + '/main.js'**
2. remove devtool: 'inline-source-map'
3. Add the commented plugin to the plugin in webpack.config.
*/

module.exports = config;
