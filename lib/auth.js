import url from 'url';
import request from 'request';
import User from './../models/user';
import config from './../config/config.json';

const authorizationURL = url.format({
  protocol: config.oauth.protocol,
  hostname: config.oauth.hostname,
  port: config.oauth.port,
  pathname: config.oauth.authorizeURL
});
const tokenURL = url.format({
  protocol: config.oauth.protocol,
  hostname: config.oauth.hostname,
  port: config.oauth.port,
  pathname: config.oauth.tokenURL
});
const profileURL = url.format({
  protocol: config.oauth.protocol,
  hostname: config.oauth.hostname,
  port: config.oauth.port,
  pathname: config.oauth.profileURL
});
const oauth2Strategy = {
  authorizationURL: authorizationURL,
  tokenURL: tokenURL,
  clientID: config.oauth.clientID,
  clientSecret: config.oauth.clientSecret,
  callbackURL: config.oauth.callbackURL
};

function serializeUser(user, callback) {
  callback(null, user.userId);
}

function deserializeUser(userId, callback) {
  User.get(userId, function(err, user) {
    callback(err, user[0]);
  });
}

function authenticate(accessToken, refreshToken, profile, callback) {
  request({method: 'GET', uri: profileURL,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }},
  (e, response, body) => {
    if (e) {
      console.log('error: ' + e);
      return callback(e);
    } else if (!body) {
      console.log('error: could not get the body');
      return callback('could not get the body');
    }

    let parsedBody = JSON.parse(body);
    User.saveOnce(parsedBody.name, parsedBody.emails[0].email, callback);
  });
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else if (req.path === '/') {
    return next();
  }
  res.redirect('/');
}

module.exports = {
  oauth2Strategy: oauth2Strategy,
  serializeUser: serializeUser,
  deserializeUser: deserializeUser,
  authenticate: authenticate,
  isAuthenticated: isAuthenticated
};
