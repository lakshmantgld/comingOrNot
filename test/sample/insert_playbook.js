require('babel-register');

var config = require('./../../config/config.json');
var mongoose = require('mongoose');
var url = require('url');
var playbook = require('./../../models/playbook');

var systemName = 'samplePlaybook';
var developerId = 'fx99999';
var description = 'this is a sample playbook';
var playbookPath = 'sample/sample_playbook.yml';
var variables = [];

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

  playbook.save(developerId, systemName, description, playbookPath, variables, function(err, res) {
    if (err) {
      console.log('err: ', err);
      mongoose.connection.close();
      return;
    }

    console.log('res: ', res);
    mongoose.connection.close();
  });
});
