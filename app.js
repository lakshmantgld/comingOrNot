import express from 'express';
import path from 'path';
import session from 'express-session';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import url from 'url';
import http from 'http';

import config from './config/config.json';

let uristring = 'mongodb://heroku_gb9thp1q:5t12qp32n228q27hhrfekechv4@ds031867.mlab.com:31867/heroku_gb9thp1q';

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});// connect to DB
// mongoose.connect(url.format({
//   protocol: config.mongodb.protocol,
//   slashes: true,
//   hostname: config.mongodb.hostname,
//   port: config.mongodb.port,
//   pathname: config.mongodb.path
// }));

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/registerEvent', require('./routes/api/registerEvent'));
app.use('/api/fetchEvent', require('./routes/api/fetchEvent'));
app.use('/api/updateEvent', require('./routes/api/updateEvent'));
app.use('/', require('./routes/index'));

/* Error Handlers */
// 404: Not Found
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 500: Internal Server Error (in development mode)
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 500: Internal Server Error (in production mode)
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

let server = http.createServer(app);
server.listen(port);

server.on('error', onError);
server.on('listening', onListening);
function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
