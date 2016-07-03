import mongoose, { Schema, Types } from 'mongoose';

const DeploymentSchema = new Schema({
  userId: String,
  accountId: String,
  playbookId: String,
  componentInformation: [{
    name: String,
    id: [String]
  }],
  systemName: String,
  description: String,
  status: String
});

const Deployment = mongoose.model('Deployment', DeploymentSchema);

function getList(userId, accountId, callback) {
  Deployment.find({userId: userId, accountId: accountId}, callback);
}

function getDeployment(deploymentId, callback) {
  Deployment.findOne({_id: Types.ObjectId(deploymentId)}, callback);
}

function save(userId, accountId, playbookId, componentInformation, systemName, description, status, callback) {
  let deployment = new Deployment({userId: userId, accountId: accountId, playbookId: playbookId, componentInformation: componentInformation, systemName: systemName, description: description, status: status});
  deployment.save(callback);
}

module.exports = {
  getList: getList,
  getDeployment: getDeployment,
  save: save
};
