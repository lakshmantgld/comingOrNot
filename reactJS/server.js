var webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config = require('./webpack.config.js');

// This was finished at 2016-12-09 21:15. Had one of the hard times with webpack.
// These are the times, where we hate open source.

// Now, here we have two servers running.
// 1 - WebpackDevServer for bundling assets or hot-reloading
// 2 - for serving other files

// The main server is express. It proxies to webpack-dev-server for bundles reactJS file

var path = require('path');
var express = require('express');
var proxy = require('proxy-middleware');
var url = require('url');
var bodyParser = require('body-parser');
var contentType = {
    '.html': 'text/html',
    '.css': "text/css",
    '.js': 'application/javascript'
};

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// This is the place where bundle happens.
app.use('/dist', proxy(url.parse('http://localhost:3000/dist')));
app.use('/event/dist', proxy(url.parse('http://localhost:3000/dist')));

app.get('/*', function(req, res) {
    // console.log(req.route);
    res.setHeader('Content-Type',contentType);
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    historyApiFallback: true
}).listen(PORT, function(err, result) {
    if (err) console.log(err);
    console.log('Listening at port '+ PORT);
});

app.listen(8080);
