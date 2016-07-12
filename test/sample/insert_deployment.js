require('babel-register');

var config = require('./../../config/config.json');
var mongoose = require('mongoose');
var url = require('url');
var deployment = require('./../../models/deployment');

var userId = 'fx99999';
var accountId = '56f4a99fffa46230747b2593';
var systemName = 'sample-system-2';
var description = 'this is the sample description for sample-system';
var status = 'red';

mongoose.connect(url.format({
  protocol: config.mongodb.protocol,
  slashes: true,
  hostname: config.mongodb.hostname,
  port: config.mongodb.port,
  pathname: config.mongodb.path
}), function(error) {
  if (error) {
    console.log(error);
    return;
  }

  deployment.save(userId, accountId, systemName, description, status, function(err, res) {
    if (err) {
      console.log('err: ', err);
      mongoose.connection.close();
      return;
    }

    console.log('res: ', res);
    mongoose.connection.close();
  });
});
