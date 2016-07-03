import mongoose, { Schema, Types } from 'mongoose';

const PlaybookSchema = new Schema({
  systemName: String,
  developerId: String,
  description: String,
  playbookPath: String,
  variables: [{
    name: String,
    variableType: String
  }]
});

const Playbook = mongoose.model('Playbook', PlaybookSchema);

function getList(callback) {
  Playbook.find({}, callback);
}

function getPlaybook(playbookId, callback) {
  Playbook.findOne({_id: Types.ObjectId(playbookId)}, callback);
}

function save(userId, systemName, description, playbookPath, variables, callback) {
  Playbook.find({systemName: systemName}, (err, res) => {
    if (err) {
      return callback(err);
    }
    if (res.length > 0) {
      return callback(systemName + ' is already used.');
    }

    let playbook = new Playbook({systemName: systemName, developerId: userId, description: description, playbookPath: playbookPath, variables: variables});
    playbook.save(callback);
  });
}

module.exports = {
  getList: getList,
  getPlaybook: getPlaybook,
  save: save
};
