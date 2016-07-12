import express from 'express';
import path from 'path';
import session from 'express-session';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import mongoose from 'mongoose';
import url from 'url';
import http from 'http';
import socket from './socket';

import auth from './lib/auth';
import config from './config/config.json';

// Connect to DB
mongoose.connect(url.format({
  protocol: config.mongodb.protocol,
  slashes: true,
  hostname: config.mongodb.hostname,
  port: config.mongodb.port,
  pathname: config.mongodb.path
}));

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
app.use(session({
  secret: 'secretkey4ansible-web',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(auth.serializeUser);
passport.deserializeUser(auth.deserializeUser);
passport.use('oauth', new OAuth2Strategy(auth.oauth2Strategy, auth.authenticate));

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
import flash from 'connect-flash';
app.use(flash());

app.use('/research', require('./routes/research'));
app.use('/runplaybook', require('./routes/runplaybook'));
app.use('/modrunplaybook', require('./routes/modrunplaybook'));

app.use('/login', passport.authenticate('oauth'));
app.use('/auth', passport.authenticate('oauth', {successRedirect: '/account/list', failureRedirect: '/'}));
app.use('/api/account', auth.isAuthenticated, require('./routes/api/account'));
app.use('/api/aws', auth.isAuthenticated, require('./routes/api/aws'));
app.use('/api/component', auth.isAuthenticated, require('./routes/api/component'));
app.use('/api/deployment', auth.isAuthenticated, withSocketIo, require('./routes/api/deployment'));
app.use('/api/keypair', auth.isAuthenticated, require('./routes/api/keypair'));
app.use('/api/playbook', auth.isAuthenticated, require('./routes/api/playbook'));
app.use('/', auth.isAuthenticated, require('./routes/index'));

function withSocketIo(req, res, next) {
  if (!req.io) {
    req.io = socket;
  }
  next();
}

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
socket.attach(server.listen(port));

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
