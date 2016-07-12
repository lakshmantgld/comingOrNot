require('babel-register');

var config = require('./../../config/config.json');
var mongoose = require('mongoose');
var url = require('url');
var playbook = require('./../../models/playbook');

var systemName = 'variableSupport';
var developerId = 'fx99999';
var description = 'performing some operations in the SSHed instance using user variables';
var playbookPath = 'variableSupport/variable_support.yml';
var variables = [{'name': 'instanceType', 'variableType': 'string'},
                 {'name': 'instanceCount', 'variableType': 'number'},
                 {'name': 'subnetId', 'variableType': 'string'},
                 {'name': 'securityGroups', 'variableType': 'array'},
                 {'name': 'keypair', 'variableType': 'string'},
                 {'name': 'port', 'variableType': 'number'},
                 {'name': 'instanceTag', 'variableType': 'string'}];

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
