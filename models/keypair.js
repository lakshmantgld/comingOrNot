import mongoose, { Schema, Types } from 'mongoose';

const KeyPairSchema = new Schema({
  userId: String,
  keyPairName: String,
  description: String,
  originalName: String,
  fileName: String,
  encoding: String,
  mimeType: String,
  created: { type: Date, default: Date.now}
});

const KeyPair = mongoose.model('KeyPair', KeyPairSchema);

function getKeyPair(userId, keyId, callback) {
  KeyPair.findOne({userId: userId, _id: Types.ObjectId(keyId)}, callback);
}

function save(userId, keyPairName, description, originalName, fileName, encoding, mimeType, callback) {
  KeyPair.count({userId: userId, keyPairName: keyPairName}, (err, number) => {
    if (err) {
      return callback(err);
    }
    if (number !== 0) {
      return callback(keyPairName + ' is already registered.');
    }

    let keypair = new KeyPair({userId: userId, keyPairName: keyPairName, description: description,
      originalName: originalName, fileName: fileName, encoding: encoding, mimeType: mimeType});
    keypair.save(callback);
  });
}

module.exports = {
  save: save,
  getKeyPair: getKeyPair
};
