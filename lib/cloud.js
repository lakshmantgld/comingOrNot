import aws from 'aws-sdk';

class Cloud {
  constructor(accessKeyId, secretAccessKey, region) {
    aws.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region
    });
  }

  isValidKey(callback) {
    const ec2 = new aws.EC2();
    ec2.describeRegions({}, function(err) {
      if (err) {
        return callback(err);
      }

      callback(null);
    });
  }

  getVpcList(callback) {
    const ec2 = new aws.EC2();
    ec2.describeVpcs({}, callback);
  }

  getSecurityGroupList(vpcId, callback) {
    const ec2 = new aws.EC2();
    if (vpcId) {
      ec2.describeSecurityGroups({Filters: [{Name: 'vpc-id', Values: [vpcId]}]}, callback);
    } else {
      ec2.describeSecurityGroups({}, callback);
    }
  }

  getSubnetList(vpcId, callback) {
    const ec2 = new aws.EC2();
    if (vpcId) {
      ec2.describeSubnets({Filters: [{Name: 'vpc-id', Values: [vpcId]}]}, callback);
    } else {
      ec2.describeSubnets({}, callback);
    }
  }

  getInstanceDetails(instanceTag, callback) {
    const ec2 = new aws.EC2();
    ec2.describeInstances({Filters: [{Name: 'tag:Name', Values: [instanceTag]}]}, callback);
  }
}

export default Cloud;
