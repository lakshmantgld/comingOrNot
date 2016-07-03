
var mongoose = require('mongoose');

module.exports = mongoose.model('Deploydetails',{
  username: String,
  accountName: String,
  deployScratch: Boolean,
  version: String,
  vpcName: String,
  publicSecurityGroup: String,
  privateSecurityGroup: String,
  workerDetails: [
    {
      size: String,
      workerIp: String,
      securityGroup: String,
      instanceId: String
    }
  ],
  masterDetails: {
    size: String,
    masterIp: String,
    securityGroup: String,
    instanceId: String
  },
  rpDetails: {
    size: String,
    rpIp: String,
    securityGroup: String,
    instanceId: String
  }
});
